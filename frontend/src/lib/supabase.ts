// Supabase client configuration for EXPENSESINK
import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please check your .env file has REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Profile {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

export interface OnboardingData {
  id: string
  user_id: string
  monthly_budget: number
  currency: string
  has_meal_plan: boolean
  fixed_costs: Array<{ name: string; amount: number; category: string }>
  spending_categories: Record<string, number>
  is_complete: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  description?: string
  vendor?: string
  expense_date: string
  created_at: string
  updated_at: string
}
