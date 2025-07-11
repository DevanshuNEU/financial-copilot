/**
 * API Response Types with Discriminated Unions for Better Error Handling
 */

// Base Result Type for All API Operations
export type ApiResult<T> = ApiSuccess<T> | ApiError;

export interface ApiSuccess<T> {
  readonly success: true;
  readonly data: T;
  readonly timestamp: string;
}

export interface ApiError {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly timestamp: string;
}

// Specific Error Types
export interface ApiValidationError extends ApiError {
  readonly error: {
    readonly code: 'VALIDATION_ERROR';
    readonly message: string;
    readonly details: Record<string, unknown> & {
      readonly validationErrors: Array<{
        readonly field: string;
        readonly value: unknown;
        readonly constraint: string;
      }>;
    };
  };
}

export interface AuthenticationError extends ApiError {
  readonly error: {
    readonly code: 'AUTHENTICATION_ERROR';
    readonly message: string;
    readonly details?: {
      readonly reason: 'invalid_credentials' | 'token_expired' | 'account_locked';
    };
  };
}

export interface NotFoundError extends ApiError {
  readonly error: {
    readonly code: 'NOT_FOUND';
    readonly message: string;
    readonly details?: {
      readonly resource: string;
      readonly id: string | number;
    };
  };
}

// Utility type for extracting data from ApiResult
export type ExtractApiData<T> = T extends ApiSuccess<infer U> ? U : never;

// Type guard functions
export const isApiSuccess = <T>(result: ApiResult<T>): result is ApiSuccess<T> => {
  return result.success === true;
};

export const isApiError = <T>(result: ApiResult<T>): result is ApiError => {
  return result.success === false;
};

export const isApiValidationError = (error: ApiError): error is ApiValidationError => {
  return error.error.code === 'VALIDATION_ERROR';
};

export const isAuthenticationError = (error: ApiError): error is AuthenticationError => {
  return error.error.code === 'AUTHENTICATION_ERROR';
};

export const isNotFoundError = (error: ApiError): error is NotFoundError => {
  return error.error.code === 'NOT_FOUND';
};
