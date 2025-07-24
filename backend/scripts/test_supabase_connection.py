#!/usr/bin/env python3
"""
EXPENSESINK - Supabase Connection Test Script
=============================================

Purpose: Verify Supabase database connection and permissions
Usage: python test_supabase_connection.py

Required Environment Variables:
- SUPABASE_DATABASE_URL: PostgreSQL connection string
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()


def test_connection():
    """
    Test Supabase database connection and permissions.
    
    Returns:
        bool: True if connection successful, False otherwise
    """
    
    # Get database URL from environment
    database_url = os.getenv('SUPABASE_DATABASE_URL')
    if not database_url:
        print("❌ ERROR: SUPABASE_DATABASE_URL not found in .env file")
        return False
        
    try:
        print("🔄 Testing Supabase connection...")
        
        # Create database engine
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            # Test 1: Basic connectivity
            result = conn.execute(text("SELECT current_timestamp"))
            timestamp = result.fetchone()[0]
            print(f"✅ Connected successfully at {timestamp}")
            
            # Test 2: Database information
            result = conn.execute(text("SELECT current_database(), version()"))
            db_info = result.fetchone()
            print(f"✅ Database: {db_info[0]}")
            print(f"✅ PostgreSQL: {db_info[1].split(',')[0]}")
            
            # Test 3: List existing tables
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            
            if tables:
                print(f"\n📊 Existing tables ({len(tables)}):")
                for table in tables:
                    print(f"   - {table}")
            else:
                print("📊 No tables found (fresh database)")
            
            # Test 4: Write permissions
            try:
                # Create test table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS _connection_test (
                        id SERIAL PRIMARY KEY,
                        test_message TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                
                # Insert test data
                conn.execute(text(
                    "INSERT INTO _connection_test (test_message) VALUES (:msg)"
                ), {"msg": "Connection test successful"})
                
                # Verify insert
                result = conn.execute(text(
                    "SELECT COUNT(*) FROM _connection_test"
                ))
                count = result.scalar()
                print(f"\n✅ Write permissions verified (inserted {count} row)")
                
                # Clean up
                conn.execute(text("DROP TABLE _connection_test"))
                conn.commit()
                print("✅ Cleanup completed")
                
            except Exception as e:
                print(f"\n⚠️  Write permission test failed: {e}")
                print("   (This might be okay if you have read-only access)")
            
            return True
            
    except Exception as e:
        print(f"\n❌ Connection failed: {type(e).__name__}: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("   1. Verify SUPABASE_DATABASE_URL in .env file")
        print("   2. Check if Supabase project is active")
        print("   3. Verify database password is correct")
        print("   4. Ensure your IP is allowed in Supabase settings")
        print("   5. Check internet connection")
        return False


def main():
    """Main entry point"""
    print("🧪 EXPENSESINK - Supabase Connection Test")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    # Run connection test
    success = test_connection()
    
    # Summary
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests PASSED!")
        print("✅ Supabase connection is working correctly")
    else:
        print("❌ Tests FAILED")
        print("🔧 Please fix the issues before proceeding")
        sys.exit(1)


if __name__ == "__main__":
    main()
