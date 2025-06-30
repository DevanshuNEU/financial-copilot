from .. import db
from datetime import datetime
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash
import json

class ExpenseCategory(Enum):
    MEALS = "meals"
    TRAVEL = "travel"
    OFFICE = "office"
    SOFTWARE = "software"
    MARKETING = "marketing"
    UTILITIES = "utilities"
    OTHER = "other"

class ExpenseStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    onboarding_data = db.relationship('OnboardingData', backref='user', uselist=False, cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'has_onboarding_data': self.onboarding_data is not None
        }

class OnboardingData(db.Model):
    __tablename__ = 'onboarding_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Core financial data
    monthly_budget = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='USD', nullable=False)
    has_meal_plan = db.Column(db.Boolean, default=False)
    
    # JSON fields for complex data
    fixed_costs = db.Column(db.JSON, default=list)  # [{"name": "Rent", "amount": 800, "category": "housing"}]
    spending_categories = db.Column(db.JSON, default=dict)  # {"food": 200, "transport": 100}
    
    # Completion tracking
    is_complete = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_fixed_costs(self):
        """Return fixed costs as list of dicts."""
        return self.fixed_costs or []
    
    def set_fixed_costs(self, costs_list):
        """Set fixed costs from list of dicts."""
        self.fixed_costs = costs_list or []
    
    def get_spending_categories(self):
        """Return spending categories as dict."""
        return self.spending_categories or {}
    
    def set_spending_categories(self, categories_dict):
        """Set spending categories from dict."""
        self.spending_categories = categories_dict or {}
    
    def calculate_total_fixed_costs(self):
        """Calculate total monthly fixed costs."""
        fixed_costs = self.get_fixed_costs()
        return sum(float(cost.get('amount', 0)) for cost in fixed_costs)
    
    def calculate_available_budget(self):
        """Calculate available budget after fixed costs."""
        return float(self.monthly_budget) - self.calculate_total_fixed_costs()
    
    def calculate_total_spending_categories(self):
        """Calculate total allocated to spending categories."""
        categories = self.get_spending_categories()
        return sum(float(amount) for amount in categories.values())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'monthly_budget': float(self.monthly_budget),
            'currency': self.currency,
            'has_meal_plan': self.has_meal_plan,
            'fixed_costs': self.get_fixed_costs(),
            'spending_categories': self.get_spending_categories(),
            'is_complete': self.is_complete,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'calculated': {
                'total_fixed_costs': self.calculate_total_fixed_costs(),
                'available_budget': self.calculate_available_budget(),
                'total_spending_categories': self.calculate_total_spending_categories()
            }
        }

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.Enum(ExpenseCategory), nullable=False)
    description = db.Column(db.Text)
    vendor = db.Column(db.String(255))
    receipt_url = db.Column(db.String(500))
    status = db.Column(db.Enum(ExpenseStatus), default=ExpenseStatus.PENDING)
    ai_confidence = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ai_insights = db.relationship('AIInsight', backref='expense', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'category': self.category.value,
            'description': self.description,
            'vendor': self.vendor,
            'receipt_url': self.receipt_url,
            'status': self.status.value,
            'ai_confidence': self.ai_confidence,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class AIInsight(db.Model):
    __tablename__ = 'ai_insights'
    
    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)
    prediction = db.Column(db.Text)
    confidence_score = db.Column(db.Float)
    anomaly_detected = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'prediction': self.prediction,
            'confidence_score': self.confidence_score,
            'anomaly_detected': self.anomaly_detected,
            'created_at': self.created_at.isoformat()
        }
