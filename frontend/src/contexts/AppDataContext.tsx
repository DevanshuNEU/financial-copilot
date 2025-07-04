// Global App Data Context - Unified state management for Financial Copilot
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { financialService } from '../services/financialService'
import type { OnboardingData, PersonalizedSafeToSpend } from '../types/services'

// Extended types for complete app state
export interface ExtendedSafeToSpendData extends PersonalizedSafeToSpend {
  totalSpent: number
  availableAmount: number
  dailySpendingGuide: number
}

export interface UserExpense {
  id: string
  amount: number
  description: string
  category: string
  vendor?: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface UserBudgetCategory {
  name: string
  budgeted: number
  spent: number
  remaining: number
  percentage: number
}

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  studentType: 'domestic' | 'international'
  university?: string
  preferences: {
    currency: string
    notifications: {
      budgetWarnings: boolean
      dailySummaries: boolean
      weeklyReports: boolean
    }
  }
}

export interface AppDataState {
  // User data
  user: UserProfile | null
  onboardingData: OnboardingData | null
  safeToSpendData: ExtendedSafeToSpendData | null
  
  // Financial data
  expenses: UserExpense[]
  budgetCategories: UserBudgetCategory[]
  totalSpent: number
  
  // State management
  loading: boolean
  error: string | null
  lastSyncAt: string | null
}

interface AppDataContextType {
  // State
  appData: AppDataState
  
  // Actions
  refreshAppData: () => Promise<void>
  addExpense: (expense: Omit<UserExpense, 'id' | 'createdAt'>) => Promise<void>
  updateExpense: (id: string, updates: Partial<UserExpense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  updateBudgetCategory: (category: string, newBudget: number) => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

interface AppDataProviderProps {
  children: ReactNode
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const { user: authUser, isAuthenticated } = useAuth()
  
  const [appData, setAppData] = useState<AppDataState>({
    user: null,
    onboardingData: null,
    safeToSpendData: null,
    expenses: [],
    budgetCategories: [],
    totalSpent: 0,
    loading: true,
    error: null,
    lastSyncAt: null
  })

  // Initialize app data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      refreshAppData()
    } else {
      // Clear data when user logs out
      setAppData(prev => ({
        ...prev,
        user: null,
        onboardingData: null,
        safeToSpendData: null,
        expenses: [],
        budgetCategories: [],
        totalSpent: 0,
        loading: false,
        lastSyncAt: null
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authUser])

  const refreshAppData = async (): Promise<void> => {
    if (!authUser) return

    setAppData(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Load onboarding data
      const onboarding = await financialService.loadOnboardingData()
      
      if (!onboarding) {
        setAppData(prev => ({
          ...prev,
          loading: false,
          error: 'No onboarding data found'
        }))
        return
      }

      // Calculate safe to spend data - with actual expenses considered
      const baseSafeToSpend = financialService.calculatePersonalizedSafeToSpend(onboarding)

      // Load expenses (from localStorage for now)
      const userExpenses = loadUserExpenses()

      // Add fixed costs as system expenses
      const fixedCostExpenses: UserExpense[] = onboarding.fixedCosts.map(cost => ({
        id: `fixed_cost_${cost.name.toLowerCase().replace(/\s+/g, '_')}`,
        amount: cost.amount,
        description: cost.name,
        category: 'Fixed Costs',
        vendor: 'Monthly Fixed Cost',
        date: new Date().toISOString().split('T')[0], // Today's date
        status: 'approved' as const,
        createdAt: new Date().toISOString()
      }))

      // Combine user expenses with fixed cost expenses
      const allExpenses = [...userExpenses, ...fixedCostExpenses]

      // Calculate total spending (only from user expenses, not fixed costs)
      const totalSpent = userExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      // Update safe to spend data with actual expenses
      const safeToSpend = {
        ...baseSafeToSpend,
        totalSpent,
        availableAmount: Math.max(0, baseSafeToSpend.availableForSpending - totalSpent),
        dailySpendingGuide: Math.max(0, (baseSafeToSpend.availableForSpending - totalSpent) / baseSafeToSpend.daysLeftInMonth)
      }

      // Calculate budget categories from onboarding data (use user expenses only)
      const budgetCategories = calculateBudgetCategories(onboarding, userExpenses)

      // Create user profile
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        studentType: 'international', // Default, should be customizable
        preferences: {
          currency: onboarding.currency,
          notifications: {
            budgetWarnings: true,
            dailySummaries: false,
            weeklyReports: false
          }
        }
      }

      setAppData(prev => ({
        ...prev,
        user: userProfile,
        onboardingData: onboarding,
        safeToSpendData: safeToSpend,
        expenses: allExpenses, // Show both user expenses and fixed costs
        budgetCategories,
        totalSpent,
        loading: false,
        error: null,
        lastSyncAt: new Date().toISOString()
      }))

      console.log('✅ AppData: Successfully loaded user data')

    } catch (error) {
      console.error('❌ AppData: Failed to load user data:', error)
      setAppData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }))
    }
  }

  const loadUserExpenses = (): UserExpense[] => {
    try {
      const stored = localStorage.getItem(`financial_copilot_expenses_${authUser?.id}`)
      if (!stored) return []

      const expenses = JSON.parse(stored)
      return Array.isArray(expenses) ? expenses : []
    } catch (error) {
      console.error('Failed to load expenses:', error)
      return []
    }
  }

  const saveUserExpenses = (expenses: UserExpense[]): void => {
    try {
      localStorage.setItem(`financial_copilot_expenses_${authUser?.id}`, JSON.stringify(expenses))
    } catch (error) {
      console.error('Failed to save expenses:', error)
    }
  }

  const calculateBudgetCategories = (onboarding: OnboardingData, expenses: UserExpense[]): UserBudgetCategory[] => {
    const categories: UserBudgetCategory[] = []

    // Add spending categories from onboarding
    Object.entries(onboarding.spendingCategories).forEach(([name, budgeted]) => {
      const spent = expenses
        .filter(expense => expense.category.toLowerCase() === name.toLowerCase())
        .reduce((sum, expense) => sum + expense.amount, 0)

      categories.push({
        name,
        budgeted,
        spent,
        remaining: Math.max(0, budgeted - spent),
        percentage: budgeted > 0 ? (spent / budgeted) * 100 : 0
      })
    })

    return categories
  }

  const addExpense = async (expenseData: Omit<UserExpense, 'id' | 'createdAt'>): Promise<void> => {
    if (!authUser) throw new Error('User not authenticated')

    const newExpense: UserExpense = {
      ...expenseData,
      id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    // Only save user expenses, not fixed costs
    const userExpenses = appData.expenses.filter(expense => !expense.id.startsWith('fixed_cost_'))
    const updatedUserExpenses = [...userExpenses, newExpense]
    saveUserExpenses(updatedUserExpenses)

    // Recalculate everything
    await refreshAppData()
  }

  const updateExpense = async (id: string, updates: Partial<UserExpense>): Promise<void> => {
    // Only update user expenses, not fixed costs
    if (id.startsWith('fixed_cost_')) {
      throw new Error('Cannot update fixed cost expenses')
    }

    const userExpenses = appData.expenses.filter(expense => !expense.id.startsWith('fixed_cost_'))
    const updatedUserExpenses = userExpenses.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    )
    
    saveUserExpenses(updatedUserExpenses)
    await refreshAppData()
  }

  const deleteExpense = async (id: string): Promise<void> => {
    // Only delete user expenses, not fixed costs
    if (id.startsWith('fixed_cost_')) {
      throw new Error('Cannot delete fixed cost expenses')
    }

    const userExpenses = appData.expenses.filter(expense => !expense.id.startsWith('fixed_cost_'))
    const updatedUserExpenses = userExpenses.filter(expense => expense.id !== id)
    saveUserExpenses(updatedUserExpenses)
    await refreshAppData()
  }

  const updateBudgetCategory = async (category: string, newBudget: number): Promise<void> => {
    if (!appData.onboardingData) return

    const updatedOnboarding = {
      ...appData.onboardingData,
      spendingCategories: {
        ...appData.onboardingData.spendingCategories,
        [category]: newBudget
      }
    }

    await financialService.saveOnboardingData(updatedOnboarding)
    await refreshAppData()
  }

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!appData.user) return

    const updatedProfile = { ...appData.user, ...updates }
    
    // Save to localStorage (in production, this would go to database)
    localStorage.setItem(`financial_copilot_profile_${authUser?.id}`, JSON.stringify(updatedProfile))
    
    setAppData(prev => ({
      ...prev,
      user: updatedProfile
    }))
  }

  const value: AppDataContextType = {
    appData,
    refreshAppData,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudgetCategory,
    updateUserProfile
  }

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }
  return context
}

export default AppDataProvider