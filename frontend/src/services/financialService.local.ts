// Local Storage Financial Service Implementation
import type { IFinancialService, OnboardingData, PersonalizedSafeToSpend } from '../types/services'

export class LocalFinancialService implements IFinancialService {
  private readonly ONBOARDING_KEY = 'financial_copilot_onboarding'

  /**
   * Save onboarding data to localStorage
   */
  async saveOnboardingData(data: OnboardingData): Promise<void> {
    try {
      const dataWithTimestamp = {
        ...data,
        completed_at: new Date().toISOString(),
        is_complete: true
      }
      
      localStorage.setItem(this.ONBOARDING_KEY, JSON.stringify(dataWithTimestamp))
      console.log('✅ Local: Onboarding data saved successfully')
    } catch (error) {
      console.error('❌ Local: Failed to save onboarding data:', error)
      throw new Error('Failed to save onboarding data locally')
    }
  }

  /**
   * Load onboarding data from localStorage
   */
  async loadOnboardingData(): Promise<OnboardingData | null> {
    try {
      const stored = localStorage.getItem(this.ONBOARDING_KEY)
      if (!stored) {
        console.log('❌ Local: No onboarding data found')
        return null
      }

      const data = JSON.parse(stored)
      console.log('✅ Local: Onboarding data loaded successfully')
      
      return {
        monthlyBudget: Number(data.monthlyBudget),
        currency: data.currency,
        hasMealPlan: Boolean(data.hasMealPlan),
        fixedCosts: Array.isArray(data.fixedCosts) ? data.fixedCosts : [],
        spendingCategories: data.spendingCategories || {}
      }
    } catch (error) {
      console.error('❌ Local: Failed to load onboarding data:', error)
      return null
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const stored = localStorage.getItem(this.ONBOARDING_KEY)
      if (!stored) return false

      const data = JSON.parse(stored)
      const hasData = data.is_complete && 
                    data.monthlyBudget && 
                    data.currency

      console.log(`🔍 Local: Onboarding complete: ${hasData}`)
      return hasData
    } catch (error) {
      console.error('❌ Local: Failed to check onboarding status:', error)
      return false
    }
  }

  /**
   * Clear onboarding data
   */
  async clearOnboardingData(): Promise<void> {
    try {
      localStorage.removeItem(this.ONBOARDING_KEY)
      console.log('✅ Local: Onboarding data cleared')
    } catch (error) {
      console.error('❌ Local: Failed to clear onboarding data:', error)
      throw new Error('Failed to clear onboarding data')
    }
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
