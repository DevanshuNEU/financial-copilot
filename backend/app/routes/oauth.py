# OAuth 2.0 authentication routes for Financial Copilot
# Handles Google, GitHub, and other OAuth providers

from flask import Blueprint, request, redirect, url_for, jsonify, current_app
from flask_jwt_extended import create_access_token
from authlib.integrations.flask_client import OAuth
from app import db
from app.models import User
import os
import secrets
import urllib.parse

bp = Blueprint('oauth', __name__, url_prefix='/api/auth')

# Initialize OAuth
oauth = OAuth()

def init_oauth(app):
    """Initialize OAuth with Flask app."""
    oauth.init_app(app)
    
    # Google OAuth
    google = oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
        client_kwargs={'scope': 'openid email profile'}
    )
    
    # GitHub OAuth
    github = oauth.register(
        name='github',
        client_id=os.getenv('GITHUB_CLIENT_ID'),
        client_secret=os.getenv('GITHUB_CLIENT_SECRET'),
        access_token_url='https://github.com/login/oauth/access_token',
        authorize_url='https://github.com/login/oauth/authorize',
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'}
    )
    
    return oauth

@bp.route('/google')
def google_login():
    """Initiate Google OAuth login."""
    try:
        # Generate state for CSRF protection
        state = secrets.token_urlsafe(32)
        
        # Get frontend URL for redirect
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        redirect_uri = url_for('oauth.google_callback', _external=True)
        
        return oauth.google.authorize_redirect(redirect_uri, state=state)
        
    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        error_url = f"{frontend_url}/auth?error=oauth_failed"
        return redirect(error_url)

@bp.route('/google/callback')
def google_callback():
    """Handle Google OAuth callback."""
    try:
        # Get token from Google
        token = oauth.google.authorize_access_token()
        
        if not token:
            raise Exception("Failed to get access token")
        
        # Get user info from Google
        user_info = token.get('userinfo')
        if not user_info:
            # Fallback: get user info manually
            resp = oauth.google.parse_id_token(token)
            user_info = resp
        
        email = user_info.get('email')
        if not email:
            raise Exception("No email received from Google")
        
        # Find or create user
        user = User.query.filter_by(email=email.lower()).first()
        
        if not user:
            # Create new user from Google data
            user = User(
                email=email.lower(),
                first_name=user_info.get('given_name', ''),
                last_name=user_info.get('family_name', ''),
                is_active=True
            )
            # Set a random password (user won't use it)
            user.set_password(secrets.token_urlsafe(32))
            
            db.session.add(user)
            db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Redirect to frontend with token
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        success_url = f"{frontend_url}/auth?token={access_token}"
        return redirect(success_url)
        
    except Exception as e:
        current_app.logger.error(f"Google OAuth error: {str(e)}")
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        error_url = f"{frontend_url}/auth?error=oauth_failed"
        return redirect(error_url)

@bp.route('/github')
def github_login():
    """Initiate GitHub OAuth login."""
    try:
        redirect_uri = url_for('oauth.github_callback', _external=True)
        return oauth.github.authorize_redirect(redirect_uri)
        
    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        error_url = f"{frontend_url}/auth?error=oauth_failed"
        return redirect(error_url)

@bp.route('/github/callback')
def github_callback():
    """Handle GitHub OAuth callback."""
    try:
        # Get token from GitHub
        token = oauth.github.authorize_access_token()
        
        if not token:
            raise Exception("Failed to get access token")
        
        # Get user info from GitHub
        resp = oauth.github.get('user', token=token)
        user_info = resp.json()
        
        # Get email (GitHub might not provide email in user endpoint)
        email = user_info.get('email')
        if not email:
            # Try to get email from emails endpoint
            emails_resp = oauth.github.get('user/emails', token=token)
            emails = emails_resp.json()
            
            # Find primary email
            for email_obj in emails:
                if email_obj.get('primary'):
                    email = email_obj.get('email')
                    break
            
            if not email and emails:
                email = emails[0].get('email')
        
        if not email:
            raise Exception("No email received from GitHub")
        
        # Find or create user
        user = User.query.filter_by(email=email.lower()).first()
        
        if not user:
            # Create new user from GitHub data
            full_name = user_info.get('name', '').split(' ', 1)
            first_name = full_name[0] if full_name else ''
            last_name = full_name[1] if len(full_name) > 1 else ''
            
            user = User(
                email=email.lower(),
                first_name=first_name,
                last_name=last_name,
                is_active=True
            )
            # Set a random password (user won't use it)
            user.set_password(secrets.token_urlsafe(32))
            
            db.session.add(user)
            db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Redirect to frontend with token
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        success_url = f"{frontend_url}/auth?token={access_token}"
        return redirect(success_url)
        
    except Exception as e:
        current_app.logger.error(f"GitHub OAuth error: {str(e)}")
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        error_url = f"{frontend_url}/auth?error=oauth_failed"
        return redirect(error_url)
