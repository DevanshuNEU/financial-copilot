import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Default onboarding data
const defaultOnboarding = {
  monthlyIncome: 2000,
  fixedCosts: [{ name: "Rent/Dorm", amount: 600 }],
  spendingCategories: {
    food: 300,
    transportation: 100,
    entertainment: 150,
    shopping: 100,
    education: 50,
    healthcare: 50,
    other: 50
  },
  savingsGoal: 200,
  budgetingStyle: "balanced"
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'GET') {
      // Get onboarding data from budgets table
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select('*')

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // If no budgets exist, return default onboarding data
      if (!budgets || budgets.length === 0) {
        return new Response(
          JSON.stringify(defaultOnboarding),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }

      // Convert budgets to onboarding format
      const spendingCategories: Record<string, number> = {}
      budgets.forEach((budget: any) => {
        spendingCategories[budget.category] = budget.monthly_limit
      })

      const onboardingData = {
        ...defaultOnboarding,
        spendingCategories
      }

      return new Response(
        JSON.stringify(onboardingData),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else if (req.method === 'POST') {
      // Save onboarding data to budgets table
      const body = await req.json()
      const { spendingCategories } = body

      if (!spendingCategories) {
        return new Response(
          JSON.stringify({ error: 'Missing spendingCategories in request body' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Delete existing budgets
      await supabase.from('budgets').delete().neq('id', 0)

      // Insert new budgets
      const budgetInserts = Object.entries(spendingCategories).map(([category, limit]) => ({
        category,
        monthly_limit: Number(limit),
        created_at: new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from('budgets')
        .insert(budgetInserts)

      if (insertError) {
        throw insertError
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Onboarding data saved successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

  } catch (error) {
    console.error('Error in onboarding-simple:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
