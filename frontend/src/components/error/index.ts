/**
 * Error Handling Components and Utilities - Export Index
 * Centralized exports for all error handling functionality
 */

// Error Boundary Components
export { default as ErrorBoundary } from './ErrorBoundary';
export {
  AppErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary,
  CriticalErrorBoundary,
  FormErrorBoundary
} from './SpecializedErrorBoundaries';

// Form Error Handling
export {
  useFormWithErrors,
  FormField,
  FormErrorSummary,
  FormSuccessMessage,
  validationRules
} from '../forms/FormErrorHandling';

export type {
  FormFieldError,
  FormValidationResult,
  FormState
} from '../forms/FormErrorHandling';

// Error Context
export { ErrorProvider, useError } from '../../contexts/ErrorContext';
export type { AppError, ErrorType } from '../../contexts/ErrorContext';

// Enhanced API Service
export { apiClient, handleApiResult, isApiSuccess, isApiError } from '../../services/enhancedApiService';
export type { ApiRequestConfig, ApiClient } from '../../services/enhancedApiService';

// Re-export API Response types for convenience
export type {
  ApiResult,
  ApiSuccess,
  ApiError,
  ApiValidationError,
  AuthenticationError,
  NotFoundError
} from '../../types/api/responses';

export {
  isApiSuccess as isApiSuccessResponse,
  isApiError as isApiErrorResponse,
  isApiValidationError,
  isAuthenticationError,
  isNotFoundError
} from '../../types/api/responses';