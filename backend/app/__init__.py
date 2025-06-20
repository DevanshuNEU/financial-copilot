from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 
        'postgresql://localhost/financial_copilot'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins="*")
    
    # CORS configuration
    CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
    
    # Register blueprints
    from app.routes import expenses, receipts, ai, dashboard
    app.register_blueprint(expenses.bp)
    app.register_blueprint(receipts.bp)
    app.register_blueprint(ai.bp)
    app.register_blueprint(dashboard.bp)
    
    return app
