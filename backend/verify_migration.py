#!/usr/bin/env python3
"""
EXPENSESINK - Supabase Migration Verification Script
Verify data integrity after migration to Supabase
"""

import os
import json
import hashlib
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

def verify_migration():
    """Verify the migration was successful"""
    
    print("🔍 EXPENSESINK - Migration Verification")
    print("=" * 50)
    
    # Load expected verification data
    with open('migration_export/verification.json', 'r') as f:
        verification = json.load(f)
    
    expected_checksum = verification['expenses_checksum']
    expected_total = verification['total_amount']
    expected_count = verification['total_expenses']
    
    print(f"📊 Expected: {expected_count} expenses, ${expected_total}, checksum: {expected_checksum}")
    
    # Connect to Supabase
    supabase_url = os.getenv('SUPABASE_DATABASE_URL')
    if not supabase_url:
        print("❌ SUPABASE_DATABASE_URL not found in environment")
        return False
    
    try:
        engine = create_engine(supabase_url)
        
        with engine.connect() as conn:
            # Get count and total
            count_result = conn.execute(text('SELECT COUNT(*) FROM expenses')).fetchone()
            total_result = conn.execute(text('SELECT SUM(amount) FROM expenses')).fetchone()
            
            actual_count = count_result[0]
            actual_total = float(total_result[0]) if total_result[0] else 0
            
            # Get data for checksum calculation
            data_result = conn.execute(text("""
                SELECT id, amount, category, description, vendor, status, created_at 
                FROM expenses 
                ORDER BY id
            """)).fetchall()
            
            # Calculate checksum
            data_string = ""
            for row in data_result:
                data_string += f"{row[0]}|{row[1]}|{row[2]}|{row[3]}|{row[4]}|{row[5]}|{row[6]}"
            
            actual_checksum = hashlib.md5(data_string.encode()).hexdigest()
            
            print(f"📊 Actual: {actual_count} expenses, ${actual_total}, checksum: {actual_checksum}")
            
            # Verify integrity
            integrity_checks = []
            integrity_checks.append(("Count match", actual_count == expected_count))
            integrity_checks.append(("Total match", abs(actual_total - expected_total) < 0.01))
            integrity_checks.append(("Checksum match", actual_checksum == expected_checksum))
            
            all_passed = True
            for check_name, passed in integrity_checks:
                status = "✅" if passed else "❌"
                print(f"{status} {check_name}: {passed}")
                if not passed:
                    all_passed = False
            
            if all_passed:
                print("\n🎉 DATA INTEGRITY VERIFICATION: PASSED!")
                print("✅ Migration completed successfully!")
                return True
            else:
                print(f"\n💥 DATA INTEGRITY VERIFICATION: FAILED!")
                return False
                
    except Exception as e:
        print(f"❌ Verification failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = verify_migration()
    exit(0 if success else 1)
