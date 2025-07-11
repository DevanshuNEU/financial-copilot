/**
 * Form Types with Comprehensive Validation
 */

import { CategoryName, Currency } from './domain';

// Re-define essential utility types locally to avoid import issues
type ValidationRule<T> = {
  required?: boolean;
  min?: T extends number ? number : T extends string ? number : never;
  max?: T extends number ? number : T extends string ? number : never;
  pattern?: T extends string ? RegExp : never;
  custom?: (value: T) => boolean | string;
};

type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
  validation?: ValidationRule<T>;
};

type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Form validation error types
export type ValidationError = {
  field: string;
  message: string;
  code: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

// Expense form types
export interface ExpenseFormData {
  amount: number;
  category: CategoryName;
  description: string;
  vendor?: string;
  date: string;
}

export type ExpenseFormState = FormState<ExpenseFormData>;

export interface ExpenseFormValidation {
  amount: ValidationRule<number>;
  category: ValidationRule<CategoryName>;
  description: ValidationRule<string>;
  vendor?: ValidationRule<string>;
  date: ValidationRule<string>;
}

// Budget form types
export interface BudgetFormData {
  category: CategoryName;
  monthlyLimit: number;
  currency: Currency;
  rolloverUnused: boolean;
}

export type BudgetFormState = FormState<BudgetFormData>;

// User profile form types
export interface UserProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  currency: Currency;
  timezone: string;
  studentType: 'international' | 'domestic';
  university?: string;
  graduationYear?: number;
  major?: string;
}

export type UserProfileFormState = FormState<UserProfileFormData>;

// Onboarding form types
export interface OnboardingFormData {
  monthlyBudget: number;
  currency: Currency;
  hasMealPlan: boolean;
  fixedCosts: Array<{
    name: string;
    amount: number;
    category: CategoryName;
  }>;
  spendingCategories: Record<CategoryName, number>;
}

export type OnboardingFormState = FormState<OnboardingFormData>;

// Authentication form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export type LoginFormState = FormState<LoginFormData>;
export type RegisterFormState = FormState<RegisterFormData>;

// Form validation functions
export const validateExpenseForm = (data: ExpenseFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Amount validation
  if (!data.amount || data.amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Amount must be greater than 0',
      code: 'AMOUNT_REQUIRED'
    });
  }
  
  if (data.amount > 999999) {
    errors.push({
      field: 'amount',
      message: 'Amount must be less than $999,999',
      code: 'AMOUNT_TOO_LARGE'
    });
  }

  // Category validation
  if (!data.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      code: 'CATEGORY_REQUIRED'
    });
  }

  // Description validation
  if (!data.description || data.description.trim().length < 3) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 3 characters',
      code: 'DESCRIPTION_TOO_SHORT'
    });
  }

  // Date validation
  if (!data.date || isNaN(Date.parse(data.date))) {
    errors.push({
      field: 'date',
      message: 'Valid date is required',
      code: 'INVALID_DATE'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBudgetForm = (data: BudgetFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Category validation
  if (!data.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      code: 'CATEGORY_REQUIRED'
    });
  }

  // Monthly limit validation
  if (!data.monthlyLimit || data.monthlyLimit <= 0) {
    errors.push({
      field: 'monthlyLimit',
      message: 'Monthly limit must be greater than 0',
      code: 'LIMIT_REQUIRED'
    });
  }

  if (data.monthlyLimit > 999999) {
    errors.push({
      field: 'monthlyLimit',
      message: 'Monthly limit must be less than $999,999',
      code: 'LIMIT_TOO_LARGE'
    });
  }

  // Currency validation
  if (!data.currency) {
    errors.push({
      field: 'currency',
      message: 'Currency is required',
      code: 'CURRENCY_REQUIRED'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserProfileForm = (data: UserProfileFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // First name validation
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters',
      code: 'FIRST_NAME_TOO_SHORT'
    });
  }

  // Last name validation
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters',
      code: 'LAST_NAME_TOO_SHORT'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({
      field: 'email',
      message: 'Valid email address is required',
      code: 'INVALID_EMAIL'
    });
  }

  // Currency validation
  if (!data.currency) {
    errors.push({
      field: 'currency',
      message: 'Currency is required',
      code: 'CURRENCY_REQUIRED'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLoginForm = (data: LoginFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({
      field: 'email',
      message: 'Valid email address is required',
      code: 'INVALID_EMAIL'
    });
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
      code: 'PASSWORD_TOO_SHORT'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRegisterForm = (data: RegisterFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // First name validation
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters',
      code: 'FIRST_NAME_TOO_SHORT'
    });
  }

  // Last name validation
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters',
      code: 'LAST_NAME_TOO_SHORT'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({
      field: 'email',
      message: 'Valid email address is required',
      code: 'INVALID_EMAIL'
    });
  }

  // Password validation
  if (!data.password || data.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters',
      code: 'PASSWORD_TOO_SHORT'
    });
  }

  // Password confirmation validation
  if (data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match',
      code: 'PASSWORDS_MISMATCH'
    });
  }

  // Terms acceptance validation
  if (!data.acceptTerms) {
    errors.push({
      field: 'acceptTerms',
      message: 'You must accept the terms and conditions',
      code: 'TERMS_REQUIRED'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
