
@bp.route('/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    """Get a specific expense"""
    try:
        expense = Expense.query.get_or_404(expense_id)
        return jsonify(expense.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an expense"""
    try:
        expense = Expense.query.get_or_404(expense_id)
        data = request.get_json()
        
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
            
        expense.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Emit real-time update
        socketio.emit('expense_updated', expense.to_dict())
        
        return jsonify(expense.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    try:
        expense = Expense.query.get_or_404(expense_id)
        
        db.session.delete(expense)
        db.session.commit()
        
        # Emit real-time update
        socketio.emit('expense_deleted', {'id': expense_id})
        
        return jsonify({'message': 'Expense deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/stats', methods=['GET'])
def get_expense_stats():
    """Get expense statistics"""
    try:
        from sqlalchemy import func
        
        # Total expenses
        total_expenses = db.session.query(func.sum(Expense.amount)).scalar() or 0
        
        # Expenses by category
        category_stats = db.session.query(
            Expense.category,
            func.sum(Expense.amount),
            func.count(Expense.id)
        ).group_by(Expense.category).all()
        
        # Recent trends (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recent_expenses = db.session.query(
            func.date(Expense.created_at),
            func.sum(Expense.amount)
        ).filter(
            Expense.created_at >= thirty_days_ago
        ).group_by(
            func.date(Expense.created_at)
        ).order_by(
            func.date(Expense.created_at)
        ).all()
        
        return jsonify({
            'total_expenses': float(total_expenses),
            'category_breakdown': [
                {
                    'category': cat.value,
                    'total': float(total),
                    'count': count
                }
                for cat, total, count in category_stats
            ],
            'recent_trends': [
                {
                    'date': date.isoformat(),
                    'amount': float(amount)
                }
                for date, amount in recent_expenses
            ]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
