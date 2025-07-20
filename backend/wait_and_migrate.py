#!/usr/bin/env python3
"""
EXPENSESINK - DNS Retry and Migration Script
Wait for Supabase DNS to resolve and then apply migration
"""

import os
import time
import subprocess
import socket
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

def check_dns_resolution(hostname, max_attempts=30, delay=10):
    """Check if DNS hostname resolves"""
    print(f"🔄 Checking DNS resolution for {hostname}...")
    
    for attempt in range(1, max_attempts + 1):
        try:
            # Try to resolve the hostname
            ip = socket.gethostbyname(hostname)
            print(f"✅ DNS resolved on attempt {attempt}: {hostname} -> {ip}")
            return True
            
        except socket.gaierror:
            print(f"🔄 Attempt {attempt}/{max_attempts}: DNS not resolved yet, waiting {delay}s...")
            if attempt < max_attempts:
                time.sleep(delay)
            
    print(f"❌ DNS resolution failed after {max_attempts} attempts")
    return False

def test_database_connection():
    """Test database connection"""
    supabase_url = os.getenv('SUPABASE_DATABASE_URL')
    if not supabase_url:
        print("❌ SUPABASE_DATABASE_URL not found in environment")
        return False
    
    try:
        print("🔄 Testing database connection...")
        engine = create_engine(supabase_url)
        
        with engine.connect() as conn:
            result = conn.execute(text('SELECT version()'))
            version = result.fetchone()[0]
            print(f"✅ Successfully connected to Supabase!")
            print(f"PostgreSQL version: {version[:60]}...")
            return True
            
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

def apply_migration():
    """Apply the migration SQL"""
    supabase_url = os.getenv('SUPABASE_DATABASE_URL')
    
    try:
        print("🔄 Applying migration...")
        
        # Read the migration SQL
        with open('supabase_migration.sql', 'r') as f:
            migration_sql = f.read()
        
        # Apply migration
        engine = create_engine(supabase_url)
        with engine.connect() as conn:
            # Execute migration as a single transaction
            with conn.begin():
                conn.execute(text(migration_sql))
            
        print("✅ Migration applied successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

def main():
    """Main function"""
    print("🚀 EXPENSESINK - DNS Retry and Migration")
    print("=" * 50)
    print("Phase 1 Day 3: Waiting for DNS and applying migration")
    print()
    
    # Extract hostname from database URL
    supabase_url = os.getenv('SUPABASE_DATABASE_URL')
    if not supabase_url:
        print("❌ SUPABASE_DATABASE_URL not found in environment")
        return False
    
    # Extract hostname (e.g., "db.atfqxpjbhhpnsazuilee.supabase.co")
    hostname = supabase_url.split('@')[1].split(':')[0]
    
    # Step 1: Wait for DNS resolution
    if not check_dns_resolution(hostname):
        print("❌ Cannot proceed without DNS resolution")
        return False
    
    # Step 2: Test database connection
    if not test_database_connection():
        print("❌ Cannot proceed without database connection")
        return False
    
    # Step 3: Apply migration
    if not apply_migration():
        print("❌ Migration failed")
        return False
    
    # Step 4: Verify migration
    print("\n🔍 Verifying migration...")
    result = subprocess.run(['python', 'verify_migration.py'], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(result.stdout)
        print("\n🎉 MIGRATION COMPLETED SUCCESSFULLY!")
        print("✅ DNS resolved")
        print("✅ Database connected")
        print("✅ Tables created")
        print("✅ Data imported")
        print("✅ Integrity verified")
        print()
        print("🔥 Phase 1 Day 3 COMPLETED!")
        print("Next: Update Flask to use Supabase and test frontend")
        return True
    else:
        print("❌ Migration verification failed:")
        print(result.stdout)
        print(result.stderr)
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
