from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from datetime import datetime
from enum import Enum

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///financial_copilot.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:3002", "http://localhost:3001", "http://localhost:3000"])

# Models
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
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.Enum(ExpenseCategory), nullable=False)
    description = db.Column(db.Text)
    vendor = db.Column(db.String(255))
    status = db.Column(db.Enum(ExpenseStatus), default=ExpenseStatus.PENDING)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'category': self.category.value,
            'description': self.description,
            'vendor': self.vendor,
            'status': self.status.value,
            'created_at': self.created_at.isoformat()
        }

# Routes
@app.route('/')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Financial Copilot API is running',
        'version': '1.0.0'
    })

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    try:
        expenses = Expense.query.all()
        return jsonify({
            'expenses': [expense.to_dict() for expense in expenses],
            'total': len(expenses)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses', methods=['POST'])
def create_expense():
    try:
        data = request.get_json()
        
        expense = Expense(
            amount=data['amount'],
            category=ExpenseCategory(data['category']),
            description=data.get('description', ''),
            vendor=data.get('vendor', ''),
            status=ExpenseStatus(data.get('status', 'pending'))
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify(expense.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    try:
        total_expenses = db.session.query(db.func.sum(Expense.amount)).scalar() or 0
        expense_count = Expense.query.count()
        
        # Category breakdown
        from sqlalchemy import func
        category_data = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total'),
            func.count(Expense.id).label('count')
        ).group_by(Expense.category).all()
        
        return jsonify({
            'overview': {
                'total_expenses': float(total_expenses),
                'total_transactions': expense_count
            },
            'category_breakdown': [
                {
                    'category': cat.value,
                    'total': float(total),
                    'count': count
                }
                for cat, total, count in category_data
            ]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database and add sample data
def init_and_seed():
    with app.app_context():
        db.create_all()
        
        # Check if we already have data
        if Expense.query.count() == 0:
            sample_expenses = [
                {"amount": 45.67, "category": ExpenseCategory.MEALS, "description": "Team lunch", "vendor": "Pizza Palace"},
                {"amount": 120.00, "category": ExpenseCategory.SOFTWARE, "description": "Monthly subscription", "vendor": "Adobe"},
                {"amount": 89.99, "category": ExpenseCategory.OFFICE, "description": "Office supplies", "vendor": "Staples"},
                {"amount": 250.00, "category": ExpenseCategory.TRAVEL, "description": "Flight booking", "vendor": "United Airlines"},
                {"amount": 35.20, "category": ExpenseCategory.UTILITIES, "description": "Internet bill", "vendor": "Comcast"},
            ]
            
            for exp_data in sample_expenses:
                expense = Expense(
                    amount=exp_data["amount"],
                    category=exp_data["category"],
                    description=exp_data["description"],
                    vendor=exp_data["vendor"]
                )
                db.session.add(expense)
            
            db.session.commit()
            print(f"Database seeded with {len(sample_expenses)} sample expenses!")

if __name__ == '__main__':
    init_and_seed()
    app.run(debug=True, host='0.0.0.0', port=5002)
