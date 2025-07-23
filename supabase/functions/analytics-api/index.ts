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

    // Get all expenses for analytics
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Get budgets for comparison
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select('*')

    if (budgetsError && budgetsError.code !== 'PGRST116') {
      throw budgetsError
    }

    // Calculate total spending
    const totalSpending = expenses.reduce((sum: number, expense: any) => 
      sum + parseFloat(expense.amount), 0)

    // Calculate spending by category
    const spendingByCategory: Record<string, number> = {}
    const categoryTransactions: Record<string, number> = {}
    
    expenses.forEach((expense: any) => {
      const category = expense.category
      spendingByCategory[category] = (spendingByCategory[category] || 0) + parseFloat(expense.amount)
      categoryTransactions[category] = (categoryTransactions[category] || 0) + 1
    })

    // Get unique categories
    const categoriesUsed = Object.keys(spendingByCategory).length

    // Calculate budget health percentage
    let totalBudget = 0
    let budgetHealth = 100 // Default to 100% if no budget

    if (budgets && budgets.length > 0) {
      totalBudget = budgets.reduce((sum: number, budget: any) => 
        sum + parseFloat(budget.monthly_limit), 0)
      
      if (totalBudget > 0) {
        budgetHealth = Math.max(0, Math.round(((totalBudget - totalSpending) / totalBudget) * 100))
      }
    }

    // Calculate average transaction
    const avgTransaction = expenses.length > 0 
      ? parseFloat((totalSpending / expenses.length).toFixed(2))
      : 0

    // Calculate monthly trend (compare with last month)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const thisMonthSpending = expenses
      .filter((expense: any) => new Date(expense.created_at) >= startOfMonth)
      .reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0)

    const lastMonthSpending = expenses
      .filter((expense: any) => {
        const date = new Date(expense.created_at)
        return date >= startOfLastMonth && date <= endOfLastMonth
      })
      .reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0)

    const monthlyTrend = lastMonthSpending > 0
      ? ((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100
      : 0

    // Calculate daily average
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const currentDay = now.getDate()
    const dailyAverage = thisMonthSpending / currentDay

    // Generate spending breakdown with percentages
    const spendingBreakdown = Object.entries(spendingByCategory)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
        percentage: totalSpending > 0 ? parseFloat(((amount / totalSpending) * 100).toFixed(1)) : 0,
        transactions: categoryTransactions[category]
      }))
      .sort((a, b) => b.amount - a.amount)

    // Get top spending category
    const topCategory = spendingBreakdown[0] || null

    // Generate insights
    const insights = []

    if (monthlyTrend > 20) {
      insights.push({
        type: 'warning',
        title: 'Spending Increase',
        message: `Your spending increased ${monthlyTrend.toFixed(0)}% compared to last month`
      })
    }

    if (topCategory && topCategory.percentage > 40) {
      insights.push({
        type: 'info',
        title: 'Top Spending Category',
        message: `${topCategory.category} accounts for ${topCategory.percentage}% of your spending`
      })
    }

    if (budgetHealth < 20) {
      insights.push({
        type: 'alert',
        title: 'Budget Warning',
        message: `Only ${budgetHealth}% of your budget remaining this month`
      })
    }

    if (dailyAverage > 0) {
      const projectedMonthly = dailyAverage * daysInMonth
      insights.push({
        type: 'info',
        title: 'Monthly Projection',
        message: `At current pace, you'll spend $${projectedMonthly.toFixed(2)} this month`
      })
    }

    // Build comprehensive analytics response
    const analyticsData = {
      // Summary metrics
      summary: {
        totalSpending: parseFloat(totalSpending.toFixed(2)),
        budgetHealth: budgetHealth + '%',
        transactions: expenses.length,
        avgTransaction: avgTransaction,
        categoriesUsed,
        monthlyTrend: parseFloat(monthlyTrend.toFixed(1))
      },

      // Spending breakdown
      spendingBreakdown,

      // Budget comparison
      budgetComparison: {
        totalBudget: parseFloat(totalBudget.toFixed(2)),
        totalSpent: parseFloat(totalSpending.toFixed(2)),
        remaining: parseFloat((totalBudget - totalSpending).toFixed(2)),
        percentageUsed: totalBudget > 0 ? parseFloat(((totalSpending / totalBudget) * 100).toFixed(1)) : 0
      },

      // Monthly metrics
      monthlyMetrics: {
        thisMonth: parseFloat(thisMonthSpending.toFixed(2)),
        lastMonth: parseFloat(lastMonthSpending.toFixed(2)),
        dailyAverage: parseFloat(dailyAverage.toFixed(2)),
        projectedTotal: parseFloat((dailyAverage * daysInMonth).toFixed(2))
      },

      // Top categories
      topCategories: spendingBreakdown.slice(0, 5),

      // Insights
      insights,

      // Metadata
      lastUpdated: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(analyticsData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in analytics-api:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
