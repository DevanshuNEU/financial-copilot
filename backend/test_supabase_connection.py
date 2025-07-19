#!/usr/bin/env python3
"""
Test script for Supabase connection
Run this after setting up credentials to verify everything works
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    """Test Supabase connection"""
    
    database_url = os.getenv('SUPABASE_DATABASE_URL')
    if not database_url:
        print("❌ SUPABASE_DATABASE_URL not found")
        return False
        
    try:
        print("🔄 Testing Supabase connection...")
        engine = create_engine(database_url)
        with engine.connect() as conn:
            # Test basic connectivity
            result = conn.execute(text("SELECT current_timestamp"))
            timestamp = result.fetchone()[0]
            print(f"✅ Supabase connected successfully at {timestamp}")
            
            # Test database info
            result = conn.execute(text("SELECT current_database(), version()"))
            db_info = result.fetchone()
            print(f"✅ Database: {db_info[0]}")
            print(f"✅ PostgreSQL version: {db_info[1].split()[0]} {db_info[1].split()[1]}")
            
            # List existing tables
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"📊 Existing tables: {tables if tables else 'None (fresh database)'}")
            
            # Check if we can create a test table
            try:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS test_connection (
                        id SERIAL PRIMARY KEY,
                        test_message TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                conn.execute(text("INSERT INTO test_connection (test_message) VALUES ('Connection test successful')"))
                result = conn.execute(text("SELECT test_message, created_at FROM test_connection LIMIT 1"))
                test_row = result.fetchone()
                print(f"✅ Test table created and data inserted: {test_row[0]} at {test_row[1]}")
                
                # Clean up test table
                conn.execute(text("DROP TABLE test_connection"))
                print("✅ Test table cleaned up")
                
                conn.commit()
                
            except Exception as e:
                print(f"⚠️  Could not create test table (this might be okay): {e}")
            
            return True
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("   1. Check your SUPABASE_DATABASE_URL in .env")
        print("   2. Ensure your Supabase project is running")
        print("   3. Verify the password is correct")
        print("   4. Check your internet connection")
        return False

if __name__ == "__main__":
    print("🧪 EXPENSESINK - Supabase Connection Test")
    print("=" * 45)
    
    success = test_connection()
    
    print("\n" + "=" * 45)
    if success:
        print("🎉 Connection test PASSED!")
        print("✅ Ready for Phase 1 Day 2 - Data Export & Analysis")
    else:
        print("❌ Connection test FAILED")
        print("🔧 Please fix the connection issues before proceeding")
