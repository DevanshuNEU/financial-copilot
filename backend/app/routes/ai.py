from flask import Blueprint, request, jsonify
from app import db
from app.models import Expense, AIInsight, ExpenseCategory
from openai import OpenAI
import os
from datetime import datetime, timedelta

bp = Blueprint('ai', __name__, url_prefix='/api/ai')

# Configure OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@bp.route('/query', methods=['POST'])
def natural_language_query():
    """Process natural language queries about expenses"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
            
        # Get expense data for context
        expenses = Expense.query.limit(100).all()
        expense_data = [exp.to_dict() for exp in expenses]
        
        # Create context for AI
        context = f"""
        You are a financial AI assistant. Analyze the following expense data and answer the user's query.
        
        Expense Data: {expense_data}
        
        User Query: {query}
        
        Provide insights, trends, and specific answers based on the data. Be concise but informative.
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful financial AI assistant."},
                {"role": "user", "content": context}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'query': query,
            'response': ai_response,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': f'AI query failed: {str(e)}'}), 500

@bp.route('/categorize', methods=['POST'])
def categorize_expense():
    """Categorize an expense using AI"""
    try:
        data = request.get_json()
        description = data.get('description', '')
        vendor = data.get('vendor', '')
        
        if not description and not vendor:
            return jsonify({'error': 'Description or vendor is required'}), 400
            
        # Create prompt for categorization
        prompt = f"""
        Categorize this expense into one of these categories:
        - meals
        - travel  
        - office
        - software
        - marketing
        - utilities
        - other
        
        Expense details:
        Description: {description}
        Vendor: {vendor}
        
        Return only the category name and confidence score (0-1).
        Format: category_name,confidence_score
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expense categorization assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.3
        )
        
        result = response.choices[0].message.content.strip()
        
        try:
            category, confidence = result.split(',')
            category = category.strip().lower()
            confidence = float(confidence.strip())
        except:
            category = 'other'
            confidence = 0.5
            
        return jsonify({
            'category': category,
            'confidence': confidence,
            'description': description,
            'vendor': vendor
        })
        
    except Exception as e:
        return jsonify({'error': f'Categorization failed: {str(e)}'}), 500

@bp.route('/insights', methods=['GET'])
def get_ai_insights():
    """Get AI-generated insights about spending patterns"""
    try:
        # Get recent expenses
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_expenses = Expense.query.filter(
            Expense.created_at >= thirty_days_ago
        ).all()
        
        if not recent_expenses:
            return jsonify({'insights': 'No recent expenses to analyze'})
        
        # Calculate basic stats
        total_amount = sum(float(exp.amount) for exp in recent_expenses)
        avg_amount = total_amount / len(recent_expenses)
        
        # Category breakdown
        category_totals = {}
        for exp in recent_expenses:
            cat = exp.category.value
            category_totals[cat] = category_totals.get(cat, 0) + float(exp.amount)
        
        # Create insights prompt
        prompt = f"""
        Analyze this expense data and provide 3-5 key insights:
        
        Total spent last 30 days: ${total_amount:.2f}
        Average expense: ${avg_amount:.2f}
        Number of expenses: {len(recent_expenses)}
        
        Spending by category:
        {category_totals}
        
        Provide actionable insights about spending patterns, potential savings, and recommendations.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial advisor providing spending insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        insights = response.choices[0].message.content
        
        return jsonify({
            'insights': insights,
            'stats': {
                'total_amount': total_amount,
                'avg_amount': avg_amount,
                'expense_count': len(recent_expenses),
                'category_breakdown': category_totals
            },
            'generated_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': f'Insights generation failed: {str(e)}'}), 500
