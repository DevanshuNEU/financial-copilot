#!/usr/bin/env python3
"""
EXPENSESINK - Phase 1 Day 1 Environment Setup
Configures environment for Supabase migration
"""

import os
import subprocess
import sys
from pathlib import Path

def install_requirements():
    """Install required packages for PostgreSQL support"""
    
    print("🔄 Installing PostgreSQL support...")
    
    # Check if we're in a virtual environment
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ Virtual environment detected")
    else:
        print("⚠️  Not in virtual environment - consider activating venv")
    
    # Install psycopg2-binary for PostgreSQL support
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
        print("✅ psycopg2-binary installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install psycopg2-binary: {e}")
        return False
    
    return True

def check_env_file():
    """Check current .env file and guide user to add Supabase credentials"""
    
    print("🔄 Checking environment configuration...")
    
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ .env file not found")
        return False
    
    # Read current .env content
    with open(env_path, 'r') as f:
        env_content = f.read()
    
    print("✅ Current .env file found")
    
    # Check if Supabase variables are already present
    supabase_vars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'SUPABASE_DATABASE_URL'
    ]
    
    missing_vars = []
    for var in supabase_vars:
        if var not in env_content:
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n📝 Missing Supabase environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        
        print(f"\n🎯 NEXT STEPS:")
        print(f"1. Go to your Supabase dashboard: https://supabase.com/dashboard")
        print(f"2. Open your 'expensesink-backend' project")
        print(f"3. Go to Settings > API")
        print(f"4. Copy the following credentials:")
        print(f"   - Project URL")
        print(f"   - Project API keys (anon/public and service_role)")
        print(f"5. Go to Settings > Database")
        print(f"6. Copy the Database URL (Connection String > URI)")
        print(f"7. Add these to your .env file:")
        
        env_template = """
# Supabase Configuration (add these to your .env file)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# For MCP tools (optional - from account settings > access tokens)
SUPABASE_ACCESS_TOKEN=your-access-token-here
"""
        
        print(env_template)
        
        return False
    else:
        print("✅ All Supabase environment variables found")
        return True

def test_supabase_connection():
    """Test connection to Supabase database"""
    
    print("🔄 Testing Supabase database connection...")
    
    supabase_url = os.getenv('SUPABASE_DATABASE_URL')
    if not supabase_url:
        print("❌ SUPABASE_DATABASE_URL not found in environment")
        return False
    
    try:
        # Test connection using SQLAlchemy
        from sqlalchemy import create_engine, text
        
        engine = create_engine(supabase_url)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {version}")
            
            # Test basic query
            result = connection.execute(text("SELECT current_database()"))
            db_name = result.fetchone()[0]
            print(f"✅ Connected to database: {db_name}")
            
        return True
        
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        print("💡 Check your SUPABASE_DATABASE_URL and ensure project is running")
        return False

def create_test_script():
    """Create a simple test script for development"""
    
    test_script = '''#!/usr/bin/env python3
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
        engine = create_engine(database_url)
        with engine.connect() as conn:
            # Test basic connectivity
            result = conn.execute(text("SELECT current_timestamp"))
            timestamp = result.fetchone()[0]
            print(f"✅ Supabase connected successfully at {timestamp}")
            
            # List existing tables
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"📊 Existing tables: {tables if tables else 'None (fresh database)'}")
            
            return True
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    if success:
        print("🎉 Ready for Phase 1 migration!")
    else:
        print("🔧 Please check your Supabase configuration")
'''
    
    with open('test_supabase_connection.py', 'w') as f:
        f.write(test_script)
    
    print("✅ Created test_supabase_connection.py")

def main():
    """Main setup process"""
    
    print("🚀 EXPENSESINK Phase 1 Day 1 - Environment Setup")
    print("=" * 50)
    
    # Step 1: Install requirements
    if not install_requirements():
        print("❌ Environment setup failed")
        return
    
    # Step 2: Check environment file
    env_ready = check_env_file()
    
    # Step 3: Create test script
    create_test_script()
    
    print("\n" + "=" * 50)
    if env_ready:
        print("🎉 Environment setup complete!")
        print("🧪 Run: python3 test_supabase_connection.py")
    else:
        print("⏸️  Waiting for Supabase credentials...")
        print("📝 Please add credentials to .env file, then run:")
        print("   python3 test_supabase_connection.py")
    
    print("\n🎯 Next: Complete Supabase credentials setup")

if __name__ == "__main__":
    main()
