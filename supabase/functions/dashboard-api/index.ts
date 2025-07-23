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

    // Get expenses data
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (expensesError) {
      throw expensesError
    }

    // Get budget data
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select('*')

    if (budgetsError && budgetsError.code !== 'PGRST116') {
      throw budgetsError
    }

    // Calculate financial metrics
    const totalSpent = expenses.reduce((sum: number, expense: any) => 
      sum + parseFloat(expense.amount), 0)

    // Calculate spending by category
    const spendingByCategory: Record<string, number> = {}
    expenses.forEach((expense: any) => {
      const category = expense.category
      spendingByCategory[category] = (spendingByCategory[category] || 0) + parseFloat(expense.amount)
    })

    // Calculate budget health
    const budgetHealth: Record<string, any> = {}
    let totalBudget = 0
    
    if (budgets && budgets.length > 0) {
      budgets.forEach((budget: any) => {
        const category = budget.category
        const limit = parseFloat(budget.monthly_limit)
        const spent = spendingByCategory[category] || 0
        const remaining = limit - spent
        const percentage = limit > 0 ? (spent / limit) * 100 : 0
        
        totalBudget += limit
        
        budgetHealth[category] = {
          limit,
          spent: parseFloat(spent.toFixed(2)),
          remaining: parseFloat(remaining.toFixed(2)),
          percentage: parseFloat(percentage.toFixed(1)),
          status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
        }
      })
    }

    // Calculate available amount (budget - spent)
    const availableAmount = totalBudget - totalSpent

    // Get recent expenses (last 5)
    const recentExpenses = expenses.slice(0, 5).map((expense: any) => ({
      id: expense.id,
      amount: parseFloat(expense.amount),
      category: expense.category,
      vendor: expense.vendor,
      description: expense.description,
      created_at: expense.created_at
    }))

    // Calculate spending trends (last 7 days vs previous 7 days)
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const last7DaysSpending = expenses
      .filter((expense: any) => new Date(expense.created_at) >= last7Days)
      .reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0)

    const previous7DaysSpending = expenses
      .filter((expense: any) => {
        const date = new Date(expense.created_at)
        return date >= previous7Days && date < last7Days
      })
      .reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0)

    const spendingTrend = previous7DaysSpending > 0 
      ? ((last7DaysSpending - previous7DaysSpending) / previous7DaysSpending) * 100
      : 0

    // Generate insights
    const insights = []
    
    if (availableAmount < 0) {
      insights.push({
        type: 'warning',
        message: `You're $${Math.abs(availableAmount).toFixed(2)} over budget this month`
      })
    } else if (availableAmount < 100) {
      insights.push({
        type: 'warning', 
        message: `Only $${availableAmount.toFixed(2)} left in your budget`
      })
    }

    if (spendingTrend > 50) {
      insights.push({
        type: 'alert',
        message: `Your spending increased ${spendingTrend.toFixed(0)}% this week`
      })
    } else if (spendingTrend < -20) {
      insights.push({
        type: 'positive',
        message: `Great job! Spending decreased ${Math.abs(spendingTrend).toFixed(0)}% this week`
      })
    }

    // Top spending category
    const topCategory = Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (topCategory) {
      insights.push({
        type: 'info',
        message: `Your biggest expense category is ${topCategory[0]} ($${topCategory[1].toFixed(2)})`
      })
    }

    // Build comprehensive dashboard response
    const dashboardData = {
      summary: {
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        totalBudget: parseFloat(totalBudget.toFixed(2)),
        availableAmount: parseFloat(availableAmount.toFixed(2)),
        spendingTrend: parseFloat(spendingTrend.toFixed(1))
      },
      spendingByCategory,
      budgetHealth,
      recentExpenses,
      insights,
      stats: {
        totalTransactions: expenses.length,
        averageTransaction: expenses.length > 0 ? parseFloat((totalSpent / expenses.length).toFixed(2)) : 0,
        last7DaysSpending: parseFloat(last7DaysSpending.toFixed(2)),
        previous7DaysSpending: parseFloat(previous7DaysSpending.toFixed(2))
      },
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(dashboardData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in dashboard-api:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
