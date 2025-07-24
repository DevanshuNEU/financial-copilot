# EXPENSESINK Supabase Configuration

## Overview

This directory contains all Supabase-specific configuration and Edge Functions for EXPENSESINK.

## Structure

```
supabase/
├── config.toml     # Project configuration
├── functions/      # Edge Functions
│   └── _shared/    # Shared utilities (not deployed)
└── migrations/     # Database migrations (if any)
```

## Edge Functions

All API endpoints are implemented as Supabase Edge Functions:

| Function | Method | Description |
|----------|--------|-------------|
| `health-check` | GET | API health status |
| `expenses-list` | GET | List expenses with filters |
| `expenses-get` | GET | Get single expense |
| `expenses-create` | POST | Create new expense |
| `expenses-update` | PUT | Update expense |
| `expenses-delete` | DELETE | Delete expense |
| `dashboard-api` | GET | Dashboard metrics |
| `analytics-api` | GET | Detailed analytics |
| `weekly-comparison` | GET | Week-over-week analysis |
| `safe-to-spend-api` | GET | Daily budget calculation |
| `budget-api` | GET/POST/PUT | Budget management |
| `onboarding-simple` | POST | User onboarding |

## Deployment

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy expenses-list

# Serve locally for testing
supabase functions serve
```

## Environment Variables

Edge Functions have access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

## Development

See `functions/README.md` for detailed development guidelines.

## Security

- All functions use CORS headers
- Input validation on all endpoints
- Service role key for admin operations only
- Row Level Security (RLS) enabled on all tables
