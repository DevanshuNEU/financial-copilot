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
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"])

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

class Budget(db.Model):
    __tablename__ = 'budgets'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Enum(ExpenseCategory), nullable=False, unique=True)
    monthly_limit = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category.value,
            'monthly_limit': self.monthly_limit,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
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

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    try:
        expense = Expense.query.get_or_404(expense_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'amount' in data:
            expense.amount = data['amount']
        if 'category' in data:
            expense.category = ExpenseCategory(data['category'])
        if 'description' in data:
            expense.description = data['description']
        if 'vendor' in data:
            expense.vendor = data['vendor']
        if 'status' in data:
            expense.status = ExpenseStatus(data['status'])
        
        db.session.commit()
        
        return jsonify(expense.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    try:
        expense = Expense.query.get_or_404(expense_id)
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
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

# Budget Management Endpoints
@app.route('/api/budgets', methods=['GET'])
def get_budgets():
    try:
        budgets = Budget.query.all()
        return jsonify({
            'budgets': [budget.to_dict() for budget in budgets]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budgets', methods=['POST'])
def create_or_update_budget():
    try:
        data = request.get_json()
        category = ExpenseCategory(data['category'])
        monthly_limit = float(data['monthly_limit'])
        
        # Check if budget already exists for this category
        existing_budget = Budget.query.filter_by(category=category).first()
        
        if existing_budget:
            # Update existing budget
            existing_budget.monthly_limit = monthly_limit
            existing_budget.updated_at = datetime.utcnow()
        else:
            # Create new budget
            budget = Budget(
                category=category,
                monthly_limit=monthly_limit
            )
            db.session.add(budget)
        
        db.session.commit()
        
        # Return updated budget
        budget = Budget.query.filter_by(category=category).first()
        return jsonify(budget.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/safe-to-spend', methods=['GET'])
def get_safe_to_spend():
    try:
        from datetime import datetime, date
        from calendar import monthrange
        
        # Get current month's start and end dates
        today = date.today()
        start_of_month = datetime(today.year, today.month, 1)
        _, last_day = monthrange(today.year, today.month)
        end_of_month = datetime(today.year, today.month, last_day, 23, 59, 59)
        
        # Get all budgets
        budgets = {budget.category: budget.monthly_limit for budget in Budget.query.all()}
        
        # Get current month's spending by category
        from sqlalchemy import func, and_
        monthly_spending = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('spent')
        ).filter(
            and_(
                Expense.created_at >= start_of_month,
                Expense.created_at <= end_of_month
            )
        ).group_by(Expense.category).all()
        
        spending_by_category = {spending.category: float(spending.spent) for spending in monthly_spending}
        
        # Calculate safe-to-spend data
        total_budget = sum(budgets.values())
        total_spent = sum(spending_by_category.values())
        
        budget_status = []
        total_remaining = 0
        
        for category, limit in budgets.items():
            spent = spending_by_category.get(category, 0)
            remaining = limit - spent
            over_budget = max(0, spent - limit)
            
            budget_status.append({
                'category': category.value,
                'limit': limit,
                'spent': spent,
                'remaining': max(0, remaining),
                'over_budget': over_budget,
                'percentage_used': (spent / limit * 100) if limit > 0 else 0
            })
            
            total_remaining += max(0, remaining)
        
        # Calculate discretionary spending (categories without strict budgets)
        discretionary_categories = ['meals', 'other', 'marketing']  # More flexible categories
        discretionary_remaining = sum(
            max(0, budgets.get(ExpenseCategory(cat), 0) - spending_by_category.get(ExpenseCategory(cat), 0))
            for cat in discretionary_categories if ExpenseCategory(cat) in budgets
        )
        
        return jsonify({
            'safe_to_spend': {
                'total_budget': total_budget,
                'total_spent': total_spent,
                'total_remaining': total_remaining,
                'discretionary_remaining': discretionary_remaining,
                'days_left_in_month': (end_of_month.date() - today).days + 1,
                'daily_safe_amount': discretionary_remaining / max(1, (end_of_month.date() - today).days + 1)
            },
            'budget_status': budget_status,
            'recommendations': {
                'can_spend_today': discretionary_remaining / max(1, (end_of_month.date() - today).days + 1),
                'status': 'on_track' if total_spent <= total_budget * 0.8 else 'over_budget' if total_spent > total_budget else 'caution'
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database and add sample data
def init_and_seed():
    with app.app_context():
        db.create_all()
        
        # Check if we already have expense data
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
        
        # Check if we already have budget data
        if Budget.query.count() == 0:
            # Sample student budget (monthly amounts in USD)
            sample_budgets = [
                {"category": ExpenseCategory.MEALS, "monthly_limit": 400.00},  # Food/groceries
                {"category": ExpenseCategory.TRAVEL, "monthly_limit": 100.00},  # Transport
                {"category": ExpenseCategory.OFFICE, "monthly_limit": 50.00},   # Supplies/books
                {"category": ExpenseCategory.SOFTWARE, "monthly_limit": 30.00}, # Subscriptions
                {"category": ExpenseCategory.UTILITIES, "monthly_limit": 150.00}, # Phone, internet share
                {"category": ExpenseCategory.MARKETING, "monthly_limit": 200.00}, # Entertainment/social
                {"category": ExpenseCategory.OTHER, "monthly_limit": 100.00},   # Miscellaneous
            ]
            
            for budget_data in sample_budgets:
                budget = Budget(
                    category=budget_data["category"],
                    monthly_limit=budget_data["monthly_limit"]
                )
                db.session.add(budget)
            
            db.session.commit()
            print(f"Database seeded with {len(sample_budgets)} sample budgets!")
            print("Total monthly budget: $1,030 (typical international student budget)")

if __name__ == '__main__':
    init_and_seed()
    app.run(debug=True, host='0.0.0.0', port=5002)
