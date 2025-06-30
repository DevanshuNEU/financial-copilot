from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Expense, User

bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')

@bp.route('/<int:expense_id>', methods=['GET'])
@jwt_required()
def get_expense(expense_id):
    """Get a specific expense"""
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first_or_404()
        return jsonify(expense.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['GET'])
@jwt_required()
def list_expenses():
    """List all expenses for authenticated user"""
    try:
        user_id = get_jwt_identity()
        expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.created_at.desc()).all()
        return jsonify([expense.to_dict() for expense in expenses])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['POST'])
@jwt_required()
def create_expense():
    """Create a new expense"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('amount') or not data.get('category'):
            return jsonify({'error': 'Amount and category are required'}), 400
        
        expense = Expense(
            user_id=user_id,
            amount=data['amount'],
            category=data['category'],
            description=data.get('description', ''),
            vendor=data.get('vendor', '')
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify(expense.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
