# EXPENSESINK Edge Functions

## 🏗️ Architecture

```
supabase/
├── config.toml              # Supabase project configuration
└── functions/               # Edge Functions (Deno runtime)
    ├── _shared/             # Shared modules (not deployed)
    │   ├── types.ts         # TypeScript interfaces & enums
    │   ├── utils.ts         # Common utilities & helpers
    │   ├── validation.ts    # Input validation functions
    │   └── database.ts      # Database query helpers
    ├── analytics-api/       # GET /analytics-api
    ├── budget-api/          # GET, POST, PUT /budget-api
    ├── dashboard-api/       # GET /dashboard-api
    ├── expenses-create/     # POST /expenses-create
    ├── expenses-delete/     # DELETE /expenses-delete/{id}
    ├── expenses-get/        # GET /expenses-get/{id}
    ├── expenses-list/       # GET /expenses-list
    ├── expenses-update/     # PUT /expenses-update/{id}
    ├── health-check/        # GET /health-check
    ├── onboarding-simple/   # POST /onboarding-simple
    ├── safe-to-spend-api/   # GET /safe-to-spend-api
    └── weekly-comparison/   # GET /weekly-comparison
```

## 🚀 Deployment

Deploy all functions:
```bash
supabase functions deploy
```

Deploy specific function:
```bash
supabase functions deploy expenses-list
```

## 📝 Development Guidelines

### 1. **Use Shared Modules**
```typescript
import { createSupabaseClient, handleCors } from "../_shared/utils.ts"
import { Expense, ExpenseCategory } from "../_shared/types.ts"
import { validateExpense } from "../_shared/validation.ts"
```

### 2. **Consistent Error Handling**
```typescript
try {
  // Your logic
} catch (error) {
  logError('function-name', error)
  return errorResponse('User-friendly message', 'ERROR_CODE', 500)
}
```

### 3. **Standardized Responses**
```typescript
// Success
return createApiResponse({ data: result })

// Error
return errorResponse('Not found', 'NOT_FOUND', 404)
```

### 4. **Input Validation**
```typescript
const validation = validateExpense(data)
if (!validation.is_valid) {
  return errorResponse('Invalid input', 'VALIDATION_ERROR', 400, {
    errors: validation.errors
  })
}
```

## 🔐 Security Best Practices

1. **Always validate input** - Use validation functions
2. **Sanitize strings** - Prevent injection attacks
3. **Check permissions** - Verify user access
4. **Log errors** - But don't expose sensitive data
5. **Use service role key** - For admin operations only

## 📊 API Endpoints

### Expenses
- `GET /expenses-list` - List expenses with filters
- `GET /expenses-get/{id}` - Get single expense
- `POST /expenses-create` - Create new expense
- `PUT /expenses-update/{id}` - Update expense
- `DELETE /expenses-delete/{id}` - Delete expense

### Analytics
- `GET /dashboard-api` - Dashboard metrics
- `GET /analytics-api` - Detailed analytics
- `GET /weekly-comparison` - Week-over-week analysis
- `GET /safe-to-spend-api` - Daily budget calculation

### Budget
- `GET /budget-api` - List budgets
- `POST /budget-api` - Create budget
- `PUT /budget-api/{id}` - Update budget

### System
- `GET /health-check` - API health status
- `POST /onboarding-simple` - User onboarding

## 🧪 Testing

Test locally:
```bash
supabase functions serve expenses-list
```

Test with curl:
```bash
curl -i --location --request GET \
  'http://localhost:54321/functions/v1/expenses-list?page=1&limit=10' \
  --header 'Authorization: Bearer YOUR_ANON_KEY'
```

## 📈 Performance Optimization

1. **Use database indexes** - On frequently queried columns
2. **Implement pagination** - Limit default to 20 items
3. **Cache when possible** - For expensive calculations
4. **Minimize joins** - Use selective queries
5. **Batch operations** - For bulk updates

## 🔄 Migration Notes

When migrating from Flask to Edge Functions:
1. Routes map directly: `/api/expenses` → `/expenses-list`
2. Authentication via Supabase Auth headers
3. Use Deno instead of Python imports
4. PostgreSQL instead of SQLite
5. TypeScript for type safety

## 📚 Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime API](https://deno.land/api)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
