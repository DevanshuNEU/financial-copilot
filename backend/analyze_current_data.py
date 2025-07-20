#!/usr/bin/env python3
"""
EXPENSESINK - Current Data Analysis
Analyzes existing SQLite data before Supabase migration
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

def analyze_current_data():
    """Analyze current SQLite database in detail"""
    
    print("📊 EXPENSESINK - Current Data Analysis")
    print("=" * 45)
    
    db_path = "instance/financial_copilot.db"
    if not Path(db_path).exists():
        print("❌ Database not found at:", db_path)
        return False
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    
    try:
        # Get all expenses
        expenses_cursor = conn.execute("""
            SELECT id, amount, category, description, vendor, 
                   status, created_at 
            FROM expenses ORDER BY created_at DESC
        """)
        expenses = [dict(row) for row in expenses_cursor.fetchall()]
        
        # Basic statistics
        total_count = len(expenses)
        total_amount = sum(float(expense['amount'] or 0) for expense in expenses)
        
        print(f"📈 BASIC STATISTICS:")
        print(f"   Total Expenses: {total_count}")
        print(f"   Total Amount: ${total_amount:.2f}")
        
        # Category analysis
        categories = {}
        for expense in expenses:
            cat = expense['category']
            if cat:
                categories[cat] = categories.get(cat, 0) + float(expense['amount'] or 0)
        
        print(f"\n💰 BY CATEGORY:")
        for category, amount in sorted(categories.items()):
            count = sum(1 for e in expenses if e['category'] == category)
            print(f"   {category}: {count} expenses, ${amount:.2f}")
        
        # Status analysis
        statuses = {}
        for expense in expenses:
            status = expense['status'] or 'None'
            statuses[status] = statuses.get(status, 0) + 1
        
        print(f"\n📋 BY STATUS:")
        for status, count in statuses.items():
            print(f"   {status}: {count} expenses")
        
        # Date analysis
        if expenses:
            dates = [e['created_at'] for e in expenses if e['created_at']]
            if dates:
                print(f"\n📅 DATE RANGE:")
                print(f"   Earliest: {min(dates)}")
                print(f"   Latest: {max(dates)}")
        
        # Data quality analysis
        print(f"\n🔍 DATA QUALITY:")
        with_amounts = sum(1 for e in expenses if e['amount'])
        with_categories = sum(1 for e in expenses if e['category'])
        with_descriptions = sum(1 for e in expenses if e['description'])
        with_vendors = sum(1 for e in expenses if e['vendor'])
        
        print(f"   With amounts: {with_amounts}/{total_count} ({with_amounts/total_count*100:.1f}%)")
        print(f"   With categories: {with_categories}/{total_count} ({with_categories/total_count*100:.1f}%)")
        print(f"   With descriptions: {with_descriptions}/{total_count} ({with_descriptions/total_count*100:.1f}%)")
        print(f"   With vendors: {with_vendors}/{total_count} ({with_vendors/total_count*100:.1f}%)")
        
        # Sample records
        print(f"\n📝 SAMPLE RECORDS:")
        for i, expense in enumerate(expenses[:3]):
            print(f"   {i+1}. ${expense['amount']} - {expense['category']} - {expense['description'][:30]}...")
        
        conn.close()
        
        # Return analysis results
        analysis_results = {
            'total_expenses': total_count,
            'total_amount': round(total_amount, 2),
            'categories': categories,
            'statuses': statuses,
            'data_quality': {
                'with_amounts': with_amounts,
                'with_categories': with_categories,
                'with_descriptions': with_descriptions,
                'with_vendors': with_vendors
            },
            'sample_records': expenses[:5]
        }
        
        print(f"\n✅ Analysis complete - {total_count} expenses analyzed")
        return analysis_results
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    result = analyze_current_data()
    if result:
        print(f"\n🎯 Ready for data export and migration planning")
    else:
        print(f"\n🔧 Please resolve analysis issues before proceeding")
