/**
 * Enhanced Data Validation
 * Comprehensive validation for all user inputs
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Financial validation
export const validateAmount = (amount: number): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (isNaN(amount)) {
    errors.push('Amount must be a valid number');
  } else if (amount < 0) {
    errors.push('Amount cannot be negative');
  } else if (amount > 999999) {
    errors.push('Amount cannot exceed $999,999');
  } else if (amount > 10000) {
    warnings.push('Large amount detected. Please verify.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Expense validation
export const validateExpense = (expense: {
  amount: number;
  description: string;
  category: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate amount
  const amountValidation = validateAmount(expense.amount);
  errors.push(...amountValidation.errors);
  warnings.push(...amountValidation.warnings);
  
  // Validate description
  if (!expense.description.trim()) {
    errors.push('Description is required');
  } else if (expense.description.length > 200) {
    errors.push('Description cannot exceed 200 characters');
  }
  
  // Validate category
  if (!expense.category.trim()) {
    errors.push('Category is required');
  } else if (expense.category.length > 50) {
    errors.push('Category name cannot exceed 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Budget validation
export const validateBudget = (budget: {
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'daily';
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate amount
  const amountValidation = validateAmount(budget.amount);
  errors.push(...amountValidation.errors);
  warnings.push(...amountValidation.warnings);
  
  // Validate category
  if (!budget.category.trim()) {
    errors.push('Budget category is required');
  }
  
  // Validate period-specific amounts
  if (budget.period === 'daily' && budget.amount > 1000) {
    warnings.push('Daily budget seems high. Please verify.');
  } else if (budget.period === 'weekly' && budget.amount > 5000) {
    warnings.push('Weekly budget seems high. Please verify.');
  } else if (budget.period === 'monthly' && budget.amount > 20000) {
    warnings.push('Monthly budget seems high. Please verify.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// User profile validation
export const validateProfile = (profile: {
  firstName?: string;
  lastName?: string;
  email: string;
  studentType?: 'domestic' | 'international';
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate names
  if (profile.firstName && profile.firstName.length > 50) {
    errors.push('First name cannot exceed 50 characters');
  }
  
  if (profile.lastName && profile.lastName.length > 50) {
    errors.push('Last name cannot exceed 50 characters');
  }
  
  // Name pattern validation
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (profile.firstName && !nameRegex.test(profile.firstName)) {
    errors.push('First name contains invalid characters');
  }
  
  if (profile.lastName && !nameRegex.test(profile.lastName)) {
    errors.push('Last name contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    warnings.push('Consider adding special characters for stronger security');
  }
  
  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Generic field validation
export const validateField = (
  value: any,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  }
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
    return { isValid: false, errors, warnings };
  }
  
  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: true, errors, warnings };
  }
  
  const stringValue = value.toString();
  
  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }
  
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }
  
  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push('Invalid format');
  }
  
  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export default {
  validateAmount,
  validateExpense,
  validateBudget,
  validateProfile,
  validatePassword,
  validateField
};