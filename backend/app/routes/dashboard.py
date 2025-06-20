from flask import Blueprint, jsonify
from app import db
from app.models import Expense, ExpenseCategory, ExpenseStatus
from datetime import datetime, timedelta
from sqlalchemy import func, extract

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/overview', methods=['GET'])
def get_dashboard_overview():
    """Get comprehensive dashboard overview"""
    try:
        # Current month
        current_month = datetime.utcnow().replace(day=1)
        last_month = (current_month - timedelta(days=1)).replace(day=1)
        
        # Total expenses
        total_expenses = db.session.query(func.sum(Expense.amount)).scalar() or 0
        
        # This month vs last month
        this_month_total = db.session.query(func.sum(Expense.amount)).filter(
            Expense.created_at >= current_month
        ).scalar() or 0
        
        last_month_total = db.session.query(func.sum(Expense.amount)).filter(
            Expense.created_at >= last_month,
            Expense.created_at < current_month
        ).scalar() or 0
        
        # Calculate percentage change
        if last_month_total > 0:
            month_change = ((this_month_total - last_month_total) / last_month_total) * 100
        else:
            month_change = 100 if this_month_total > 0 else 0
        
        # Category breakdown
        category_data = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total'),
            func.count(Expense.id).label('count')
        ).group_by(Expense.category).all()
        
        # Status breakdown
        status_data = db.session.query(
            Expense.status,
            func.count(Expense.id).label('count')
        ).group_by(Expense.status).all()
        
        # Recent trends (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        daily_trends = db.session.query(
            func.date(Expense.created_at).label('date'),
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.created_at >= thirty_days_ago
        ).group_by(
            func.date(Expense.created_at)
        ).order_by('date').all()
        
        # Top spending categories this month
        top_categories = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.created_at >= current_month
        ).group_by(
            Expense.category
        ).order_by(
            func.sum(Expense.amount).desc()
        ).limit(5).all()
        
        # Recent expenses
        recent_expenses = Expense.query.order_by(
            Expense.created_at.desc()
        ).limit(10).all()
        
        return jsonify({
            'overview': {
                'total_expenses': float(total_expenses),
                'this_month_total': float(this_month_total),
                'last_month_total': float(last_month_total),
                'month_change_percent': round(month_change, 2),
                'total_transactions': db.session.query(Expense).count()
            },
            'category_breakdown': [
                {
                    'category': cat.value,
                    'total': float(total),
                    'count': count,
                    'percentage': round((float(total) / float(total_expenses)) * 100, 2) if total_expenses > 0 else 0
                }
                for cat, total, count in category_data
            ],
            'status_breakdown': [
                {
                    'status': status.value,
                    'count': count
                }
                for status, count in status_data
            ],
            'daily_trends': [
                {
                    'date': date.isoformat(),
                    'amount': float(total)
                }
                for date, total in daily_trends
            ],
            'top_categories': [
                {
                    'category': cat.value,
                    'total': float(total)
                }
                for cat, total in top_categories
            ],
            'recent_expenses': [exp.to_dict() for exp in recent_expenses],
            'generated_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Get detailed analytics data"""
    try:
        # Monthly trends for the last 12 months
        twelve_months_ago = datetime.utcnow() - timedelta(days=365)
        
        monthly_trends = db.session.query(
            extract('year', Expense.created_at).label('year'),
            extract('month', Expense.created_at).label('month'),
            func.sum(Expense.amount).label('total'),
            func.count(Expense.id).label('count')
        ).filter(
            Expense.created_at >= twelve_months_ago
        ).group_by(
            extract('year', Expense.created_at),
            extract('month', Expense.created_at)
        ).order_by('year', 'month').all()
        
        # Average expense by category
        avg_by_category = db.session.query(
            Expense.category,
            func.avg(Expense.amount).label('avg_amount')
        ).group_by(Expense.category).all()
        
        # Weekly patterns
        weekly_patterns = db.session.query(
            extract('dow', Expense.created_at).label('day_of_week'),
            func.sum(Expense.amount).label('total'),
            func.count(Expense.id).label('count')
        ).group_by(
            extract('dow', Expense.created_at)
        ).order_by('day_of_week').all()
        
        # Day names for weekly patterns
        day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        return jsonify({
            'monthly_trends': [
                {
                    'year': int(year),
                    'month': int(month),
                    'total': float(total),
                    'count': count,
                    'date': f"{int(year)}-{int(month):02d}"
                }
                for year, month, total, count in monthly_trends
            ],
            'average_by_category': [
                {
                    'category': cat.value,
                    'average': float(avg)
                }
                for cat, avg in avg_by_category
            ],
            'weekly_patterns': [
                {
                    'day_of_week': day_names[int(dow)],
                    'day_number': int(dow),
                    'total': float(total),
                    'count': count
                }
                for dow, total, count in weekly_patterns
            ]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Get smart alerts and notifications"""
    try:
        alerts = []
        
        # Current month
        current_month = datetime.utcnow().replace(day=1)
        
        # High amount alerts (>$500)
        high_expenses = Expense.query.filter(
            Expense.amount > 500,
            Expense.created_at >= current_month
        ).count()
        
        if high_expenses > 0:
            alerts.append({
                'type': 'warning',
                'title': 'High Amount Expenses',
                'message': f'{high_expenses} expenses over $500 this month',
                'priority': 'medium'
            })
        
        # Unusual category spending
        current_month_categories = db.session.query(
            Expense.category,
            func.sum(Expense.amount)
        ).filter(
            Expense.created_at >= current_month
        ).group_by(Expense.category).all()
        
        # Compare with previous month average
        for category, amount in current_month_categories:
            if float(amount) > 1000:  # Threshold
                alerts.append({
                    'type': 'info',
                    'title': f'High {category.value.title()} Spending',
                    'message': f'${float(amount):.2f} spent on {category.value} this month',
                    'priority': 'low'
                })
        
        # Pending approvals
        pending_count = Expense.query.filter(
            Expense.status == ExpenseStatus.PENDING
        ).count()
        
        if pending_count > 5:
            alerts.append({
                'type': 'warning',
                'title': 'Pending Approvals',
                'message': f'{pending_count} expenses waiting for approval',
                'priority': 'high'
            })
        
        return jsonify({
            'alerts': alerts,
            'total_alerts': len(alerts),
            'generated_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/budget-analysis', methods=['GET'])
def get_budget_analysis():
    """Get budget analysis and predictions"""
    try:
        # Current month spending
        current_month = datetime.utcnow().replace(day=1)
        days_in_month = (datetime.utcnow().replace(month=datetime.utcnow().month % 12 + 1, day=1) - timedelta(days=1)).day
        current_day = datetime.utcnow().day
        
        current_month_spending = db.session.query(func.sum(Expense.amount)).filter(
            Expense.created_at >= current_month
        ).scalar() or 0
        
        # Daily average this month
        daily_avg = float(current_month_spending) / current_day if current_day > 0 else 0
        
        # Projected month-end spending
        projected_spending = daily_avg * days_in_month
        
        # Last 3 months average
        three_months_ago = current_month - timedelta(days=90)
        avg_monthly_spending = db.session.query(
            func.avg(monthly_totals.c.total)
        ).select_from(
            db.session.query(
                extract('year', Expense.created_at).label('year'),
                extract('month', Expense.created_at).label('month'),
                func.sum(Expense.amount).label('total')
            ).filter(
                Expense.created_at >= three_months_ago,
                Expense.created_at < current_month
            ).group_by(
                extract('year', Expense.created_at),
                extract('month', Expense.created_at)
            ).subquery('monthly_totals')
        ).scalar() or 0
        
        return jsonify({
            'current_month_spending': float(current_month_spending),
            'daily_average': round(daily_avg, 2),
            'projected_month_end': round(projected_spending, 2),
            'three_month_average': float(avg_monthly_spending),
            'days_in_month': days_in_month,
            'current_day': current_day,
            'spending_trend': 'above_average' if projected_spending > float(avg_monthly_spending) else 'below_average',
            'analysis_date': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
