/**
 * Enhanced API Service with Comprehensive Error Handling and Retry Logic
 * Integrates with the global error management system
 */

import { toast } from 'react-hot-toast';
import type { ApiResult, ApiError, ApiSuccess } from '../types/api/responses';

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  loadingMessage?: string;
}

export interface ApiClient {
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResult<T>>;
  post<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResult<T>>;
  put<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResult<T>>;
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResult<T>>;
}

class EnhancedApiService implements ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private defaultRetries: number = 3;
  private defaultRetryDelay: number = 1000;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    
    // Monitor network status
    this.setupNetworkMonitoring();
  }

  private setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      toast.success('Connection restored', { id: 'network-status' });
    });
    
    window.addEventListener('offline', () => {
      toast.error('Connection lost. Some features may not work.', { 
        id: 'network-status',
        duration: Infinity
      });
    });
  }

  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResult<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      onRetry,
      onSuccess,
      onError,
      showSuccessToast = false,
      showErrorToast = true,
      loadingMessage
    } = config || {};

    // Show loading message if provided
    let loadingToastId: string | undefined;
    if (loadingMessage) {
      loadingToastId = toast.loading(loadingMessage);
    }

    const fullUrl = `${this.baseURL}${url}`;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const response = await this.makeRequest(method, fullUrl, data, timeout);
        
        // Dismiss loading toast
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        // Handle success
        if (response.ok) {
          const result = await this.parseResponse<T>(response);
          
          if (onSuccess) {
            onSuccess(result);
          }
          
          if (showSuccessToast) {
            toast.success('Request completed successfully');
          }
          
          return result;
        } else {
          const errorResult = await this.parseErrorResponse(response);
          
          if (onError) {
            onError(errorResult);
          }
          
          if (showErrorToast) {
            toast.error(this.getErrorMessage(errorResult));
          }
          
          return errorResult;
        }
      } catch (error) {
        lastError = error as Error;
        
        // If this is the last attempt, return the error
        if (attempt > retries) {
          break;
        }
        
        // Check if error is retryable
        if (!this.isRetryableError(error as Error)) {
          break;
        }
        
        // Call retry callback
        if (onRetry) {
          onRetry(attempt, error as Error);
        }
        
        // Wait before retrying
        await this.delay(retryDelay * attempt);
      }
    }

    // Dismiss loading toast
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }

    // All retries failed, return error result
    const errorResult = this.createErrorResult(lastError || new Error('Unknown error'));
    
    if (onError) {
      onError(errorResult);
    }
    
    if (showErrorToast) {
      toast.error(this.getErrorMessage(errorResult));
    }
    
    return errorResult;
  }

  private async makeRequest(
    method: string,
    url: string,
    data?: any,
    timeout?: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || this.defaultTimeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async parseResponse<T>(response: Response): Promise<ApiSuccess<T>> {
    try {
      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // If JSON parsing fails, return the response as text
      const text = await response.text();
      return {
        success: true,
        data: text as unknown as T,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          code: errorData.code || this.getStatusCodeError(response.status),
          message: errorData.message || response.statusText || 'Unknown error',
          details: errorData.details || { status: response.status }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: this.getStatusCodeError(response.status),
          message: response.statusText || 'Unknown error',
          details: { status: response.status }
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private createErrorResult(error: Error): ApiError {
    let code = 'UNKNOWN_ERROR';
    let message = error.message;

    if (error.name === 'AbortError') {
      code = 'TIMEOUT_ERROR';
      message = 'Request timed out';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      code = 'NETWORK_ERROR';
      message = 'Network connection failed';
    }

    return {
      success: false,
      error: {
        code,
        message,
        details: { originalError: error.toString() }
      },
      timestamp: new Date().toISOString()
    };
  }

  private getStatusCodeError(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'AUTHENTICATION_ERROR';
      case 403:
        return 'AUTHORIZATION_ERROR';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'VALIDATION_ERROR';
      case 429:
        return 'RATE_LIMIT_ERROR';
      case 500:
        return 'INTERNAL_SERVER_ERROR';
      case 502:
        return 'BAD_GATEWAY';
      case 503:
        return 'SERVICE_UNAVAILABLE';
      case 504:
        return 'GATEWAY_TIMEOUT';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  private isRetryableError(error: Error): boolean {
    // Network errors are retryable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }
    
    // Timeout errors are retryable
    if (error.name === 'AbortError') {
      return true;
    }
    
    // Check for specific HTTP status codes that are retryable
    if (error.message.includes('502') || error.message.includes('503') || error.message.includes('504')) {
      return true;
    }
    
    return false;
  }

  private getErrorMessage(error: ApiError): string {
    switch (error.error.code) {
      case 'NETWORK_ERROR':
        return 'Network connection failed. Please check your internet connection.';
      case 'TIMEOUT_ERROR':
        return 'Request timed out. Please try again.';
      case 'AUTHENTICATION_ERROR':
        return 'Authentication failed. Please sign in again.';
      case 'AUTHORIZATION_ERROR':
        return 'You don\'t have permission to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'RATE_LIMIT_ERROR':
        return 'Too many requests. Please wait a moment and try again.';
      case 'INTERNAL_SERVER_ERROR':
        return 'Server error occurred. Please try again later.';
      case 'SERVICE_UNAVAILABLE':
        return 'Service is temporarily unavailable. Please try again later.';
      default:
        return error.error.message || 'An unexpected error occurred.';
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const apiClient = new EnhancedApiService();

// Export utility functions for handling API results
export const handleApiResult = <T>(
  result: ApiResult<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: ApiError) => void
): T | null => {
  if (result.success) {
    if (onSuccess) {
      onSuccess(result.data);
    }
    return result.data;
  } else {
    if (onError) {
      onError(result);
    }
    return null;
  }
};

export const isApiSuccess = <T>(result: ApiResult<T>): result is ApiSuccess<T> => {
  return result.success === true;
};

export const isApiError = <T>(result: ApiResult<T>): result is ApiError => {
  return result.success === false;
};

export default EnhancedApiService;