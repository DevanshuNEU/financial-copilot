/**
 * Input Validation for EXPENSESINK Edge Functions
 * Simple validation without external dependencies
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validate expense creation input
 */
export function validateExpenseInput(data: any) {
  const errors: string[] = []

  if (!data.amount || typeof data.amount !== 'number') {
    errors.push('amount must be a positive number')
  } else if (data.amount <= 0) {
    errors.push('amount must be greater than 0')
  }

  if (!data.category || typeof data.category !== 'string') {
    errors.push('category is required')
  }

  if (!data.vendor || typeof data.vendor !== 'string') {
    errors.push('vendor is required')
  }

  if (data.status && !['pending', 'completed', 'cancelled'].includes(data.status)) {
    errors.push('status must be one of: pending, completed, cancelled')
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '))
  }

  return {
    amount: parseFloat(data.amount),
    category: data.category.trim(),
    vendor: data.vendor.trim(),
    description: data.description ? String(data.description).trim() : '',
    status: data.status || 'pending',
    expense_date: data.expense_date || new Date().toISOString().split('T')[0]
  }
}

/**
 * Validate expense update input
 */
export function validateExpenseUpdate(data: any) {
  const errors: string[] = []
  const updates: any = {}

  if (data.amount !== undefined) {
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('amount must be a positive number')
    } else {
      updates.amount = parseFloat(data.amount)
    }
  }

  if (data.category !== undefined) {
    if (typeof data.category !== 'string' || data.category.trim() === '') {
      errors.push('category cannot be empty')
    } else {
      updates.category = data.category.trim()
    }
  }

  if (data.vendor !== undefined) {
    if (typeof data.vendor !== 'string' || data.vendor.trim() === '') {
      errors.push('vendor cannot be empty')
    } else {
      updates.vendor = data.vendor.trim()
    }
  }

  if (data.description !== undefined) {
    updates.description = data.description ? String(data.description).trim() : ''
  }

  if (data.status !== undefined) {
    if (!['pending', 'completed', 'cancelled'].includes(data.status)) {
      errors.push('status must be one of: pending, completed, cancelled')
    } else {
      updates.status = data.status
    }
  }

  if (data.expense_date !== undefined) {
    updates.expense_date = data.expense_date
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '))
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid fields to update')
  }

  return updates
}

/**
 * Validate budget input
 */
export function validateBudgetInput(data: any) {
  const errors: string[] = []

  if (!data.category || typeof data.category !== 'string') {
    errors.push('category is required')
  }

  if (!data.monthly_limit || typeof data.monthly_limit !== 'number') {
    errors.push('monthly_limit must be a positive number')
  } else if (data.monthly_limit <= 0) {
    errors.push('monthly_limit must be greater than 0')
  }

  if (data.alert_threshold !== undefined) {
    if (typeof data.alert_threshold !== 'number' || data.alert_threshold < 0 || data.alert_threshold > 100) {
      errors.push('alert_threshold must be between 0 and 100')
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '))
  }

  return {
    category: data.category.trim(),
    monthly_limit: parseFloat(data.monthly_limit),
    alert_threshold: data.alert_threshold !== undefined ? parseFloat(data.alert_threshold) : 80.00,
    is_active: data.is_active !== undefined ? Boolean(data.is_active) : true
  }
}

/**
 * Validate onboarding input
 */
export function validateOnboardingInput(data: any) {
  const errors: string[] = []

  if (!data.monthly_budget || typeof data.monthly_budget !== 'number') {
    errors.push('monthly_budget must be a positive number')
  } else if (data.monthly_budget <= 0) {
    errors.push('monthly_budget must be greater than 0')
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '))
  }

  return {
    monthly_budget: parseFloat(data.monthly_budget),
    currency: data.currency || 'USD',
    has_meal_plan: Boolean(data.has_meal_plan),
    fixed_costs: Array.isArray(data.fixed_costs) ? data.fixed_costs : [],
    spending_categories: data.spending_categories || {},
    is_complete: true,
    completed_at: new Date().toISOString()
  }
}
