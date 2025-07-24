/**
 * EXPENSESINK - List Expenses Edge Function
 * =========================================
 * 
 * GET /expenses-list
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - category: ExpenseCategory
 * - status: ExpenseStatus
 * - start_date: ISO date string
 * - end_date: ISO date string
 * - min_amount: number
 * - max_amount: number
 * - search: string (searches vendor and description)
 * - sort_by: string (default: created_at)
 * - sort_order: asc | desc (default: desc)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  createSupabaseClient,
  handleCors,
  createApiResponse,
  errorResponse,
  getUrlParams,
  logError
} from "../_shared/utils.ts"
import { 
  ExpenseFilters,
  ExpenseCategory,
  ExpenseStatus
} from "../_shared/types.ts"
import { getExpenses } from "../_shared/database.ts"

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return errorResponse('Method not allowed', 'METHOD_NOT_ALLOWED', 405)
    }

    // Initialize Supabase client
    const supabase = createSupabaseClient()
    
    // Parse query parameters
    const params = getUrlParams(req)
    
    // Build filters
    const filters: ExpenseFilters = {
      page: parseInt(params.get('page') || '1'),
      limit: parseInt(params.get('limit') || '20'),
      sort_by: params.get('sort_by') || 'created_at',
      sort_order: (params.get('sort_order') || 'desc') as 'asc' | 'desc',
    }
    
    // Category filter
    const category = params.get('category')
    if (category && Object.values(ExpenseCategory).includes(category as ExpenseCategory)) {
      filters.category = category as ExpenseCategory
    }
    
    // Status filter
    const status = params.get('status')
    if (status && Object.values(ExpenseStatus).includes(status as ExpenseStatus)) {
      filters.status = status as ExpenseStatus
    }
    
    // Date filters
    const startDate = params.get('start_date')
    if (startDate) filters.start_date = startDate
    
    const endDate = params.get('end_date')
    if (endDate) filters.end_date = endDate
    
    // Amount filters
    const minAmount = params.get('min_amount')
    if (minAmount) filters.min_amount = parseFloat(minAmount)
    
    const maxAmount = params.get('max_amount')
    if (maxAmount) filters.max_amount = parseFloat(maxAmount)
    
    // Search filter
    const search = params.get('search')
    if (search) filters.search = search
    
    // Get expenses from database
    const { data: expenses, count, error } = await getExpenses(supabase, filters)
    
    if (error) {
      logError('expenses-list', error)
      return errorResponse('Failed to fetch expenses', 'DATABASE_ERROR', 500)
    }
    
    // Calculate total amount
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    // Build response
    const response = {
      expenses: expenses.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        vendor: expense.vendor,
        description: expense.description,
        status: expense.status,
        receipt_url: expense.receipt_url,
        notes: expense.notes,
        created_at: expense.created_at,
        updated_at: expense.updated_at,
      })),
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total_count: count,
        total_pages: Math.ceil(count / (filters.limit || 20)),
      },
      summary: {
        total_amount: Math.round(total * 100) / 100,
        expense_count: expenses.length,
      },
      filters: {
        category: filters.category,
        status: filters.status,
        date_range: {
          start: filters.start_date,
          end: filters.end_date,
        },
        amount_range: {
          min: filters.min_amount,
          max: filters.max_amount,
        },
        search: filters.search,
      },
    }
    
    return createApiResponse(response)
    
  } catch (error) {
    logError('expenses-list', error)
    return errorResponse(
      'An unexpected error occurred',
      'INTERNAL_ERROR',
      500
    )
  }
})
