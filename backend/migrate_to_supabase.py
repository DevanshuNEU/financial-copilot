#!/usr/bin/env python3
"""
EXPENSESINK - Supabase Table Creation & Data Migration Script
Phase 1 Day 3: Create tables and import data to Supabase
"""

import os
import json
import hashlib
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

def get_database_engines():
    """Get both SQLite (source) and Supabase (destination) engines"""
    sqlite_url = 'sqlite:///instance/financial_copilot.db'
    supabase_url = os.getenv('SUPABASE_DATABASE_URL')
    
    if not supabase_url:
        raise ValueError("SUPABASE_DATABASE_URL not found in environment")
    
    print(f"📊 Source DB: {sqlite_url}")
    print(f"🚀 Target DB: {supabase_url[:50]}...")
    
    sqlite_engine = create_engine(sqlite_url)
    supabase_engine = create_engine(supabase_url)
    
    return sqlite_engine, supabase_engine

def test_supabase_connection():
    """Test Supabase connection"""
    try:
        _, supabase_engine = get_database_engines()
        
        with supabase_engine.connect() as conn:
            result = conn.execute(text('SELECT version()'))
            version = result.fetchone()[0]
            print(f"✅ Successfully connected to Supabase!")
            print(f"PostgreSQL version: {version[:60]}...")
            return True
            
    except Exception as e:
        print(f"❌ Supabase connection failed: {str(e)}")
        return False

def create_tables_in_supabase():
    """Create tables in Supabase using direct SQL"""
    try:
        _, supabase_engine = get_database_engines()
        
        # Create the SQL for table creation
        create_sql = """
        -- Create enums
        DO $$ BEGIN
            CREATE TYPE expense_category AS ENUM (
                'meals', 'travel', 'office', 'software', 'marketing', 'utilities', 'other'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        DO $$ BEGIN
            CREATE TYPE expense_status AS ENUM (
                'pending', 'approved', 'rejected'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        -- Create expenses table
        CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            amount DECIMAL(10,2) NOT NULL,
            category expense_category NOT NULL,
            description TEXT,
            vendor VARCHAR(255),
            status expense_status NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create budgets table
        CREATE TABLE IF NOT EXISTS budgets (
            id SERIAL PRIMARY KEY,
            category expense_category NOT NULL UNIQUE,
            monthly_limit DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
        CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
        CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);
        CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
        """
        
        with supabase_engine.connect() as conn:
            # Execute the creation script
            conn.execute(text(create_sql))
            conn.commit()
            
        print("✅ Tables created successfully in Supabase!")
        return True
        
    except Exception as e:
        print(f"❌ Table creation failed: {str(e)}")
        return False

def import_data_to_supabase():
    """Import exported data to Supabase"""
    try:
        _, supabase_engine = get_database_engines()
        
        # Load exported data
        print("📥 Loading exported data...")
        
        with open('migration_export/expenses.json', 'r') as f:
            expenses_data = json.load(f)
        
        with open('migration_export/budgets.json', 'r') as f:
            budgets_data = json.load(f)
        
        print(f"📊 Found {len(expenses_data)} expenses and {len(budgets_data)} budgets")
        
        with supabase_engine.connect() as conn:
            # Import expenses
            for expense in expenses_data:
                insert_sql = text("""
                    INSERT INTO expenses (id, amount, category, description, vendor, status, created_at)
                    VALUES (:id, :amount, :category, :description, :vendor, :status, :created_at)
                """)
                
                conn.execute(insert_sql, {
                    'id': expense['id'],
                    'amount': expense['amount'],
                    'category': expense['category'].lower(),  # Convert to lowercase for enum
                    'description': expense['description'],
                    'vendor': expense['vendor'],
                    'status': expense['status'].lower(),  # Convert to lowercase for enum
                    'created_at': expense['created_at']
                })
            
            # Import budgets (if any)
            for budget in budgets_data:
                insert_sql = text("""
                    INSERT INTO budgets (id, category, monthly_limit, created_at, updated_at)
                    VALUES (:id, :category, :monthly_limit, :created_at, :updated_at)
                """)
                
                conn.execute(insert_sql, budget)
            
            conn.commit()
        
        print(f"✅ Successfully imported {len(expenses_data)} expenses and {len(budgets_data)} budgets!")
        return True
        
    except Exception as e:
        print(f"❌ Data import failed: {str(e)}")
        return False

def verify_data_integrity():
    """Verify imported data matches the checksum"""
    try:
        _, supabase_engine = get_database_engines()
        
        # Load verification data
        with open('migration_export/verification.json', 'r') as f:
            verification = json.load(f)
        
        expected_checksum = verification['expenses_checksum']
        expected_total = verification['total_amount']
        expected_count = verification['total_expenses']
        
        print(f"🔍 Verifying data integrity...")
        print(f"Expected: {expected_count} expenses, ${expected_total}, checksum: {expected_checksum}")
        
        with supabase_engine.connect() as conn:
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
            
            print(f"Actual: {actual_count} expenses, ${actual_total}, checksum: {actual_checksum}")
            
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
                return True
            else:
                print("\n💥 DATA INTEGRITY VERIFICATION: FAILED!")
                return False
                
    except Exception as e:
        print(f"❌ Data verification failed: {str(e)}")
        return False

def main():
    """Main migration script"""
    print("🚀 EXPENSESINK - Supabase Migration Script")
    print("=" * 50)
    print("Phase 1 Day 3: Creating tables and importing data")
    print()
    
    # Step 1: Test connection
    print("Step 1: Testing Supabase connection...")
    if not test_supabase_connection():
        print("❌ Cannot proceed without Supabase connection")
        return False
    print()
    
    # Step 2: Create tables
    print("Step 2: Creating tables in Supabase...")
    if not create_tables_in_supabase():
        print("❌ Cannot proceed without tables")
        return False
    print()
    
    # Step 3: Import data
    print("Step 3: Importing data to Supabase...")
    if not import_data_to_supabase():
        print("❌ Data import failed")
        return False
    print()
    
    # Step 4: Verify integrity
    print("Step 4: Verifying data integrity...")
    if not verify_data_integrity():
        print("❌ Data integrity check failed")
        return False
    print()
    
    print("🎉 MIGRATION COMPLETED SUCCESSFULLY!")
    print("✅ Tables created")
    print("✅ Data imported")
    print("✅ Integrity verified")
    print()
    print("Next step: Update Flask configuration to use Supabase")
    
    return True

if __name__ == "__main__":
    main()
