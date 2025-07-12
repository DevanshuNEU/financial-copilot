/**
 * Secure API Wrapper
 * Enhanced API service with security features
 */

import { toast } from 'react-hot-toast';
import { sanitizeUserInput, validateFinancialAmount } from './inputSanitization';
import { securityMiddleware, apiRateLimiter, expenseRateLimiter } from './csrfProtection';
import { validateSecurityRules } from './dataValidation';
import type { ApiResult, ApiError } from '../../types/api/responses';

interface SecureApiConfig {
  enableRateLimit: boolean;
  enableCSRF: boolean;
  enableInputSanitization: boolean;
  enableSecurityValidation: boolean;
  timeout: number;
}

class SecureApiService {
  private config: SecureApiConfig;
  private baseURL: string;

  constructor(baseURL: string = '', config: Partial<SecureApiConfig> = {}) {
    this.baseURL = baseURL;
    this.config = {
      enableRateLimit: true,
      enableCSRF: true,
      enableInputSanitization: true,
      enableSecurityValidation: true,
      timeout: 10000,
      ...config
    };
  }

  private sanitizeRequestData(data: any): any {
    if (!this.config.enableInputSanitization) return data;

    if (typeof data === 'string') {
      return sanitizeUserInput(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeRequestData(value);
      }
      return sanitized;
    }

    return data;
  }

  private validateRequest(data: any): void {
    if (!this.config.enableSecurityValidation) return;

    const validation = validateSecurityRules(data);
    if (!validation.isValid) {
      throw new Error(`Security validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Security warnings:', validation.warnings);
    }
  }

  private checkRateLimit(endpoint: string): void {
    if (!this.config.enableRateLimit) return;

    const identifier = securityMiddleware.getUserIdentifier();
    
    // Use different rate limiters for different endpoints
    if (endpoint.includes('/expenses')) {
      if (!expenseRateLimiter.isAllowed(identifier)) {
        throw new Error('Rate limit exceeded for expenses. Please try again later.');
      }
    } else {
      if (!apiRateLimiter.isAllowed(identifier)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }
  }

  private prepareHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    // Add CSRF token
    if (this.config.enableCSRF) {
      headers = securityMiddleware.addCSRFToken(headers);
    }

    return headers;
  }

  private async makeSecureRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResult<T>> {
    try {
      // Rate limiting
      this.checkRateLimit(endpoint);

      // Input sanitization
      const sanitizedData = this.sanitizeRequestData(data);

      // Security validation
      this.validateRequest(sanitizedData);

      // Prepare headers
      const headers = this.prepareHeaders(customHeaders);

      // Make request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers,
        body: sanitizedData ? JSON.stringify(sanitizedData) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: this.getErrorCode(response.status),
            message: errorData.message || response.statusText,
            details: errorData.details || { status: response.status }
          },
          timestamp: new Date().toISOString()
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Secure API request failed:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'TIMEOUT_ERROR',
            message: 'Request timed out',
            details: { timeout: this.config.timeout }
          },
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
          details: { originalError: error }
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 429: return 'RATE_LIMIT_EXCEEDED';
      case 500: return 'INTERNAL_SERVER_ERROR';
      default: return 'UNKNOWN_ERROR';
    }
  }

  // Secure expense operations
  async createExpense(expenseData: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }): Promise<ApiResult<any>> {
    // Validate financial amount
    const amountValidation = validateFinancialAmount(expenseData.amount);
    if (!amountValidation) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid amount',
          details: { field: 'amount' }
        },
        timestamp: new Date().toISOString()
      };
    }

    return this.makeSecureRequest('POST', '/expenses', {
      ...expenseData,
      amount: expenseData.amount // Use the original amount since it's already validated
    });
  }

  async updateExpense(id: string, updates: any): Promise<ApiResult<any>> {
    if (updates.amount !== undefined) {
      const amountValidation = validateFinancialAmount(updates.amount);
      if (!amountValidation) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid amount',
            details: { field: 'amount' }
          },
          timestamp: new Date().toISOString()
        };
      }
      // Amount is already valid, use as is
    }

    return this.makeSecureRequest('PUT', `/expenses/${id}`, updates);
  }

  async deleteExpense(id: string): Promise<ApiResult<any>> {
    return this.makeSecureRequest('DELETE', `/expenses/${id}`);
  }

  // Generic secure methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResult<T>> {
    return this.makeSecureRequest('GET', endpoint, undefined, headers);
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResult<T>> {
    return this.makeSecureRequest('POST', endpoint, data, headers);
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResult<T>> {
    return this.makeSecureRequest('PUT', endpoint, data, headers);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResult<T>> {
    return this.makeSecureRequest('DELETE', endpoint, undefined, headers);
  }
}

// Create secure API instance
export const secureApiClient = new SecureApiService();

// Export for use in components
export default SecureApiService;