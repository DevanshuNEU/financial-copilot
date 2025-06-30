from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, OnboardingData
from datetime import datetime

bp = Blueprint('onboarding', __name__, url_prefix='/api/onboarding')

@bp.route('/save', methods=['POST'])
@jwt_required()
def save_onboarding_data():
    """Save onboarding data for authenticated user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        monthly_budget = data.get('monthlyBudget')
        currency = data.get('currency', 'USD')
        has_meal_plan = data.get('hasMealPlan', False)
        fixed_costs = data.get('fixedCosts', [])
        spending_categories = data.get('spendingCategories', {})
        
        if not monthly_budget or monthly_budget <= 0:
            return jsonify({'error': 'Valid monthly budget is required'}), 400
        
        # Check if user already has onboarding data
        onboarding = OnboardingData.query.filter_by(user_id=user_id).first()
        
        if onboarding:
            # Update existing data
            onboarding.monthly_budget = monthly_budget
            onboarding.currency = currency
            onboarding.has_meal_plan = has_meal_plan
            onboarding.set_fixed_costs(fixed_costs)
            onboarding.set_spending_categories(spending_categories)
            onboarding.is_complete = True
            onboarding.completed_at = datetime.utcnow()
            onboarding.updated_at = datetime.utcnow()
        else:
            # Create new onboarding data
            onboarding = OnboardingData(
                user_id=user_id,
                monthly_budget=monthly_budget,
                currency=currency,
                has_meal_plan=has_meal_plan,
                is_complete=True,
                completed_at=datetime.utcnow()
            )
            onboarding.set_fixed_costs(fixed_costs)
            onboarding.set_spending_categories(spending_categories)
            db.session.add(onboarding)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Onboarding data saved successfully',
            'data': onboarding.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save onboarding data: {str(e)}'}), 500

@bp.route('/load', methods=['GET'])
@jwt_required()
def load_onboarding_data():
    """Load onboarding data for authenticated user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        onboarding = OnboardingData.query.filter_by(user_id=user_id).first()
        
        if not onboarding:
            return jsonify({
                'message': 'No onboarding data found',
                'data': None
            }), 200
        
        return jsonify({
            'message': 'Onboarding data loaded successfully',
            'data': onboarding.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to load onboarding data: {str(e)}'}), 500

@bp.route('/update', methods=['PUT'])
@jwt_required()
def update_onboarding_data():
    """Update specific fields in onboarding data."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        onboarding = OnboardingData.query.filter_by(user_id=user_id).first()
        
        if not onboarding:
            return jsonify({'error': 'No onboarding data found to update'}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'monthlyBudget' in data:
            monthly_budget = data['monthlyBudget']
            if monthly_budget and monthly_budget > 0:
                onboarding.monthly_budget = monthly_budget
        
        if 'currency' in data:
            onboarding.currency = data['currency']
        
        if 'hasMealPlan' in data:
            onboarding.has_meal_plan = data['hasMealPlan']
        
        if 'fixedCosts' in data:
            onboarding.set_fixed_costs(data['fixedCosts'])
        
        if 'spendingCategories' in data:
            onboarding.set_spending_categories(data['spendingCategories'])
        
        onboarding.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Onboarding data updated successfully',
            'data': onboarding.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update onboarding data: {str(e)}'}), 500

@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_onboarding_data():
    """Delete onboarding data for authenticated user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        onboarding = OnboardingData.query.filter_by(user_id=user_id).first()
        
        if not onboarding:
            return jsonify({'error': 'No onboarding data found to delete'}), 404
        
        db.session.delete(onboarding)
        db.session.commit()
        
        return jsonify({
            'message': 'Onboarding data deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete onboarding data: {str(e)}'}), 500
