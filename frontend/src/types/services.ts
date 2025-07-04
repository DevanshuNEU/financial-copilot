// Common interfaces for Financial Service - ensures consistency between local and Supabase
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

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  // Add user_metadata for Supabase compatibility
  user_metadata?: {
    first_name?: string
    last_name?: string
    firstName?: string
    lastName?: string
  }
}

// Financial Service Interface - both local and Supabase must implement this
export interface IFinancialService {
  // Onboarding Data Management
  saveOnboardingData(data: OnboardingData): Promise<void>
  loadOnboardingData(): Promise<OnboardingData | null>
  hasCompletedOnboarding(): Promise<boolean>
  clearOnboardingData(): Promise<void>

  // Calculations
  calculatePersonalizedSafeToSpend(data: OnboardingData): PersonalizedSafeToSpend
  getCurrencySymbol(currency: string): string
  getWelcomeMessage(data: OnboardingData): string
  getPersonalizedInsights(data: OnboardingData): string[]
}

// Auth Service Interface - both local and Supabase must implement this
export interface IAuthService {
  // User state
  user: User | null
  loading: boolean
  isAuthenticated: boolean

  // Authentication methods
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): User | null
  
  // Legacy method aliases for compatibility
  login(email: string, password: string): Promise<void>
  register(email: string, password: string, firstName?: string, lastName?: string): Promise<void>
  logout(): Promise<void>
}

// Database configuration types
export type DatabaseMode = 'local' | 'supabase'

export interface DatabaseConfig {
  mode: DatabaseMode
  supabase?: {
    url: string
    anonKey: string
  }
}
