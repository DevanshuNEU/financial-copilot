// Supabase client configuration for Financial Copilot
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://snztuyjjxladtqkaestf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuenR1eWpqeGxhZHRxa2Flc3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDIzMTQsImV4cCI6MjA2NjMxODMxNH0.7_yRQfsPVAB65nxOfzKoHD42ZEK3wp2qdpw6FuvRsos'

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
