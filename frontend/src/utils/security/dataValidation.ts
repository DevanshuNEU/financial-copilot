/**
 * Enhanced Data Validation
 * Comprehensive validation rules for EXPENSESINK
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Financial data validation
export const validateExpenseData = (data: {
  amount: number;
  description: string;
  category: string;
  date: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Amount validation
  if (data.amount <= 0) {
    errors.push('Amount must be greater than zero');
  }
  if (data.amount > 10000) {
    warnings.push('Large amount detected - please verify');
  }

  // Description validation
  if (!data.description.trim()) {
    errors.push('Description is required');
  }
  if (data.description.length > 200) {
    errors.push('Description too long (max 200 characters)');
  }

  // Category validation
  const validCategories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Shopping', 'Other'];
  if (!validCategories.includes(data.category)) {
    errors.push('Invalid category');
  }

  // Date validation
  const expenseDate = new Date(data.date);
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  if (expenseDate > today) {
    errors.push('Expense date cannot be in the future');
  }
  if (expenseDate < oneYearAgo) {
    warnings.push('Expense date is more than a year old');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Budget validation
export const validateBudgetData = (data: {
  category: string;
  amount: number;
  period: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data.amount <= 0) {
    errors.push('Budget amount must be greater than zero');
  }
  if (data.amount > 50000) {
    warnings.push('Very high budget amount - please verify');
  }

  if (!data.category.trim()) {
    errors.push('Category is required');
  }

  const validPeriods = ['weekly', 'monthly', 'yearly'];
  if (!validPeriods.includes(data.period)) {
    errors.push('Invalid budget period');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// User profile validation
export const validateUserProfile = (data: {
  firstName: string;
  lastName: string;
  email: string;
  studentType: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Name validation
  if (!data.firstName.trim()) {
    errors.push('First name is required');
  }
  if (data.firstName.length > 50) {
    errors.push('First name too long');
  }

  if (!data.lastName.trim()) {
    errors.push('Last name is required');
  }
  if (data.lastName.length > 50) {
    errors.push('Last name too long');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Student type validation
  const validTypes = ['domestic', 'international'];
  if (!validTypes.includes(data.studentType)) {
    errors.push('Invalid student type');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Form validation helpers
export const validateRequired = (value: string, fieldName: string): string[] => {
  return value.trim() ? [] : [`${fieldName} is required`];
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string[] => {
  return value.length >= minLength ? [] : [`${fieldName} must be at least ${minLength} characters`];
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string[] => {
  return value.length <= maxLength ? [] : [`${fieldName} cannot exceed ${maxLength} characters`];
};

export const validateNumericRange = (value: number, min: number, max: number, fieldName: string): string[] => {
  const errors: string[] = [];
  if (value < min) errors.push(`${fieldName} must be at least ${min}`);
  if (value > max) errors.push(`${fieldName} cannot exceed ${max}`);
  return errors;
};

// Security validation
export const validateSecurityRules = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /expression\(/i
  ];

  const dataString = JSON.stringify(data);
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(dataString)) {
      errors.push('Suspicious content detected');
      break;
    }
  }

  // Check for excessive length
  if (dataString.length > 10000) {
    warnings.push('Large data payload detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Comprehensive validation function
export const validateFormData = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => ValidationResult>
): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field]);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  // Security check
  const securityResult = validateSecurityRules(data);
  allErrors.push(...securityResult.errors);
  allWarnings.push(...securityResult.warnings);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

export default {
  validateExpenseData,
  validateBudgetData,
  validateUserProfile,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumericRange,
  validateSecurityRules,
  validateFormData
};