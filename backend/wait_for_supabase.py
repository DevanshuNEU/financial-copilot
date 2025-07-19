#!/usr/bin/env python3
"""
Wait for Supabase project initialization and test connection
"""

import time
import os
import socket
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def check_dns_ready(hostname):
    """Check if DNS resolves for the hostname"""
    try:
        socket.gethostbyname(hostname)
        return True
    except socket.gaierror:
        return False

def test_db_connection():
    """Test database connection"""
    database_url = os.getenv('SUPABASE_DATABASE_URL')
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return True
    except Exception:
        return False

def wait_for_supabase():
    """Wait for Supabase project to be ready"""
    
    print("🔄 Waiting for Supabase project 'expensesink-backend' to initialize...")
    print("⏰ This typically takes 2-5 minutes for new projects")
    print()
    
    hostname = "db.fqbsetycfqgmickvucn.supabase.co"
    max_attempts = 30  # 15 minutes max
    attempt = 0
    
    while attempt < max_attempts:
        attempt += 1
        
        print(f"🧪 Attempt {attempt}: Checking if project is ready...", end="")
        
        # Check DNS first
        if not check_dns_ready(hostname):
            print(" DNS not ready yet")
            time.sleep(30)  # Wait 30 seconds
            continue
        
        print(" DNS ready! Testing connection...", end="")
        
        # Check database connection
        if test_db_connection():
            print(" ✅ SUCCESS!")
            print()
            print("🎉 Supabase project is ready!")
            print("✅ DNS resolving correctly")
            print("✅ Database connection working")
            print()
            print("🚀 Ready to proceed with Phase 1 Day 2!")
            return True
        else:
            print(" Connection failed, retrying...")
        
        time.sleep(30)  # Wait 30 seconds
    
    print("\n❌ Timeout waiting for Supabase project")
    print("🔧 Please check your Supabase dashboard manually")
    return False

if __name__ == "__main__":
    print("⏳ EXPENSESINK - Waiting for Supabase Project")
    print("=" * 50)
    
    success = wait_for_supabase()
    
    if success:
        print("\n🎯 Next step: Run the connection test")
        print("   python3 test_supabase_connection.py")
    else:
        print("\n🔧 Manual check needed:")
        print("   1. Go to https://supabase.com/dashboard")
        print("   2. Check if your project shows as 'Active'")
        print("   3. Try the connection test manually")
