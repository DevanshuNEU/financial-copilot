/**
 * CSRF Protection and Rate Limiting
 * Security measures for API requests
 */

// CSRF token management
class CSRFManager {
  private static token: string | null = null;
  
  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    this.token = token;
    
    // Store in session storage
    sessionStorage.setItem('csrf_token', token);
    return token;
  }
  
  static getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('csrf_token');
    }
    return this.token;
  }
  
  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  }
  
  static clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('csrf_token');
  }
}

// Rate limiting for API requests
class RateLimiter {
  private static requests: Map<string, number[]> = new Map();
  private static readonly MAX_REQUESTS = 100;
  private static readonly WINDOW_MS = 60000; // 1 minute
  
  static isAllowed(endpoint: string): boolean {
    const now = Date.now();
    const key = endpoint;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key)!;
    
    // Remove old timestamps
    const validTimestamps = timestamps.filter(timestamp => 
      now - timestamp < this.WINDOW_MS
    );
    
    if (validTimestamps.length >= this.MAX_REQUESTS) {
      return false;
    }
    
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
  
  static getRemainingRequests(endpoint: string): number {
    const now = Date.now();
    const key = endpoint;
    
    if (!this.requests.has(key)) {
      return this.MAX_REQUESTS;
    }
    
    const timestamps = this.requests.get(key)!;
    const validTimestamps = timestamps.filter(timestamp => 
      now - timestamp < this.WINDOW_MS
    );
    
    return Math.max(0, this.MAX_REQUESTS - validTimestamps.length);
  }
}

// Secure headers for requests
export const getSecureHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  
  const csrfToken = CSRFManager.getToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  return headers;
};

// Secure fetch wrapper
export const secureFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Check rate limit
  if (!RateLimiter.isAllowed(url)) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  // Add secure headers
  const secureHeaders = getSecureHeaders();
  const headers = { ...secureHeaders, ...options.headers };
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin' // Include cookies for same-origin requests
  });
};

export { CSRFManager, RateLimiter };

// Additional exports for compatibility
export const apiRateLimiter = RateLimiter;
export const loginRateLimiter = RateLimiter;
export const expenseRateLimiter = RateLimiter;
export const csrfProtection = CSRFManager;
export const securityMiddleware = {
  validateCSRF: CSRFManager.validateToken,
  checkRateLimit: RateLimiter.isAllowed,
  getSecureHeaders,
  getUserIdentifier: () => 'user-' + (sessionStorage.getItem('user_id') || 'anonymous'),
  addCSRFToken: (headers: Record<string, string>) => {
    const token = CSRFManager.getToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }
};