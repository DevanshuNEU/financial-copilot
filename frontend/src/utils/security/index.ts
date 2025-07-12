/**
 * Security Utils - Export Index
 * Centralized exports for all security functionality
 */

// Input Sanitization
export {
  sanitizeHtml,
  removeScriptTags,
  sanitizeSql,
  sanitizeNumber,
  validateEmail,
  validatePassword,
  validateUrl,
  generateNonce,
  sanitizeUserInput,
  safeJsonParse,
  validateFinancialAmount
} from './inputSanitization';

// CSRF Protection and Rate Limiting
export {
  apiRateLimiter,
  loginRateLimiter,
  expenseRateLimiter,
  csrfProtection,
  securityMiddleware
} from './csrfProtection';

// Data Validation
export {
  validateExpenseData,
  validateBudgetData,
  validateUserProfile,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumericRange,
  validateSecurityRules,
  validateFormData
} from './dataValidation';

// Secure API Service
export { default as SecureApiService, secureApiClient } from './secureApiService';

// Re-export types
export type { ValidationResult } from './dataValidation';