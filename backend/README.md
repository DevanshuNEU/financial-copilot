# EXPENSESINK Backend

## Architecture

EXPENSESINK uses a **pure Supabase architecture**:
- **Database**: Supabase PostgreSQL
- **API**: Supabase Edge Functions (Deno runtime)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions

## Directory Structure

```
backend/
├── legacy_flask/        # Legacy Flask API (reference only)
├── scripts/             # Utility scripts
│   └── test_supabase_connection.py
├── .env                 # Environment variables
├── .env.example         # Environment template
└── README.md           # This file
```

## Edge Functions

All API logic is now in Supabase Edge Functions located at:
```
/supabase/functions/
├── analytics-api/      # Analytics calculations
├── budget-api/         # Budget management
├── dashboard-api/      # Dashboard metrics
├── expenses-create/    # Create expense
├── expenses-delete/    # Delete expense
├── expenses-get/       # Get single expense
├── expenses-list/      # List expenses
├── expenses-update/    # Update expense
├── health-check/       # API health check
├── onboarding-simple/  # User onboarding
├── safe-to-spend-api/  # Safe to spend calculations
└── weekly-comparison/  # Weekly spending analytics
```

## Environment Variables

Required in `.env`:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Testing Connection

```bash
cd scripts
python test_supabase_connection.py
```

## Deployment

Edge Functions are deployed via the Supabase CLI:
```bash
cd /path/to/project
./deploy_edge_functions.sh
```

## Legacy Code

The `legacy_flask/` directory contains the original Flask API implementation for reference only. This code is no longer used in production.
