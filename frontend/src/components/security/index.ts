/**
 * Security Components and Utilities - Export Index
 * Centralized exports for all security functionality
 */

// Import for internal use
import { CSRFManager } from '../../utils/security/csrfProtection';
import { validateField, validateExpense } from '../../utils/security/validation';
import { secureFetch, getSecureHeaders } from '../../utils/security/csrfProtection';
import { sanitizeInput } from '../../utils/security/inputSanitization';

// Input Sanitization
export {
  sanitizeHtml,
  sanitizeInput,
  sanitizeAmount,
  validateEmail,
  sanitizeCategory,
  sanitizeDescription,
  createNonce,
  isValidUrl,
  safeJsonParse
} from '../../utils/security/inputSanitization';

// CSRF Protection
export {
  CSRFManager,
  RateLimiter,
  getSecureHeaders,
  secureFetch
} from '../../utils/security/csrfProtection';

// Data Validation
export {
  validateAmount,
  validateExpense,
  validateBudget,
  validateProfile,
  validatePassword,
  validateField
} from '../../utils/security/validation';

export type { ValidationResult } from '../../utils/security/validation';

// Secure Forms
export {
  SecureExpenseForm,
  SecureProfileForm
} from './SecureForms';

// Security utilities
export const initializeSecurity = () => {
  // Generate CSRF token on app start
  if (typeof window !== 'undefined') {
    CSRFManager.generateToken();
  }
  
  console.log('🔒 Security initialized');
};

// Security hooks
export const useSecureForm = () => {
  return {
    sanitizeInput: sanitizeInput,
    validateField: validateField,
    validateExpense: validateExpense
  };
};

export const useSecureApi = () => {
  return {
    secureFetch: secureFetch,
    getSecureHeaders: getSecureHeaders
  };
};

export default {
  initializeSecurity,
  useSecureForm,
  useSecureApi
};