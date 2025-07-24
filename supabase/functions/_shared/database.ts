/**
 * EXPENSESINK Database Helpers
 * ============================
 * Common database operations and queries
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  Expense, 
  ExpenseFilters, 
  CategorySpending,
  ExpenseCategory,
  ExpenseStatus 
} from './types.ts'
import { getPaginationParams } from './utils.ts'

/**
 * Get expenses with filters
 */
export async function getExpenses(
  supabase: SupabaseClient,
  filters: ExpenseFilters
): Promise<{ data: Expense[], count: number, error: any }> {
  const { limit, offset } = getPaginationParams(new URLSearchParams(
    Object.entries(filters).map(([k, v]) => [k, String(v)])
  ))
  
  let query = supabase
    .from('expenses')
    .select('*', { count: 'exact' })
  
  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters.min_amount !== undefined) {
    query = query.gte('amount', filters.min_amount)
  }
  
  if (filters.max_amount !== undefined) {
    query = query.lte('amount', filters.max_amount)
  }
  
  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date)
  }
  
  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date)
  }
  
  if (filters.search) {
    query = query.or(`vendor.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  // Apply sorting
  const sortBy = filters.sort_by || 'created_at'
  const sortOrder = filters.sort_order || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  
  // Apply pagination
  query = query.range(offset, offset + limit - 1)
  
  const { data, error, count } = await query
  
  return { 
    data: data || [], 
    count: count || 0, 
    error 
  }
}

/**
 * Get category spending breakdown
 */
export async function getCategorySpending(
  supabase: SupabaseClient,
  startDate?: Date,
  endDate?: Date
): Promise<CategorySpending[]> {
  let query = supabase
    .from('expenses')
    .select('category, amount')
  
  if (startDate) {
    query = query.gte('created_at', startDate.toISOString())
  }
  
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString())
  }
  
  const { data, error } = await query
  
  if (error || !data) return []
  
  // Aggregate by category
  const categoryMap = new Map<ExpenseCategory, { amount: number, count: number }>()
  let totalAmount = 0
  
  for (const expense of data) {
    const current = categoryMap.get(expense.category) || { amount: 0, count: 0 }
    current.amount += parseFloat(expense.amount)
    current.count += 1
    categoryMap.set(expense.category, current)
    totalAmount += parseFloat(expense.amount)
  }
  
  // Convert to array with percentages
  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    amount: Math.round(stats.amount * 100) / 100,
    percentage: totalAmount > 0 ? Math.round((stats.amount / totalAmount) * 100) : 0,
    count: stats.count,
  })).sort((a, b) => b.amount - a.amount)
}

/**
 * Get monthly spending total
 */
export async function getMonthlySpending(
  supabase: SupabaseClient,
  year: number,
  month: number
): Promise<number> {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)
  
  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
  
  if (error || !data) return 0
  
  return data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
}

/**
 * Get user's budget for a category
 */
export async function getCategoryBudget(
  supabase: SupabaseClient,
  userId: string,
  category: ExpenseCategory
): Promise<{ limit: number, alert_threshold: number } | null> {
  const { data, error } = await supabase
    .from('budgets')
    .select('monthly_limit, alert_threshold')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('is_active', true)
    .single()
  
  if (error || !data) return null
  
  return {
    limit: data.monthly_limit,
    alert_threshold: data.alert_threshold,
  }
}

/**
 * Calculate safe to spend amount
 */
export async function calculateSafeToSpend(
  supabase: SupabaseClient,
  userId: string
): Promise<{ amount: number, details: any }> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysInMonth = endOfMonth.getDate()
  const daysRemaining = endOfMonth.getDate() - now.getDate() + 1
  
  // Get monthly spending
  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', now.toISOString())
  
  const totalSpent = expenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0
  
  // Get total budget
  const { data: budgets } = await supabase
    .from('budgets')
    .select('monthly_limit')
    .eq('user_id', userId)
    .eq('is_active', true)
  
  const totalBudget = budgets?.reduce((sum, b) => sum + b.monthly_limit, 0) || 5000 // Default
  
  // Calculate
  const remainingBudget = totalBudget - totalSpent
  const dailyBudget = remainingBudget / daysRemaining
  
  return {
    amount: Math.max(0, dailyBudget),
    details: {
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining_budget: remainingBudget,
      days_remaining: daysRemaining,
      daily_budget: dailyBudget,
    }
  }
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  supabase: SupabaseClient,
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  details?: any
): Promise<void> {
  await supabase.from('audit_logs').insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    user_id: userId,
    details,
    created_at: new Date().toISOString(),
  })
}
