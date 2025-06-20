from app import create_app, db, socketio
from app.models import Expense, AIInsight
import os

app = create_app()

@app.cli.command()
def init_db():
    """Initialize the database."""
    db.create_all()
    print("Database initialized!")

@app.cli.command()
def seed_db():
    """Seed the database with sample data."""
    from app.models import ExpenseCategory, ExpenseStatus
    from datetime import datetime, timedelta
    import random
    
    # Sample data
    sample_expenses = [
        {"amount": 45.67, "category": ExpenseCategory.MEALS, "description": "Team lunch", "vendor": "Pizza Palace"},
        {"amount": 120.00, "category": ExpenseCategory.SOFTWARE, "description": "Monthly subscription", "vendor": "Adobe"},
        {"amount": 89.99, "category": ExpenseCategory.OFFICE, "description": "Office supplies", "vendor": "Staples"},
        {"amount": 250.00, "category": ExpenseCategory.TRAVEL, "description": "Flight booking", "vendor": "United Airlines"},
        {"amount": 35.20, "category": ExpenseCategory.UTILITIES, "description": "Internet bill", "vendor": "Comcast"},
        {"amount": 75.00, "category": ExpenseCategory.MARKETING, "description": "Social media ads", "vendor": "Facebook"},
        {"amount": 12.50, "category": ExpenseCategory.MEALS, "description": "Coffee meeting", "vendor": "Starbucks"},
        {"amount": 299.99, "category": ExpenseCategory.SOFTWARE, "description": "Development tools", "vendor": "JetBrains"},
        {"amount": 450.00, "category": ExpenseCategory.TRAVEL, "description": "Hotel stay", "vendor": "Marriott"},
        {"amount": 28.99, "category": ExpenseCategory.OFFICE, "description": "Notebooks", "vendor": "Amazon"},
    ]
    
    # Create expenses with dates spread over last 30 days
    for i, exp_data in enumerate(sample_expenses):
        created_date = datetime.utcnow() - timedelta(days=random.randint(0, 30))
        
        expense = Expense(
            amount=exp_data["amount"],
            category=exp_data["category"],
            description=exp_data["description"],
            vendor=exp_data["vendor"],
            status=random.choice(list(ExpenseStatus)),
            ai_confidence=random.uniform(0.7, 0.95),
            created_at=created_date
        )
        
        db.session.add(expense)
    
    db.session.commit()
    print(f"Database seeded with {len(sample_expenses)} sample expenses!")

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
