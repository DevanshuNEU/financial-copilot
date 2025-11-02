import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authenticateUser, createAuthenticatedClient } from '../_shared/auth.ts'
import { errorResponse, successResponse, validationError, corsHeaders } from '../_shared/errors.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow DELETE
    if (req.method !== 'DELETE') {
      return errorResponse(new Error('Method not allowed'), 'expenses-delete')
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

    // Create authenticated client
    const authHeader = req.headers.get('Authorization')!
    const supabase = createAuthenticatedClient(authHeader)

    // Delete expense (RLS ensures user can only delete their own)
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', user.id)

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse(new Error('Expense not found'), 'expenses-delete')
      }
      throw new Error(`Database error: ${error.message}`)
    }

    return successResponse({
      message: 'Expense deleted successfully',
      id: expenseId
    })

  } catch (error) {
    return errorResponse(error, 'expenses-delete')
  }
})
