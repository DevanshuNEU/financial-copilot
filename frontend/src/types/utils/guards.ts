/**
 * Type Guards for Runtime Type Checking
 */

import { User, Expense, Budget, CategoryName, Currency, ExpenseStatus } from '../domain';

// Utility function to check if value is defined
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

// Check if value is a string
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

// Check if value is a number
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

// Check if value is a boolean
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

// Check if value is an object
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Check if value is an array
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Check if value is a valid date string
export const isValidDate = (value: unknown): value is string => {
  return isString(value) && !isNaN(Date.parse(value));
};

// Check if value is a valid email
export const isValidEmail = (value: unknown): value is string => {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// Check if value is a valid currency
export const isValidCurrency = (value: unknown): value is Currency => {
  const validCurrencies: Currency[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'];
  return isString(value) && validCurrencies.includes(value as Currency);
};

// Check if value is a valid category
export const isValidCategory = (value: unknown): value is CategoryName => {
  const validCategories: CategoryName[] = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Shopping', 'Other'];
  return isString(value) && validCategories.includes(value as CategoryName);
};

// Check if value is a valid expense status
export const isValidExpenseStatus = (value: unknown): value is ExpenseStatus => {
  const validStatuses: ExpenseStatus[] = ['pending', 'approved', 'rejected'];
  return isString(value) && validStatuses.includes(value as ExpenseStatus);
};

// User type guard
export const isUser = (value: unknown): value is User => {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isValidEmail(value.email) &&
    isValidDate(value.createdAt) &&
    isValidDate(value.updatedAt) &&
    isObject(value.preferences) &&
    isObject(value.profile)
  );
};

// Expense type guard
export const isExpense = (value: unknown): value is Expense => {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isNumber(value.amount) &&
    value.amount > 0 &&
    isValidCategory(value.category) &&
    isString(value.description) &&
    isValidExpenseStatus(value.status) &&
    isValidDate(value.date) &&
    isValidDate(value.createdAt) &&
    isValidDate(value.updatedAt) &&
    isString(value.userId)
  );
};

// Budget type guard
export const isBudget = (value: unknown): value is Budget => {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isValidCategory(value.category) &&
    isNumber(value.monthlyLimit) &&
    value.monthlyLimit > 0 &&
    isValidCurrency(value.currency) &&
    isString(value.userId) &&
    isValidDate(value.createdAt) &&
    isValidDate(value.updatedAt) &&
    isBoolean(value.isActive)
  );
};

// Array type guards
export const isUserArray = (value: unknown): value is User[] => {
  return isArray(value) && value.every(isUser);
};

export const isExpenseArray = (value: unknown): value is Expense[] => {
  return isArray(value) && value.every(isExpense);
};

export const isBudgetArray = (value: unknown): value is Budget[] => {
  return isArray(value) && value.every(isBudget);
};

// API response validators
export const validateApiResponse = <T>(
  data: unknown,
  validator: (value: unknown) => value is T
): T => {
  if (!validator(data)) {
    throw new Error('Invalid API response format');
  }
  return data;
};

// Partial object validator
export const validatePartialObject = <T>(
  data: unknown,
  requiredFields: (keyof T)[],
  fieldValidators: Partial<Record<keyof T, (value: unknown) => boolean>>
): data is Partial<T> => {
  if (!isObject(data)) return false;
  
  // Check required fields
  for (const field of requiredFields) {
    if (!(field in data)) return false;
  }
  
  // Validate specific fields
  for (const [field, validator] of Object.entries(fieldValidators)) {
    if (field in data && validator && typeof validator === 'function' && !validator(data[field])) {
      return false;
    }
  }
  
  return true;
};
