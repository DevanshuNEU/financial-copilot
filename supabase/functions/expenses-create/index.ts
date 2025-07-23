import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { amount, category, vendor, description, status = 'pending' } = body

    // Validate required fields
    if (!amount || !category || !vendor) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: amount, category, vendor' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert new expense
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert([{
        amount: parseFloat(amount),
        category,
        vendor,
        description: description || '',
        status,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    // Return created expense
    const response = {
      id: expense.id,
      amount: parseFloat(expense.amount),
      category: expense.category,
      vendor: expense.vendor,
      description: expense.description,
      status: expense.status,
      created_at: expense.created_at
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      },
    )

  } catch (error) {
    console.error('Error in expenses-create:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
