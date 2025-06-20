from .. import db
from datetime import datetime
from enum import Enum

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

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
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
