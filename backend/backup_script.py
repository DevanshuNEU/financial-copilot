#!/usr/bin/env python3
"""
EXPENSESINK - Phase 1 Day 1 Backup Script
Creates complete backup of current system before Supabase migration
"""

import sqlite3
import json
import shutil
import os
from datetime import datetime
from pathlib import Path

def create_backup():
    """Create comprehensive backup of current system"""
    
    print("🔄 Starting EXPENSESINK backup process...")
    
    # Create backup directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = f"backup_before_supabase_{timestamp}"
    os.makedirs(backup_dir, exist_ok=True)
    
    print(f"📁 Created backup directory: {backup_dir}")
    
    # 1. Backup SQLite database file
    db_path = "instance/financial_copilot.db"
    if os.path.exists(db_path):
        backup_db_path = f"{backup_dir}/financial_copilot_BACKUP.db"
        shutil.copy2(db_path, backup_db_path)
        print(f"✅ Database backed up to: {backup_db_path}")
    else:
        print("⚠️  Database file not found at instance/financial_copilot.db")
        return False
    
    # 2. Connect to database and analyze current data
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    
    try:
        # Get expenses data
        expenses_cursor = conn.execute("""
            SELECT id, amount, category, description, vendor, 
                   status, created_at 
            FROM expenses ORDER BY created_at DESC
        """)
        expenses = [dict(row) for row in expenses_cursor.fetchall()]
        
        # Get budgets data
        try:
            budgets_cursor = conn.execute("""
                SELECT id, category, amount, period, created_at 
                FROM budgets ORDER BY created_at DESC
            """)
            budgets = [dict(row) for row in budgets_cursor.fetchall()]
        except sqlite3.OperationalError:
            print("ℹ️  No budgets table found (this is okay)")
            budgets = []
        
        # Calculate summary statistics
        total_expenses = len(expenses)
        total_amount = sum(float(expense['amount'] or 0) for expense in expenses)
        categories = set(expense['category'] for expense in expenses if expense['category'])
        
        # Create data analysis report
        analysis = {
            "backup_timestamp": timestamp,
            "database_analysis": {
                "total_expenses": total_expenses,
                "total_amount": round(total_amount, 2),
                "total_budgets": len(budgets),
                "categories_found": sorted(list(categories)),
                "date_range": {
                    "earliest": expenses[-1]['created_at'] if expenses else None,
                    "latest": expenses[0]['created_at'] if expenses else None
                }
            },
            "data_integrity": {
                "expenses_with_amounts": sum(1 for e in expenses if e['amount']),
                "expenses_with_categories": sum(1 for e in expenses if e['category']),
                "expenses_with_descriptions": sum(1 for e in expenses if e['description'])
            }
        }
        
        # Save analysis report
        with open(f"{backup_dir}/data_analysis.json", 'w') as f:
            json.dump(analysis, f, indent=2, default=str)
        
        # Save expenses data
        with open(f"{backup_dir}/expenses_export.json", 'w') as f:
            json.dump(expenses, f, indent=2, default=str)
        
        # Save budgets data
        with open(f"{backup_dir}/budgets_export.json", 'w') as f:
            json.dump(budgets, f, indent=2, default=str)
        
        print(f"✅ Exported {total_expenses} expenses totaling ${total_amount:.2f}")
        print(f"✅ Exported {len(budgets)} budget records")
        print(f"✅ Found categories: {', '.join(sorted(categories))}")
        
        # Create schema documentation
        schema_info = {}
        
        # Get table schemas
        tables_cursor = conn.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        """)
        tables = [row[0] for row in tables_cursor.fetchall()]
        
        for table in tables:
            schema_cursor = conn.execute(f"PRAGMA table_info({table})")
            schema_info[table] = [dict(zip([col[0] for col in schema_cursor.description], row)) 
                                 for row in schema_cursor.fetchall()]
        
        with open(f"{backup_dir}/database_schema.json", 'w') as f:
            json.dump(schema_info, f, indent=2)
        
        print(f"✅ Documented schema for tables: {', '.join(tables)}")
        
        # Create verification checksums
        verification = {
            "total_expenses": total_expenses,
            "total_amount": round(total_amount, 2),
            "total_budgets": len(budgets),
            "categories_count": len(categories),
            "backup_complete": True,
            "backup_timestamp": timestamp
        }
        
        with open(f"{backup_dir}/verification_checksums.json", 'w') as f:
            json.dump(verification, f, indent=2)
        
        print(f"✅ Verification checksums created")
        
        # Create backup README
        readme_content = f"""# EXPENSESINK Backup - {timestamp}

This backup was created before beginning Supabase migration (Phase 1).

## Backup Contents

1. **financial_copilot_BACKUP.db** - Complete SQLite database backup
2. **expenses_export.json** - All {total_expenses} expense records
3. **budgets_export.json** - All {len(budgets)} budget records  
4. **data_analysis.json** - Complete data analysis and statistics
5. **database_schema.json** - Complete database schema documentation
6. **verification_checksums.json** - Data integrity verification

## Key Statistics

- **Total Expenses:** {total_expenses} records
- **Total Amount:** ${total_amount:.2f}
- **Total Budgets:** {len(budgets)} records
- **Categories:** {', '.join(sorted(categories))}
- **Date Range:** {analysis['database_analysis']['date_range']['earliest']} to {analysis['database_analysis']['date_range']['latest']}

## Verification

To verify backup integrity, check that:
- Database file size matches original
- JSON exports contain expected record counts
- Verification checksums match current data

## Restoration

To restore from this backup:
1. Copy financial_copilot_BACKUP.db to instance/financial_copilot.db
2. Restart Flask application
3. Verify all data is present and correct

**Created:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Migration Phase:** Phase 1 Day 1 - Pre-Supabase Backup
"""
        
        with open(f"{backup_dir}/README.md", 'w') as f:
            f.write(readme_content)
        
        print(f"✅ Backup README created")
        
        conn.close()
        
        print(f"\n🎉 BACKUP COMPLETE!")
        print(f"📁 Backup location: {backup_dir}/")
        print(f"📊 {total_expenses} expenses backed up (${total_amount:.2f} total)")
        print(f"🛡️  System ready for Supabase migration!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during backup: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    success = create_backup()
    if success:
        print("\n✅ Ready to proceed with Phase 1 migration!")
    else:
        print("\n❌ Backup failed - please resolve issues before continuing")
