import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

interface WeeklyDataItem {
  day: string;
  dayName: string;
  thisWeek: number;
  lastWeek: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow GET method
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use GET to retrieve weekly comparison.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all expenses for calculation
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (expensesError) {
      console.error('Database query error:', expensesError)
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve expense data.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Calculate date ranges
    const now = new Date()
    const currentDayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start of this week (Monday)
    const thisWeekStart = new Date(now)
    const daysFromMonday = (currentDayOfWeek === 0) ? 6 : currentDayOfWeek - 1
    thisWeekStart.setDate(now.getDate() - daysFromMonday)
    thisWeekStart.setHours(0, 0, 0, 0)

    // Calculate start of last week
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(thisWeekStart.getDate() - 7)

    // Calculate end of last week
    const lastWeekEnd = new Date(thisWeekStart)
    lastWeekEnd.setTime(thisWeekStart.getTime() - 1)

    // Day names for the week
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    // Initialize weekly data structure
    const weeklyData: WeeklyDataItem[] = []
    let thisWeekTotal = 0
    let lastWeekTotal = 0

    // Process each day of the week
    for (let i = 0; i < 7; i++) {
      const thisWeekDay = new Date(thisWeekStart)
      thisWeekDay.setDate(thisWeekStart.getDate() + i)
      
      const lastWeekDay = new Date(lastWeekStart)
      lastWeekDay.setDate(lastWeekStart.getDate() + i)

      // Calculate spending for this week's day
      const thisWeekDayStart = new Date(thisWeekDay)
      thisWeekDayStart.setHours(0, 0, 0, 0)
      const thisWeekDayEnd = new Date(thisWeekDay)
      thisWeekDayEnd.setHours(23, 59, 59, 999)

      const thisWeekDaySpending = expenses
        .filter((expense: any) => {
          const expenseDate = new Date(expense.created_at)
          return expenseDate >= thisWeekDayStart && expenseDate <= thisWeekDayEnd
        })
        .reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0)

      // Calculate spending for last week's day
      const lastWeekDayStart = new Date(lastWeekDay)
      lastWeekDayStart.setHours(0, 0, 0, 0)
      const lastWeekDayEnd = new Date(lastWeekDay)
      lastWeekDayEnd.setHours(23, 59, 59, 999)

      const lastWeekDaySpending = expenses
        .filter((expense: any) => {
          const expenseDate = new Date(expense.created_at)
          return expenseDate >= lastWeekDayStart && expenseDate <= lastWeekDayEnd
        })
        .reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0)

      // Add to weekly data
      weeklyData.push({
        day: thisWeekDay.toISOString().split('T')[0], // YYYY-MM-DD format
        dayName: dayNames[i],
        thisWeek: parseFloat(thisWeekDaySpending.toFixed(2)),
        lastWeek: parseFloat(lastWeekDaySpending.toFixed(2))
      })

      // Add to totals
      thisWeekTotal += thisWeekDaySpending
      lastWeekTotal += lastWeekDaySpending
    }

    // Prepare response with comprehensive weekly comparison
    const response = {
      weeklyData,
      thisWeekTotal: parseFloat(thisWeekTotal.toFixed(2)),
      lastWeekTotal: parseFloat(lastWeekTotal.toFixed(2)),
      currentDayOfWeek: currentDayOfWeek,
      weeklyChange: lastWeekTotal > 0 ? parseFloat(((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1)) : 0,
      analysis: {
        totalChange: parseFloat((thisWeekTotal - lastWeekTotal).toFixed(2)),
        averageDailyThisWeek: parseFloat((thisWeekTotal / 7).toFixed(2)),
        averageDailyLastWeek: parseFloat((lastWeekTotal / 7).toFixed(2)),
        highestDayThisWeek: weeklyData.reduce((max, day) => day.thisWeek > max.thisWeek ? day : max, weeklyData[0]),
        highestDayLastWeek: weeklyData.reduce((max, day) => day.lastWeek > max.lastWeek ? day : max, weeklyData[0])
      },
      metadata: {
        thisWeekStart: thisWeekStart.toISOString().split('T')[0],
        lastWeekStart: lastWeekStart.toISOString().split('T')[0],
        calculatedAt: new Date().toISOString(),
        totalExpensesAnalyzed: expenses.length
      }
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Unexpected error in weekly-comparison:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})