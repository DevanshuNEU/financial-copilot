import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No auth' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // ✅ Get onboarding data for user's budget and fixed costs
    const { data: onboardingData } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('Onboarding data for user:', onboardingData)

    // Get expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Get category budgets (optional - for advanced budget tracking)
    const { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)

    // 💰 CALCULATE FINANCIAL METRICS WITH FIXED COSTS
    
    // Total spent
    const totalSpent = (expenses || []).reduce((sum: number, e: any) => 
      sum + parseFloat(e.amount), 0)

    // Monthly budget from onboarding
    const monthlyBudget = onboardingData?.monthly_budget || 5000

    // ✅ Calculate total fixed costs
    const fixedCosts = onboardingData?.fixed_costs || []
    const totalFixedCosts = fixedCosts.reduce((sum: number, cost: any) => 
      sum + parseFloat(cost.amount || 0), 0)

    console.log('Budget:', monthlyBudget, 'Fixed costs:', totalFixedCosts, 'Spent:', totalSpent)

    // ✅ Available for discretionary spending = Budget - Fixed Costs - Spent
    const discretionaryBudget = monthlyBudget - totalFixedCosts
    const availableAmount = discretionaryBudget - totalSpent

    // Calculate days remaining in month
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysRemaining = Math.max(1, endOfMonth.getDate() - now.getDate() + 1)

    // ✅ Daily safe amount = Available / Days Remaining
    const dailySafeAmount = availableAmount > 0 ? availableAmount / daysRemaining : 0

    // Calculate spending by category
    const spendingByCategory: Record<string, number> = {}
    ;(expenses || []).forEach((expense: any) => {
      const category = expense.category
      spendingByCategory[category] = (spendingByCategory[category] || 0) + parseFloat(expense.amount)
    })

    // Calculate budget health per category
    const budgetHealth: Record<string, any> = {}
    
    if (budgets && budgets.length > 0) {
      budgets.forEach((budget: any) => {
        const category = budget.category
        const limit = parseFloat(budget.monthly_limit)
        const spent = spendingByCategory[category] || 0
        const remaining = limit - spent
        const percentage = limit > 0 ? (spent / limit) * 100 : 0
        
        budgetHealth[category] = {
          limit,
          spent: parseFloat(spent.toFixed(2)),
          remaining: parseFloat(remaining.toFixed(2)),
          percentage: parseFloat(percentage.toFixed(1)),
          status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
        }
      })
    }

    // Generate insights
    const insights = []
    
    if (availableAmount < 0) {
      insights.push({
        type: 'warning',
        message: `You're $${Math.abs(availableAmount).toFixed(2)} over your discretionary budget this month`
      })
    } else if (availableAmount < 100) {
      insights.push({
        type: 'warning', 
        message: `Only $${availableAmount.toFixed(2)} left for discretionary spending`
      })
    }

    if (dailySafeAmount > 0 && dailySafeAmount < 10) {
      insights.push({
        type: 'alert',
        message: `You can only spend $${dailySafeAmount.toFixed(2)} per day for the rest of the month`
      })
    }

    // Build comprehensive dashboard response
    const dashboardResponse = {
      summary: {
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        totalBudget: parseFloat(monthlyBudget.toFixed(2)),
        totalFixedCosts: parseFloat(totalFixedCosts.toFixed(2)),
        discretionaryBudget: parseFloat(discretionaryBudget.toFixed(2)),
        availableAmount: parseFloat(availableAmount.toFixed(2)),
        dailySafeAmount: parseFloat(dailySafeAmount.toFixed(2)),
        daysRemaining,
        spendingTrend: 0
      },
      spendingByCategory,
      budgetHealth,
      recentExpenses: (expenses || []).slice(0, 5).map((e: any) => ({
        id: e.id,
        amount: parseFloat(e.amount),
        category: e.category,
        vendor: e.vendor,
        description: e.description,
        created_at: e.created_at
      })),
      insights,
      stats: {
        totalTransactions: (expenses || []).length,
        averageTransaction: (expenses || []).length > 0 ? parseFloat((totalSpent / (expenses || []).length).toFixed(2)) : 0
      },
      timestamp: new Date().toISOString()
    }

    console.log('Sending dashboard response:', dashboardResponse)

    return new Response(JSON.stringify(dashboardResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal error',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
