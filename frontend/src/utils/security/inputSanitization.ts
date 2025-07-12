/**
 * Input Sanitization and XSS Prevention
 * Comprehensive security utilities for user input
 */

// HTML sanitization to prevent XSS
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Remove dangerous characters
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize financial amounts
export const sanitizeAmount = (input: string): number => {
  const sanitized = input.replace(/[^0-9.-]/g, '');
  const amount = parseFloat(sanitized);
  return isNaN(amount) ? 0 : Math.max(0, Math.round(amount * 100) / 100);
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate and sanitize category names
export const sanitizeCategory = (category: string): string => {
  return category
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .substring(0, 50);
};

// Validate and sanitize description
export const sanitizeDescription = (description: string): string => {
  return sanitizeInput(description).substring(0, 200);
};

// Content Security Policy helpers
export const createNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Safe JSON parsing
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

// Additional exports for compatibility
export const removeScriptTags = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const sanitizeSql = (input: string): string => {
  return input.replace(/[';\\]/g, '');
};

export const sanitizeNumber = (input: string): number => {
  const num = parseFloat(input.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

export const validateUrl = (url: string): boolean => {
  return isValidUrl(url);
};

export const generateNonce = (): string => {
  return createNonce();
};

export const sanitizeUserInput = (input: string): string => {
  return sanitizeInput(input);
};

export const validateFinancialAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount >= 0 && amount <= 999999;
};

export default {
  sanitizeHtml,
  sanitizeInput,
  sanitizeAmount,
  validateEmail,
  sanitizeCategory,
  sanitizeDescription,
  createNonce,
  isValidUrl,
  safeJsonParse,
  removeScriptTags,
  sanitizeSql,
  sanitizeNumber,
  validatePassword,
  validateUrl,
  generateNonce,
  sanitizeUserInput,
  validateFinancialAmount
};