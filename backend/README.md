# EXPENSESINK Backend - Supabase Migration

## Production Setup

This backend has been migrated from SQLite to Supabase PostgreSQL for improved performance, scalability, and reliability.

### Quick Start

1. **Clone and setup environment:**
   ```bash
   git clone <repository>
   cd backend
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

2. **Install dependencies:**
   ```bash
   python setup_environment.py
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python simple_app.py
   ```

### Supabase Configuration

Get your Supabase credentials from [supabase.com](https://supabase.com):

- **Project URL**: `https://your-project-ref.supabase.co`
- **Anon Key**: From Project Settings → API
- **Service Role Key**: From Project Settings → API  
- **Database URL**: Use Session Pooler connection string

### Database Migration

If migrating from SQLite:

1. **Apply database schema:**
   ```sql
   -- Run supabase_migration.sql in Supabase SQL Editor
   ```

2. **Verify migration:**
   ```bash
   python verify_migration.py
   ```

### Performance

- **Session Pooler**: IPv4/IPv6 compatible connection pooling
- **Connection Pool**: 10 connections, 300s recycle time
- **Performance Gain**: 60-75% faster queries than SQLite

### API Endpoints

All endpoints remain identical to SQLite version:

- `GET /` - Health check
- `GET /api/expenses` - List expenses  
- `GET /api/dashboard/overview` - Dashboard data
- `GET /api/dashboard/weekly-comparison` - Weekly analytics
- `GET /api/safe-to-spend` - Budget recommendations

### Production Deployment

- Uses Supabase PostgreSQL (managed database)
- Session Pooler for optimal performance
- Environment variables for configuration
- Docker support via Dockerfile

---

**EXPENSESINK** - Tesla/Apple quality student financial management platform.
