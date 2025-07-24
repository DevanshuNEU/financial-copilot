/**
 * EXPENSESINK Validation Module
 * =============================
 * Comprehensive validation for all Edge Functions
 */

import { 
  ExpenseCategory, 
  ExpenseStatus, 
  ValidationResult, 
  ValidationError 
} from './types.ts'

/**
 * Expense validation rules
 */
export const ExpenseValidation = {
  amount: {
    min: 0.01,
    max: 1000000,
  },
  vendor: {
    minLength: 1,
    maxLength: 100,
  },
  description: {
    minLength: 1,
    maxLength: 500,
  },
  notes: {
    maxLength: 1000,
  },
}

/**
 * Validate expense data
 */
export function validateExpense(data: any): ValidationResult {
  const errors: ValidationError[] = []
  
  // Validate amount
  if (!data.amount) {
    errors.push({
      field: 'amount',
      message: 'Amount is required',
      code: 'REQUIRED',
    })
  } else if (typeof data.amount !== 'number' || isNaN(data.amount)) {
    errors.push({
      field: 'amount',
      message: 'Amount must be a number',
      code: 'INVALID_TYPE',
    })
  } else if (data.amount < ExpenseValidation.amount.min) {
    errors.push({
      field: 'amount',
      message: `Amount must be at least ${ExpenseValidation.amount.min}`,
      code: 'MIN_VALUE',
    })
  } else if (data.amount > ExpenseValidation.amount.max) {
    errors.push({
      field: 'amount',
      message: `Amount cannot exceed ${ExpenseValidation.amount.max}`,
      code: 'MAX_VALUE',
    })
  }
  
  // Validate category
  if (!data.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      code: 'REQUIRED',
    })
  } else if (!Object.values(ExpenseCategory).includes(data.category)) {
    errors.push({
      field: 'category',
      message: 'Invalid category',
      code: 'INVALID_ENUM',
    })
  }
  
  // Validate vendor
  if (!data.vendor) {
    errors.push({
      field: 'vendor',
      message: 'Vendor is required',
      code: 'REQUIRED',
    })
  } else if (typeof data.vendor !== 'string') {
    errors.push({
      field: 'vendor',
      message: 'Vendor must be a string',
      code: 'INVALID_TYPE',
    })
  } else if (data.vendor.length < ExpenseValidation.vendor.minLength) {
    errors.push({
      field: 'vendor',
      message: 'Vendor name is too short',
      code: 'MIN_LENGTH',
    })
  } else if (data.vendor.length > ExpenseValidation.vendor.maxLength) {
    errors.push({
      field: 'vendor',
      message: `Vendor name cannot exceed ${ExpenseValidation.vendor.maxLength} characters`,
      code: 'MAX_LENGTH',
    })
  }
  
  // Validate description
  if (!data.description) {
    errors.push({
      field: 'description',
      message: 'Description is required',
      code: 'REQUIRED',
    })
  } else if (typeof data.description !== 'string') {
    errors.push({
      field: 'description',
      message: 'Description must be a string',
      code: 'INVALID_TYPE',
    })
  } else if (data.description.length < ExpenseValidation.description.minLength) {
    errors.push({
      field: 'description',
      message: 'Description is too short',
      code: 'MIN_LENGTH',
    })
  } else if (data.description.length > ExpenseValidation.description.maxLength) {
    errors.push({
      field: 'description',
      message: `Description cannot exceed ${ExpenseValidation.description.maxLength} characters`,
      code: 'MAX_LENGTH',
    })
  }
  
  // Validate status (optional)
  if (data.status && !Object.values(ExpenseStatus).includes(data.status)) {
    errors.push({
      field: 'status',
      message: 'Invalid status',
      code: 'INVALID_ENUM',
    })
  }
  
  // Validate notes (optional)
  if (data.notes && typeof data.notes === 'string' && 
      data.notes.length > ExpenseValidation.notes.maxLength) {
    errors.push({
      field: 'notes',
      message: `Notes cannot exceed ${ExpenseValidation.notes.maxLength} characters`,
      code: 'MAX_LENGTH',
    })
  }
  
  return {
    is_valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate budget data
 */
export function validateBudget(data: any): ValidationResult {
  const errors: ValidationError[] = []
  
  // Validate category
  if (!data.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      code: 'REQUIRED',
    })
  } else if (!Object.values(ExpenseCategory).includes(data.category)) {
    errors.push({
      field: 'category',
      message: 'Invalid category',
      code: 'INVALID_ENUM',
    })
  }
  
  // Validate monthly_limit
  if (!data.monthly_limit) {
    errors.push({
      field: 'monthly_limit',
      message: 'Monthly limit is required',
      code: 'REQUIRED',
    })
  } else if (typeof data.monthly_limit !== 'number' || data.monthly_limit <= 0) {
    errors.push({
      field: 'monthly_limit',
      message: 'Monthly limit must be a positive number',
      code: 'INVALID_VALUE',
    })
  }
  
  // Validate alert_threshold
  if (data.alert_threshold !== undefined) {
    if (typeof data.alert_threshold !== 'number') {
      errors.push({
        field: 'alert_threshold',
        message: 'Alert threshold must be a number',
        code: 'INVALID_TYPE',
      })
    } else if (data.alert_threshold < 0 || data.alert_threshold > 100) {
      errors.push({
        field: 'alert_threshold',
        message: 'Alert threshold must be between 0 and 100',
        code: 'INVALID_RANGE',
      })
    }
  }
  
  return {
    is_valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

/**
 * Validate UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validate date string
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}
