import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
}

interface UpdateExpenseRequest {
  amount?: number;
  category?: string;
  vendor?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow PUT method
    if (req.method !== 'PUT') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use PUT to update expenses.' }),
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

    // Parse and validate request body
    let updateData: UpdateExpenseRequest
    try {
      updateData = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate update data - at least one field must be provided
    if (!updateData || Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one field must be provided for update.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate individual fields
    if (updateData.amount !== undefined) {
      const amount = Number(updateData.amount)
      if (isNaN(amount) || amount <= 0) {
        return new Response(
          JSON.stringify({ error: 'Amount must be a positive number.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      updateData.amount = parseFloat(amount.toFixed(2))
    }

    if (updateData.category !== undefined && (!updateData.category || updateData.category.trim().length === 0)) {
      return new Response(
        JSON.stringify({ error: 'Category cannot be empty.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (updateData.vendor !== undefined && (!updateData.vendor || updateData.vendor.trim().length === 0)) {
      return new Response(
        JSON.stringify({ error: 'Vendor cannot be empty.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (updateData.status !== undefined && !['pending', 'approved', 'rejected'].includes(updateData.status)) {
      return new Response(
        JSON.stringify({ error: 'Status must be pending, approved, or rejected.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if expense exists
    const { data: existingExpense, error: checkError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', parseInt(expenseId))
      .single()

    if (checkError || !existingExpense) {
      return new Response(
        JSON.stringify({ error: `Expense with ID ${expenseId} not found.` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Prepare update object with only provided fields
    const updateObject: any = {}
    if (updateData.amount !== undefined) updateObject.amount = updateData.amount
    if (updateData.category !== undefined) updateObject.category = updateData.category.trim()
    if (updateData.vendor !== undefined) updateObject.vendor = updateData.vendor.trim()
    if (updateData.description !== undefined) updateObject.description = updateData.description?.trim() || ''
    if (updateData.status !== undefined) updateObject.status = updateData.status

    // Update expense in database
    const { data: updatedExpense, error: updateError } = await supabase
      .from('expenses')
      .update(updateObject)
      .eq('id', parseInt(expenseId))
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update expense. Please try again.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Return updated expense with proper formatting
    const response = {
      id: updatedExpense.id,
      amount: parseFloat(updatedExpense.amount),
      category: updatedExpense.category,
      vendor: updatedExpense.vendor,
      description: updatedExpense.description,
      status: updatedExpense.status,
      created_at: updatedExpense.created_at
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Unexpected error in expenses-update:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})