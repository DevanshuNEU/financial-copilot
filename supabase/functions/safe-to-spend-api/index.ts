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

    // Get current date info
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const currentDay = now.getDate()
    const daysLeftInMonth = daysInMonth - currentDay + 1

    // Get budgets
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select('*')

    if (budgetsError && budgetsError.code !== 'PGRST116') {
      throw budgetsError
    }

    // Get expenses for the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .gte('created_at', startOfMonth.toISOString())

    if (expensesError) {
      throw expensesError
    }

    // Calculate total budget and spent
    const totalBudget = (budgets || []).reduce((sum: number, budget: any) => 
      sum + parseFloat(budget.monthly_limit), 0)

    const totalSpent = expenses.reduce((sum: number, expense: any) => 
      sum + parseFloat(expense.amount), 0)

    // Default values if no budget set
    const monthlyIncome = totalBudget > 0 ? totalBudget + 600 : 2000 // Assume budget + fixed costs
    const fixedCosts = 600 // Default fixed costs
    const savingsGoal = 200 // Default savings

    // Calculate available for spending
    const availableForSpending = monthlyIncome - fixedCosts - savingsGoal
    const remainingBudget = availableForSpending - totalSpent
    const dailySafeAmount = remainingBudget > 0 ? remainingBudget / daysLeftInMonth : 0

    // Calculate weekly safe amount
    const weeksLeftInMonth = Math.ceil(daysLeftInMonth / 7)
    const weeklySafeAmount = remainingBudget > 0 ? remainingBudget / weeksLeftInMonth : 0

    // Calculate spending pace
    const expectedSpentByNow = (availableForSpending / daysInMonth) * currentDay
    const spendingPace = expectedSpentByNow > 0 ? (totalSpent / expectedSpentByNow) * 100 : 0

    // Determine status
    let status = 'on-track'
    let statusMessage = 'Your spending is on track'

    if (spendingPace > 110) {
      status = 'overspending'
      statusMessage = 'You are spending faster than planned'
    } else if (spendingPace < 90) {
      status = 'underspending'
      statusMessage = 'You have room to spend more'
    }

    // Calculate projections
    const currentDailyAverage = currentDay > 0 ? totalSpent / currentDay : 0
    const projectedMonthlyTotal = currentDailyAverage * daysInMonth
    const projectedSavings = monthlyIncome - fixedCosts - projectedMonthlyTotal

    // Generate recommendations
    const recommendations = []

    if (dailySafeAmount <= 0) {
      recommendations.push({
        type: 'warning',
        message: 'You have exceeded your budget for this month',
        action: 'Try to minimize spending for the rest of the month'
      })
    } else if (dailySafeAmount < 20) {
      recommendations.push({
        type: 'caution',
        message: `Only $${dailySafeAmount.toFixed(2)} per day remaining`,
        action: 'Be mindful of your daily spending'
      })
    } else {
      recommendations.push({
        type: 'positive',
        message: `You can safely spend $${dailySafeAmount.toFixed(2)} per day`,
        action: 'Keep up the good work!'
      })
    }

    if (projectedSavings < 0) {
      recommendations.push({
        type: 'alert',
        message: 'Projected to exceed monthly income',
        action: 'Reduce spending to avoid going over budget'
      })
    }

    // Build safe-to-spend response
    const safeToSpendData = {
      // Core metrics
      monthlyIncome,
      fixedCosts,
      savingsGoal,
      totalBudget: availableForSpending,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      remainingBudget: parseFloat(remainingBudget.toFixed(2)),

      // Daily/Weekly amounts
      dailySafeAmount: parseFloat(Math.max(0, dailySafeAmount).toFixed(2)),
      weeklySafeAmount: parseFloat(Math.max(0, weeklySafeAmount).toFixed(2)),

      // Time info
      daysLeftInMonth,
      weeksLeftInMonth,
      currentDay,
      daysInMonth,

      // Status
      status,
      statusMessage,
      spendingPace: parseFloat(spendingPace.toFixed(1)),

      // Projections
      projectedMonthlyTotal: parseFloat(projectedMonthlyTotal.toFixed(2)),
      projectedSavings: parseFloat(projectedSavings.toFixed(2)),
      currentDailyAverage: parseFloat(currentDailyAverage.toFixed(2)),

      // Breakdown by timeframe
      breakdown: {
        today: parseFloat(Math.max(0, dailySafeAmount).toFixed(2)),
        thisWeek: parseFloat(Math.max(0, Math.min(weeklySafeAmount, remainingBudget)).toFixed(2)),
        thisMonth: parseFloat(Math.max(0, remainingBudget).toFixed(2))
      },

      // Recommendations
      recommendations,

      // Metadata
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }

    return new Response(
      JSON.stringify(safeToSpendData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in safe-to-spend-api:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
