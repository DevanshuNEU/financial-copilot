/**
 * EXPENSESINK Shared Types
 * ========================
 * Centralized type definitions for all Edge Functions
 */

// Database Enums (must match PostgreSQL enums)
export enum ExpenseCategory {
  MEALS = 'meals',
  TRAVEL = 'travel',
  OFFICE = 'office',
  SOFTWARE = 'software',
  MARKETING = 'marketing',
  UTILITIES = 'utilities',
  EQUIPMENT = 'equipment',
  SERVICES = 'services',
  OTHER = 'other'
}

export enum ExpenseStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REIMBURSED = 'reimbursed'
}

// Database Models
export interface Expense {
  id: string
  user_id: string
  amount: number
  category: ExpenseCategory
  vendor: string
  description: string
  status: ExpenseStatus
  receipt_url?: string
  ai_confidence?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: ExpenseCategory
  monthly_limit: number
  alert_threshold: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIInsight {
  id: string
  user_id: string
  expense_id?: string
  insight_type: string
  content: string
  confidence: number
  is_actionable: boolean
  action_taken: boolean
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  metadata?: ResponseMetadata
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ResponseMetadata {
  timestamp: string
  version: string
  request_id?: string
}

// Request Types
export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface DateRangeParams {
  start_date?: string
  end_date?: string
}

export interface ExpenseFilters extends PaginationParams, DateRangeParams {
  category?: ExpenseCategory
  status?: ExpenseStatus
  min_amount?: number
  max_amount?: number
  search?: string
}

// Analytics Types
export interface DashboardMetrics {
  total_spent: number
  monthly_average: number
  top_categories: CategorySpending[]
  recent_expenses: Expense[]
  spending_trend: SpendingTrend[]
  budget_status: BudgetStatus[]
}

export interface CategorySpending {
  category: ExpenseCategory
  amount: number
  percentage: number
  count: number
}

export interface SpendingTrend {
  date: string
  amount: number
  count: number
}

export interface BudgetStatus {
  category: ExpenseCategory
  spent: number
  limit: number
  percentage: number
  remaining: number
  status: 'under' | 'warning' | 'over'
}

export interface WeeklyComparison {
  current_week: WeekAnalytics
  previous_week: WeekAnalytics
  percentage_change: number
  trend: 'up' | 'down' | 'stable'
  insights: string[]
}

export interface WeekAnalytics {
  total_amount: number
  expense_count: number
  daily_breakdown: DailySpending[]
  category_breakdown: CategorySpending[]
  average_per_day: number
}

export interface DailySpending {
  date: string
  day_of_week: string
  amount: number
  count: number
}

// Validation Types
export interface ValidationResult {
  is_valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}
