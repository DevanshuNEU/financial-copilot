import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow DELETE method
    if (req.method !== 'DELETE') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use DELETE to remove expenses.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Extract expense ID from URL query parameter
    const url = new URL(req.url)
    const expenseId = url.searchParams.get('id')

    // Validate expense ID
    if (!expenseId || isNaN(parseInt(expenseId))) {
      return new Response(
        JSON.stringify({ error: 'Invalid expense ID. Must be provided as ?id=number parameter.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if expense exists and get details for audit trail
    const { data: existingExpense, error: checkError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', parseInt(expenseId))
      .single()

    if (checkError || !existingExpense) {
      return new Response(
        JSON.stringify({ error: `Expense with ID ${expenseId} not found.` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Store expense details for response (before deletion)
    const deletedExpenseDetails = {
      id: existingExpense.id,
      amount: parseFloat(existingExpense.amount),
      category: existingExpense.category,
      vendor: existingExpense.vendor,
      description: existingExpense.description,
      status: existingExpense.status,
      created_at: existingExpense.created_at
    }

    // Perform deletion
    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', parseInt(expenseId))

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete expense. Please try again.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Verify deletion was successful
    const { data: verifyDeleted, error: verifyError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', parseInt(expenseId))
      .single()

    if (!verifyError && verifyDeleted) {
      // If expense still exists, deletion failed
      return new Response(
        JSON.stringify({ error: 'Deletion verification failed. Expense may still exist.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Return success response with deleted expense details
    const response = {
      message: 'Expense deleted successfully.',
      deletedExpense: deletedExpenseDetails,
      deletedAt: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Unexpected error in expenses-delete:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})