// Supabase client configuration for Financial Copilot
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xitnatzzojgzmtpagxpe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdG5hdHp6b2pnem10cGFneHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjU5NjUsImV4cCI6MjA2NzAwMTk2NX0.jVVRwpOv3K734lYFgitCQYEReY__EaGo1A5MMVJA9v8'

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
