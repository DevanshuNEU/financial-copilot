#!/usr/bin/env python3
"""
EXPENSESINK - Data Export for Migration
Exports current data with integrity verification for Supabase migration
"""

import sqlite3
import json
import hashlib
from datetime import datetime
from pathlib import Path

def export_for_migration():
    """Export current data with verification checksums"""
    
    print("📤 EXPENSESINK - Data Export for Migration")
    print("=" * 45)
    
    db_path = "instance/financial_copilot.db"
    if not Path(db_path).exists():
        print("❌ Database not found at:", db_path)
        return False
    
    # Create export directory
    export_dir = Path("migration_export")
    export_dir.mkdir(exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    
    try:
        # Export expenses
        print("🔄 Exporting expenses...")
        expenses_cursor = conn.execute("""
            SELECT id, amount, category, description, vendor, 
                   status, created_at 
            FROM expenses ORDER BY id
        """)
        expenses = [dict(row) for row in expenses_cursor.fetchall()]
        
        # Export budgets (if any)
        print("🔄 Exporting budgets...")
        try:
            budgets_cursor = conn.execute("""
                SELECT id, category, amount, period, created_at 
                FROM budgets ORDER BY id
            """)
            budgets = [dict(row) for row in budgets_cursor.fetchall()]
        except sqlite3.OperationalError:
            budgets = []
        
        # Calculate checksums
        expenses_json = json.dumps(expenses, sort_keys=True, default=str)
        budgets_json = json.dumps(budgets, sort_keys=True, default=str)
        
        expenses_checksum = hashlib.md5(expenses_json.encode()).hexdigest()
        budgets_checksum = hashlib.md5(budgets_json.encode()).hexdigest()
        
        # Create verification data
        verification = {
            'export_timestamp': datetime.now().isoformat(),
            'source_database': str(db_path),
            'total_expenses': len(expenses),
            'total_budgets': len(budgets),
            'total_amount': sum(float(e['amount'] or 0) for e in expenses),
            'expenses_checksum': expenses_checksum,
            'budgets_checksum': budgets_checksum,
            'categories': list(set(e['category'] for e in expenses if e['category'])),
            'date_range': {
                'earliest': min(e['created_at'] for e in expenses if e['created_at']) if expenses else None,
                'latest': max(e['created_at'] for e in expenses if e['created_at']) if expenses else None
            }
        }
        
        # Save exports
        with open(export_dir / 'expenses.json', 'w') as f:
            json.dump(expenses, f, indent=2, default=str)
        
        with open(export_dir / 'budgets.json', 'w') as f:
            json.dump(budgets, f, indent=2, default=str)
        
        with open(export_dir / 'verification.json', 'w') as f:
            json.dump(verification, f, indent=2, default=str)
        
        # Create schema documentation
        print("🔄 Documenting database schema...")
        schema_info = {}
        
        # Get table schemas
        tables_cursor = conn.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        """)
        tables = [row[0] for row in tables_cursor.fetchall()]
        
        for table in tables:
            schema_cursor = conn.execute(f"PRAGMA table_info({table})")
            columns = []
            for row in schema_cursor.fetchall():
                columns.append({
                    'name': row[1],
                    'type': row[2],
                    'nullable': not bool(row[3]),
                    'primary_key': bool(row[5])
                })
            schema_info[table] = columns
        
        with open(export_dir / 'schema.json', 'w') as f:
            json.dump(schema_info, f, indent=2)
        
        conn.close()
        
        # Print results
        print(f"\n✅ EXPORT COMPLETE:")
        print(f"   📁 Export location: {export_dir}/")
        print(f"   📊 Expenses: {len(expenses)} records")
        print(f"   📊 Budgets: {len(budgets)} records")
        print(f"   💰 Total amount: ${verification['total_amount']:.2f}")
        print(f"   🏷️  Categories: {', '.join(verification['categories'])}")
        print(f"   🔐 Expenses checksum: {expenses_checksum}")
        
        # Verify export integrity
        print(f"\n🔍 VERIFYING EXPORT INTEGRITY...")
        
        # Re-read and verify
        with open(export_dir / 'expenses.json', 'r') as f:
            verified_expenses = json.load(f)
        
        verified_json = json.dumps(verified_expenses, sort_keys=True, default=str)
        verified_checksum = hashlib.md5(verified_json.encode()).hexdigest()
        
        if verified_checksum == expenses_checksum:
            print("✅ Export integrity verified - checksums match")
        else:
            print("❌ Export integrity failed - checksums don't match")
            return False
        
        print(f"\n🎯 Ready for Supabase import (Day 3)")
        return verification
        
    except Exception as e:
        print(f"❌ Export failed: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    result = export_for_migration()
    if result:
        print(f"\n✅ Migration export successful")
    else:
        print(f"\n❌ Migration export failed")
