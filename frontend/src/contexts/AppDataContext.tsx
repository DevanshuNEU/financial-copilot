// Global App Data Context - Unified state management for EXPENSESINK
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { useError } from './ErrorContext'
import { financialService } from '../services/financialService'
import { apiService } from '../services/api'  // Import our hybrid API service
import { toast } from 'react-hot-toast'
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
  const { addError, handleNetworkError, scheduleRetry } = useError()
  
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

  const loadUserExpenses = useCallback(async (): Promise<UserExpense[]> => {
    try {
      console.log('🔥 AppDataContext: Loading expenses from API...')
      
      // Use our API service directly (will route to Edge Functions or Flask based on config)
      const response = await apiService.getExpenses()
      console.log('✅ AppDataContext: API response received:', response)
      
      // Handle different response formats
      let expenses: any[] = []
      if (Array.isArray(response)) {
        expenses = response
      } else if (response.expenses && Array.isArray(response.expenses)) {
        expenses = response.expenses
      } else {
        console.warn('⚠️ AppDataContext: Unexpected API response format:', response)
        expenses = []
      }

      // Convert API expenses to UserExpense format
      const userExpenses: UserExpense[] = expenses.map((expense: any) => ({
        id: expense.id?.toString() || String(Math.random()),
        amount: parseFloat(expense.amount) || 0,
        description: expense.description || 'No description',
        category: expense.category || 'other',
        vendor: expense.vendor || '',
        date: expense.created_at ? new Date(expense.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: expense.status || 'pending',
        createdAt: expense.created_at || new Date().toISOString()
      }))

      console.log('✅ AppDataContext: Converted user expenses:', userExpenses.length, userExpenses)
      return userExpenses
    } catch (error) {
      console.error('❌ AppDataContext: Failed to load expenses from API:', error)
      
      // Fallback to localStorage if API fails
      try {
        const stored = localStorage.getItem(`financial_copilot_expenses_${authUser?.id}`)
        if (stored) {
          const expenses = JSON.parse(stored)
          console.log('📦 AppDataContext: Fallback to localStorage expenses:', expenses)
          return Array.isArray(expenses) ? expenses : []
        }
      } catch (storageError) {
        console.error('❌ AppDataContext: Fallback localStorage also failed:', storageError)
      }
      
      return []
    }
  }, [authUser?.id])

  const refreshAppData = useCallback(async (): Promise<void> => {
    if (!authUser) return

    setAppData(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('🚀 AppDataContext: Loading comprehensive dashboard data from Edge Functions')
      
      // PROPER ARCHITECTURE: Single API call for all dashboard data
      // All calculations happen server-side with proper business logic
      const dashboardData = await apiService.getDashboardData()
      
      console.log('✅ AppDataContext: Dashboard API response:', dashboardData)
      
      // Extract data from comprehensive API response
      const allExpenses = dashboardData.recentActivity || []
      
      // Convert API response to proper UserExpense format
      const userExpenses: UserExpense[] = allExpenses.map((expense: any) => ({
        id: String(expense.id), // Ensure ID is string
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        vendor: expense.vendor || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: expense.status || 'pending',
        createdAt: expense.date || new Date().toISOString()
      }))
      
      const totalSpent = dashboardData.totalUserExpenses || 0
      
      // Create proper safe-to-spend data structure from server calculations
      const safeToSpend: ExtendedSafeToSpendData = {
        totalBudget: dashboardData.totalBudget,
        totalFixedCosts: dashboardData.totalFixedCosts,
        availableForSpending: dashboardData.availableAmount,
        availableAmount: dashboardData.availableAmount,
        dailySafeAmount: dashboardData.dailySafeAmount,
        currency: dashboardData.currency,
        daysLeftInMonth: dashboardData.daysLeftInMonth,
        isPersonalized: true,
        // Missing properties required by ExtendedSafeToSpendData interface
        totalSpent: dashboardData.totalSpent,
        dailySpendingGuide: dashboardData.dailySafeAmount // Same as dailySafeAmount
      }
      
      // Create user profile from server data
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        studentType: 'international',
        preferences: {
          currency: dashboardData.currency,
          notifications: {
            budgetWarnings: true,
            dailySummaries: false,
            weeklyReports: false
          }
        }
      }

      // Create budget categories (simplified for now)
      const budgetCategories: UserBudgetCategory[] = []

      setAppData(prev => ({
        ...prev,
        user: userProfile,
        onboardingData: dashboardData.userProfile,
        safeToSpendData: safeToSpend,
        expenses: userExpenses,
        budgetCategories,
        totalSpent,
        loading: false,
        error: null,
        lastSyncAt: new Date().toISOString()
      }))

      console.log('✅ AppDataContext: Successfully loaded data from comprehensive Dashboard API')

    } catch (error) {
      console.error('❌ AppDataContext: Failed to load dashboard data:', error)
      
      if (error instanceof Error) {
        handleNetworkError(error, { 
          component: 'AppDataContext',
          action: 'refreshAppData',
          userId: authUser?.id 
        })
      }
      
      setAppData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }))
    }
  }, [authUser, handleNetworkError])

  const saveUserExpenses = useCallback((expenses: UserExpense[]): void => {
    try {
      localStorage.setItem(`financial_copilot_expenses_${authUser?.id}`, JSON.stringify(expenses))
    } catch (error) {
      console.error('Failed to save expenses:', error)
    }
  }, [authUser?.id])

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

  const addExpense = useCallback(async (expenseData: Omit<UserExpense, 'id' | 'createdAt'>): Promise<void> => {
    if (!authUser) {
      addError({
        type: 'authentication',
        message: 'User not authenticated',
        resolved: false,
        retryable: false,
        context: { component: 'AppDataContext', action: 'addExpense' }
      })
      throw new Error('User not authenticated')
    }

    try {
      const newExpense: UserExpense = {
        ...expenseData,
        id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      }

      // Only save user expenses, not fixed costs
      const userExpenses = appData.expenses.filter(expense => !String(expense.id).startsWith('fixed_cost_'))
      const updatedUserExpenses = [...userExpenses, newExpense]
      saveUserExpenses(updatedUserExpenses)

      // Recalculate everything
      await refreshAppData()
      
      toast.success('Expense added successfully')
    } catch (error) {
      console.error('❌ Failed to add expense:', error)
      
      if (error instanceof Error) {
        handleNetworkError(error, { 
          component: 'AppDataContext',
          action: 'addExpense',
          userId: authUser.id 
        })
      }
      
      throw error
    }
  }, [authUser, appData.expenses, saveUserExpenses, refreshAppData, addError, handleNetworkError])

  const updateExpense = useCallback(async (id: string, updates: Partial<UserExpense>): Promise<void> => {
    try {
      // Only save user expenses, not fixed costs
      if (String(id).startsWith('fixed_cost_')) {
        const error = new Error('Cannot update fixed cost expenses')
        addError({
          type: 'validation',
          message: 'Cannot update fixed cost expenses',
          resolved: false,
          retryable: false,
          context: { component: 'AppDataContext', action: 'updateExpense' }
        })
        throw error
      }

      const userExpenses = appData.expenses.filter(expense => !String(expense.id).startsWith('fixed_cost_'))
      const updatedUserExpenses = userExpenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
      
      saveUserExpenses(updatedUserExpenses)
      await refreshAppData()
      
      toast.success('Expense updated successfully')
    } catch (error) {
      console.error('❌ Failed to update expense:', error)
      
      if (error instanceof Error) {
        handleNetworkError(error, { 
          component: 'AppDataContext',
          action: 'updateExpense',
          userId: authUser?.id 
        })
      }
      
      throw error
    }
  }, [appData.expenses, saveUserExpenses, refreshAppData, addError, handleNetworkError, authUser?.id])

  const deleteExpense = useCallback(async (id: string): Promise<void> => {
    try {
      // Only delete user expenses, not fixed costs
      if (String(id).startsWith('fixed_cost_')) {
        const error = new Error('Cannot delete fixed cost expenses')
        addError({
          type: 'validation',
          message: 'Cannot delete fixed cost expenses',
          resolved: false,
          retryable: false,
          context: { component: 'AppDataContext', action: 'deleteExpense' }
        })
        throw error
      }

      const userExpenses = appData.expenses.filter(expense => !String(expense.id).startsWith('fixed_cost_'))
      const updatedUserExpenses = userExpenses.filter(expense => expense.id !== id)
      saveUserExpenses(updatedUserExpenses)
      await refreshAppData()
      
      toast.success('Expense deleted successfully')
    } catch (error) {
      console.error('❌ Failed to delete expense:', error)
      
      if (error instanceof Error) {
        handleNetworkError(error, { 
          component: 'AppDataContext',
          action: 'deleteExpense',
          userId: authUser?.id 
        })
      }
      
      throw error
    }
  }, [appData.expenses, saveUserExpenses, refreshAppData, addError, handleNetworkError, authUser?.id])

  const updateBudgetCategory = useCallback(async (category: string, newBudget: number): Promise<void> => {
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
  }, [appData.onboardingData, refreshAppData])

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>): Promise<void> => {
    if (!appData.user) return

    const updatedProfile = { ...appData.user, ...updates }
    
    // Save to localStorage (in production, this would go to database)
    localStorage.setItem(`financial_copilot_profile_${authUser?.id}`, JSON.stringify(updatedProfile))
    
    setAppData(prev => ({
      ...prev,
      user: updatedProfile
    }))
  }, [appData.user, authUser?.id])

  const value: AppDataContextType = useMemo(() => ({
    appData,
    refreshAppData,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudgetCategory,
    updateUserProfile
  }), [appData, refreshAppData, addExpense, updateExpense, deleteExpense, updateBudgetCategory, updateUserProfile]);

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