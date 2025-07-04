// Supabase Financial Service Implementation
import type { IFinancialService, OnboardingData, PersonalizedSafeToSpend } from '../types/services'
import { supabase } from '../lib/supabase'

export class SupabaseFinancialService implements IFinancialService {
  /**
   * Save onboarding data to Supabase
   */
  async saveOnboardingData(data: OnboardingData): Promise<void> {
    console.log('💾 Supabase: Starting saveOnboardingData with:', data)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const error = 'User must be authenticated to save onboarding data'
      console.error('❌ Supabase:', error)
      throw new Error(error)
    }

    console.log(`👤 Supabase: Saving for user: ${user.id}`)

    const onboardingRecord = {
      user_id: user.id,
      monthly_budget: Number(data.monthlyBudget),
      currency: data.currency,
      has_meal_plan: Boolean(data.hasMealPlan),
      fixed_costs: data.fixedCosts || [],
      spending_categories: data.spendingCategories || {},
      is_complete: true,
      completed_at: new Date().toISOString()
    }

    console.log('📦 Supabase: Prepared record:', onboardingRecord)

    const { data: savedData, error } = await supabase
      .from('onboarding_data')
      .upsert(onboardingRecord)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase: Save error:', error)
      throw new Error(`Failed to save onboarding data: ${error.message}`)
    }

    console.log('✅ Supabase: Data saved successfully:', savedData)
  }

  /**
   * Load onboarding data from Supabase
   */
  async loadOnboardingData(): Promise<OnboardingData | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ Supabase: No user found - cannot load data')
      return null
    }

    console.log(`🔍 Supabase: Loading onboarding data for user: ${user.id}`)

    const { data, error } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('❌ Supabase: Failed to load onboarding data:', error)
      return null
    }

    if (!data) {
      console.log('❌ Supabase: No onboarding data found for user')
      return null
    }

    console.log('📊 Supabase: Raw data from database:', data)

    // Convert Supabase format to frontend format
    const convertedData = {
      monthlyBudget: Number(data.monthly_budget),
      currency: data.currency,
      hasMealPlan: Boolean(data.has_meal_plan),
      fixedCosts: Array.isArray(data.fixed_costs) ? data.fixed_costs : [],
      spendingCategories: data.spending_categories && typeof data.spending_categories === 'object' 
        ? data.spending_categories 
        : {}
    }

    console.log('✅ Supabase: Converted data for frontend:', convertedData)
    return convertedData
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ Supabase: No user found - onboarding incomplete')
      return false
    }

    console.log(`🔍 Supabase: Checking onboarding status for user: ${user.id}`)

    const { data, error } = await supabase
      .from('onboarding_data')
      .select('is_complete, monthly_budget, currency, fixed_costs, spending_categories')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('❌ Supabase: Failed to check onboarding status:', error)
      return false
    }

    if (!data) {
      console.log('❌ Supabase: No onboarding data found - user is new')
      return false
    }

    console.log('📊 Supabase: Onboarding data found:', {
      is_complete: data.is_complete,
      has_budget: !!data.monthly_budget,
      has_currency: !!data.currency,
      has_fixed_costs: Array.isArray(data.fixed_costs) && data.fixed_costs.length > 0,
      has_spending_categories: !!data.spending_categories && Object.keys(data.spending_categories).length > 0
    })

    // Check both the flag AND that essential data exists
    const isComplete = data.is_complete && 
                      data.monthly_budget && 
                      data.currency &&
                      Array.isArray(data.fixed_costs) &&
                      data.spending_categories

    console.log(`✅ Supabase: Onboarding complete: ${isComplete}`)
    return isComplete || false
  }

  /**
   * Clear onboarding data
   */
  async clearOnboardingData(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return
    }

    const { error } = await supabase
      .from('onboarding_data')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to clear onboarding data: ${error.message}`)
    }

    console.log('✅ Supabase: Onboarding data cleared')
  }

  /**
   * Calculate personalized safe to spend
   */
  calculatePersonalizedSafeToSpend(data: OnboardingData): PersonalizedSafeToSpend {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Calculate days left in current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const currentDay = now.getDate()
    const daysLeftInMonth = Math.max(1, lastDayOfMonth - currentDay + 1)

    // Calculate total fixed costs
    const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)
    
    // Available for spending (after fixed costs)
    const availableForSpending = data.monthlyBudget - totalFixedCosts
    
    // Daily safe amount based on remaining days
    const dailySafeAmount = Math.max(0, availableForSpending / daysLeftInMonth)

    return {
      totalBudget: data.monthlyBudget,
      totalFixedCosts,
      availableForSpending: Math.max(0, availableForSpending),
      dailySafeAmount,
      currency: data.currency,
      daysLeftInMonth,
      isPersonalized: true
    }
  }

  /**
   * Get currency symbol from currency code
   */
  getCurrencySymbol(currency: string): string {
    const currencyMap: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF ',
      'CNY': '¥',
      'INR': '₹'
    }

    return currencyMap[currency] || currency + ' '
  }

  /**
   * Get personalized welcome message
   */
  getWelcomeMessage(data: OnboardingData): string {
    const currencySymbol = this.getCurrencySymbol(data.currency)
    const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)
    const availableForSpending = data.monthlyBudget - totalFixedCosts
    
    if (data.hasMealPlan) {
      return `Welcome back! Your ${currencySymbol}${data.monthlyBudget} budget with meal plan gives you ${currencySymbol}${availableForSpending.toFixed(0)} for fun stuff!`
    } else {
      return `Welcome back! You've got ${currencySymbol}${availableForSpending.toFixed(0)} available from your ${currencySymbol}${data.monthlyBudget} monthly budget!`
    }
  }

  /**
   * Get personalized insights
   */
  getPersonalizedInsights(data: OnboardingData): string[] {
    const insights: string[] = []
    const currencySymbol = this.getCurrencySymbol(data.currency)
    
    // Meal plan insight
    if (data.hasMealPlan) {
      const mealPlanCost = data.fixedCosts.find(cost => 
        cost.name.toLowerCase().includes('meal') || cost.category === 'food'
      )
      if (mealPlanCost) {
        insights.push(`Your ${currencySymbol}${mealPlanCost.amount} meal plan is saving you money on food!`)
      } else {
        insights.push(`Your meal plan helps keep food costs predictable!`)
      }
    }

    // Budget level insight
    if (data.monthlyBudget <= 1000) {
      insights.push(`Managing on a tight budget? You're building great financial habits!`)
    } else if (data.monthlyBudget >= 1500) {
      insights.push(`With your flexible budget, you have room for both needs and wants!`)
    } else {
      insights.push(`Your balanced budget gives you comfort and flexibility!`)
    }

    // Spending category insights
    const categories = data.spendingCategories
    const entertainmentBudget = categories['Entertainment'] || categories['entertainment'] || 0
    if (entertainmentBudget > 0) {
      insights.push(`${currencySymbol}${entertainmentBudget} for entertainment - perfect for student life!`)
    }

    return insights.slice(0, 3)
  }
}
