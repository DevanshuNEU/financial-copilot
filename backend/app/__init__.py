from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for dev
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 
        'postgresql://localhost/financial_copilot'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins="*")
    jwt.init_app(app)
    
    # CORS configuration
    CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
    
    # Initialize OAuth
    from app.routes.oauth import init_oauth
    oauth = init_oauth(app)
    
    # Register blueprints
    from app.routes import expenses, receipts, ai, dashboard, auth, onboarding, oauth
    app.register_blueprint(expenses.bp)
    app.register_blueprint(receipts.bp)
    app.register_blueprint(ai.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(onboarding.bp)
    app.register_blueprint(oauth.bp)
    
    return app
