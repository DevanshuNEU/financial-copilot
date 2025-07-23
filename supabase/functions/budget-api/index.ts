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
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'GET') {
      // Get all budgets
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .order('category', { ascending: true })

      if (budgetsError && budgetsError.code !== 'PGRST116') {
        throw budgetsError
      }

      // Get expenses to calculate spending per category
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')

      if (expensesError) {
        throw expensesError
      }

      // Calculate spending by category
      const spendingByCategory: Record<string, number> = {}
      expenses.forEach((expense: any) => {
        const category = expense.category
        spendingByCategory[category] = (spendingByCategory[category] || 0) + parseFloat(expense.amount)
      })

      // Calculate budget health for each category
      const budgetDetails = (budgets || []).map((budget: any) => {
        const spent = spendingByCategory[budget.category] || 0
        const limit = parseFloat(budget.monthly_limit)
        const remaining = limit - spent
        const percentage = limit > 0 ? (spent / limit) * 100 : 0

        return {
          id: budget.id,
          category: budget.category,
          monthlyLimit: limit,
          spent: parseFloat(spent.toFixed(2)),
          remaining: parseFloat(remaining.toFixed(2)),
          percentage: parseFloat(percentage.toFixed(1)),
          status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good',
          isOverBudget: percentage > 100
        }
      })

      // Calculate overall budget health
      const totalBudget = budgetDetails.reduce((sum, b) => sum + b.monthlyLimit, 0)
      const totalSpent = budgetDetails.reduce((sum, b) => sum + b.spent, 0)
      const overallHealth = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 100

      // Count categories by status
      const healthyCategories = budgetDetails.filter(b => b.status === 'good').length
      const warningCategories = budgetDetails.filter(b => b.status === 'warning').length
      const overBudgetCategories = budgetDetails.filter(b => b.status === 'over').length

      const response = {
        budgets: budgetDetails,
        summary: {
          totalBudget: parseFloat(totalBudget.toFixed(2)),
          totalSpent: parseFloat(totalSpent.toFixed(2)),
          totalRemaining: parseFloat((totalBudget - totalSpent).toFixed(2)),
          overallHealth: parseFloat(overallHealth.toFixed(1)),
          healthyCategories,
          warningCategories,
          overBudgetCategories
        }
      }

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } else if (req.method === 'POST') {
      // Create or update budget
      const body = await req.json()
      const { category, monthly_limit } = body

      if (!category || monthly_limit === undefined) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: category, monthly_limit' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Check if budget exists for this category
      const { data: existing, error: checkError } = await supabase
        .from('budgets')
        .select('*')
        .eq('category', category)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      let result
      if (existing) {
        // Update existing budget
        const { data, error } = await supabase
          .from('budgets')
          .update({ monthly_limit: parseFloat(monthly_limit) })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Create new budget
        const { data, error } = await supabase
          .from('budgets')
          .insert([{
            category,
            monthly_limit: parseFloat(monthly_limit),
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) throw error
        result = data
      }

      return new Response(
        JSON.stringify({
          id: result.id,
          category: result.category,
          monthly_limit: result.monthly_limit,
          created_at: result.created_at
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: existing ? 200 : 201,
        },
      )

    } else if (req.method === 'DELETE') {
      // Delete budget by category
      const url = new URL(req.url)
      const category = url.searchParams.get('category')

      if (!category) {
        return new Response(
          JSON.stringify({ error: 'Missing category parameter' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('category', category)

      if (error) throw error

      return new Response(
        JSON.stringify({ message: 'Budget deleted successfully' }),
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
    console.error('Error in budget-api:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
