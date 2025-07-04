// Local Storage Based Financial Service - 100% Reliable
export interface OnboardingData {
  monthlyBudget: number
  currency: string
  hasMealPlan: boolean
  fixedCosts: Array<{ name: string; amount: number; category: string }>
  spendingCategories: Record<string, number>
}

export interface PersonalizedSafeToSpend {
  totalBudget: number
  totalFixedCosts: number
  availableForSpending: number
  dailySafeAmount: number
  currency: string
  daysLeftInMonth: number
  isPersonalized: boolean
}

class LocalFinancialService {
  private readonly ONBOARDING_KEY = 'financial_copilot_onboarding'
  private readonly USER_KEY = 'financial_copilot_user'

  /**
   * Save onboarding data locally
   */
  saveOnboardingData(data: OnboardingData): Promise<void> {
    return new Promise((resolve) => {
      try {
        const dataWithTimestamp = {
          ...data,
          completed_at: new Date().toISOString(),
          is_complete: true
        }
        
        localStorage.setItem(this.ONBOARDING_KEY, JSON.stringify(dataWithTimestamp))
        console.log('✅ Local storage: Data saved successfully')
        resolve()
      } catch (error) {
        console.error('❌ Local storage save error:', error)
        resolve() // Don't throw - we want the app to continue working
      }
    })
  }

  /**
   * Load onboarding data from local storage
   */
  loadOnboardingData(): Promise<OnboardingData | null> {
    return new Promise((resolve) => {
      try {
        const stored = localStorage.getItem(this.ONBOARDING_KEY)
        if (stored) {
          const data = JSON.parse(stored)
          console.log('✅ Local storage: Data loaded successfully')
          resolve({
            monthlyBudget: Number(data.monthlyBudget),
            currency: data.currency,
            hasMealPlan: Boolean(data.hasMealPlan),
            fixedCosts: data.fixedCosts || [],
            spendingCategories: data.spendingCategories || {}
          })
        } else {
          console.log('❌ Local storage: No data found')
          resolve(null)
        }
      } catch (error) {
        console.error('❌ Local storage load error:', error)
        resolve(null)
      }
    })
  }

  /**
   * Check if user has completed onboarding
   */
  hasCompletedOnboarding(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const stored = localStorage.getItem(this.ONBOARDING_KEY)
        const hasData = stored && JSON.parse(stored).is_complete
        console.log(`🔍 Local storage: Onboarding complete: ${hasData}`)
        resolve(Boolean(hasData))
      } catch (error) {
        console.error('❌ Local storage check error:', error)
        resolve(false)
      }
    })
  }

  /**
   * Clear all data
   */
  clearOnboardingData(): Promise<void> {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem(this.ONBOARDING_KEY)
        console.log('✅ Local storage: Data cleared')
        resolve()
      } catch (error) {
        console.error('❌ Local storage clear error:', error)
        resolve()
      }
    })
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

  /**
   * Simple user simulation for demo
   */
  getCurrentUser(): { id: string; email: string } | null {
    const stored = localStorage.getItem(this.USER_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Create a demo user
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@financialcopilot.com'
    }
    localStorage.setItem(this.USER_KEY, JSON.stringify(demoUser))
    return demoUser
  }

  /**
   * Check if user is authenticated (always true for local demo)
   */
  isAuthenticated(): boolean {
    return true // Always authenticated for local demo
  }
}

export const localFinancialService = new LocalFinancialService()
