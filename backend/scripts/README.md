# Backend Scripts

## Available Scripts

### test_supabase_connection.py
Tests the Supabase database connection and verifies permissions.

**Usage:**
```bash
python test_supabase_connection.py
```

**What it does:**
- Verifies database connectivity
- Shows database information
- Lists existing tables
- Tests write permissions
- Provides troubleshooting steps if connection fails

**Required Environment Variables:**
- `SUPABASE_DATABASE_URL`: PostgreSQL connection string from Supabase dashboard
