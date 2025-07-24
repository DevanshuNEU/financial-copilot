// Flask API Financial Service Implementation
// This service calls our Flask backend (which uses Supabase PostgreSQL)
import type { IFinancialService, OnboardingData, PersonalizedSafeToSpend } from '../types/services'
import { apiService } from './api'

export class ApiFinancialService implements IFinancialService {
  /**
   * Save onboarding data via hybrid API (Edge Functions)
   */
  async saveOnboardingData(data: OnboardingData): Promise<void> {
    console.log('🚀 Hybrid API: Starting saveOnboardingData with:', data)
    
    try {
      await apiService.saveOnboardingData(data)
      console.log('✅ Hybrid API: Onboarding data saved to Supabase via Edge Functions')
    } catch (error) {
      console.error('❌ Hybrid API: Save error:', error)
      throw new Error(`Failed to save onboarding data: ${error}`)
    }
  }

  /**
   * Load onboarding data via hybrid API (Edge Functions)
   */
  async loadOnboardingData(): Promise<OnboardingData | null> {
    console.log('📖 Hybrid API: Loading onboarding data via Edge Functions')
    
    try {
      const data = await apiService.getOnboardingData()
      
      if (!data) {
        console.log('📭 Hybrid API: No onboarding data found')
        return null
      }

      console.log('✅ Hybrid API: Onboarding data loaded:', data)
      return data
    } catch (error) {
      console.error('❌ Hybrid API: Load error:', error)
      return null
    }
  }

  /**
   * Check if onboarding is complete (alias for compatibility)
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    return this.isOnboardingComplete()
  }

  /**
   * Check if onboarding is complete
   */
  async isOnboardingComplete(): Promise<boolean> {
    const data = await this.loadOnboardingData()
    const complete = data !== null
    console.log(`🔍 Flask API: Onboarding complete: ${complete}`)
    return complete
  }

  /**
   * Clear onboarding data
   */
  async clearOnboardingData(): Promise<void> {
    console.log('🗑️ Flask API: Clearing onboarding data')
    localStorage.removeItem('onboarding_data')
    console.log('✅ Flask API: Onboarding data cleared')
  }

  /**
   * Calculate personalized safe to spend
   */
  calculatePersonalizedSafeToSpend(data: OnboardingData): PersonalizedSafeToSpend {
    console.log('🧮 Flask API: Calculating personalized safe to spend')
    
    const now = new Date()
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysLeftInMonth = Math.ceil((lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)
    const availableForSpending = data.monthlyBudget - totalFixedCosts
    const dailySafeAmount = Math.max(0, availableForSpending / daysLeftInMonth)
    
    const result = {
      totalBudget: data.monthlyBudget,
      totalFixedCosts,
      availableForSpending,
      dailySafeAmount,
      currency: data.currency,
      daysLeftInMonth,
      isPersonalized: true
    }
    
    console.log('✅ Flask API: Safe to spend calculated:', result)
    return result
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$'
    }
    return symbols[currency] || '$'
  }

  /**
   * Get welcome message
   */
  getWelcomeMessage(data: OnboardingData): string {
    const symbol = this.getCurrencySymbol(data.currency)
    return `Welcome! You have ${symbol}${data.monthlyBudget} to work with this month.`
  }

  /**
   * Get personalized insights
   */
  getPersonalizedInsights(data: OnboardingData): string[] {
    const insights: string[] = []
    const symbol = this.getCurrencySymbol(data.currency)
    
    const totalFixed = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)
    const available = data.monthlyBudget - totalFixed
    
    insights.push(`You have ${symbol}${available} available for discretionary spending`)
    
    if (data.hasMealPlan) {
      insights.push('Great! Having a meal plan helps keep food costs predictable')
    } else {
      insights.push('Consider tracking your food expenses carefully since you buy your own food')
    }
    
    if (totalFixed > data.monthlyBudget * 0.7) {
      insights.push('Your fixed costs are quite high - focus on variable expenses')
    }
    
    return insights
  }

  /**
   * Get dashboard data from Flask API
   */
  async getDashboardData(): Promise<any> {
    console.log('📊 Flask API: Getting dashboard data')
    
    try {
      const dashboardData = await apiService.getDashboardData()
      console.log('✅ Flask API: Dashboard data loaded:', dashboardData)
      return dashboardData
    } catch (error) {
      console.error('❌ Flask API: Dashboard error:', error)
      throw error
    }
  }

  /**
   * Get expenses from Flask API
   */
  async getExpenses(): Promise<any> {
    console.log('💰 Flask API: Getting expenses')
    
    try {
      const expenses = await apiService.getExpenses()
      console.log('✅ Flask API: Expenses loaded:', expenses)
      return expenses
    } catch (error) {
      console.error('❌ Flask API: Expenses error:', error)
      throw error
    }
  }

  /**
   * Create expense via Flask API
   */
  async createExpense(expense: any): Promise<any> {
    console.log('➕ Flask API: Creating expense:', expense)
    
    try {
      const created = await apiService.createExpense(expense)
      console.log('✅ Flask API: Expense created:', created)
      return created
    } catch (error) {
      console.error('❌ Flask API: Create expense error:', error)
      throw error
    }
  }

  /**
   * Update expense via Flask API
   */
  async updateExpense(id: number, expense: any): Promise<any> {
    console.log('✏️ Flask API: Updating expense:', id, expense)
    
    try {
      const updated = await apiService.updateExpense(id, expense)
      console.log('✅ Flask API: Expense updated:', updated)
      return updated
    } catch (error) {
      console.error('❌ Flask API: Update expense error:', error)
      throw error
    }
  }

  /**
   * Delete expense via Flask API
   */
  async deleteExpense(id: number): Promise<void> {
    console.log('🗑️ Flask API: Deleting expense:', id)
    
    try {
      await apiService.deleteExpense(id)
      console.log('✅ Flask API: Expense deleted')
    } catch (error) {
      console.error('❌ Flask API: Delete expense error:', error)
      throw error
    }
  }

  /**
   * Get safe to spend data from Flask API
   */
  async getSafeToSpend(): Promise<PersonalizedSafeToSpend> {
    console.log('💡 Flask API: Getting safe to spend')
    
    try {
      // Get onboarding data for calculations
      const onboardingData = await this.loadOnboardingData()
      if (!onboardingData) {
        throw new Error('Onboarding data not found')
      }
      
      // Use local calculation (for now)
      const result = this.calculatePersonalizedSafeToSpend(onboardingData)
      console.log('✅ Flask API: Safe to spend calculated:', result)
      return result
      
    } catch (error) {
      console.error('❌ Flask API: Safe to spend error:', error)
      throw error
    }
  }

  /**
   * Get budgets from Flask API
   */
  async getBudgets(): Promise<any> {
    console.log('💰 Flask API: Getting budgets')
    
    try {
      const budgets = await apiService.getBudgets()
      console.log('✅ Flask API: Budgets loaded:', budgets)
      return budgets
    } catch (error) {
      console.error('❌ Flask API: Budgets error:', error)
      throw error
    }
  }

  /**
   * Create or update budget via Flask API
   */
  async createOrUpdateBudget(category: string, monthlyLimit: number): Promise<any> {
    console.log('💰 Flask API: Creating/updating budget:', category, monthlyLimit)
    
    try {
      const budget = await apiService.createOrUpdateBudget(category, monthlyLimit)
      console.log('✅ Flask API: Budget saved:', budget)
      return budget
    } catch (error) {
      console.error('❌ Flask API: Budget save error:', error)
      throw error
    }
  }

  /**
   * Get weekly comparison data from Flask API
   */
  async getWeeklyComparison(): Promise<any> {
    console.log('📈 Flask API: Getting weekly comparison')
    
    try {
      const weeklyData = await apiService.getWeeklyComparison()
      console.log('✅ Flask API: Weekly comparison loaded:', weeklyData)
      return weeklyData
    } catch (error) {
      console.error('❌ Flask API: Weekly comparison error:', error)
      throw error
    }
  }
}
