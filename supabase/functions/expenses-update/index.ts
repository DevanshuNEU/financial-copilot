import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authenticateUser, createAuthenticatedClient } from '../_shared/auth.ts'
import { errorResponse, successResponse, validationError, corsHeaders } from '../_shared/errors.ts'
import { validateExpenseUpdate, ValidationError } from '../_shared/validation.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow PUT/PATCH
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return errorResponse(new Error('Method not allowed'), 'expenses-update')
    }

    // Authenticate user
    const user = await authenticateUser(req)
    
    // Get expense ID from URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const expenseId = pathParts[pathParts.length - 1]
    
    if (!expenseId) {
      return validationError('Expense ID is required')
    }

    // Parse and validate input
    const body = await req.json()
    let validatedData
    
    try {
      validatedData = validateExpenseUpdate(body)
    } catch (error) {
      if (error instanceof ValidationError) {
        return validationError(error.message)
      }
      throw error
    }

    // Create authenticated client
    const authHeader = req.headers.get('Authorization')!
    const supabase = createAuthenticatedClient(authHeader)

    // Update expense (RLS ensures user can only update their own)
    const { data: expense, error } = await supabase
      .from('expenses')
      .update(validatedData)
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse(new Error('Expense not found'), 'expenses-update')
      }
      throw new Error(`Database error: ${error.message}`)
    }

    return successResponse({
      id: expense.id,
      amount: parseFloat(expense.amount),
      category: expense.category,
      vendor: expense.vendor,
      description: expense.description,
      status: expense.status,
      expense_date: expense.expense_date,
      updated_at: expense.updated_at
    })

  } catch (error) {
    return errorResponse(error, 'expenses-update')
  }
})
