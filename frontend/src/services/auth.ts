// Authentication service for EXPENSESINK
// Handles user authentication, token management, and API communication

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// API client with automatic token inclusion
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fc_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authService.logout();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  has_onboarding_data: boolean;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'fc_access_token';
  private readonly USER_KEY = 'fc_user';

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/auth/register', data);
      const authData = response.data;
      
      // Store token and user data
      this.setAuthData(authData.access_token, authData.user);
      
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      const authData = response.data;
      
      // Store token and user data
      this.setAuthData(authData.access_token, authData.user);
      
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  /**
   * Get current user from backend
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/api/auth/me');
      const user = response.data.user;
      
      // Update stored user data
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get current user');
    }
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<boolean> {
    try {
      const response = await apiClient.get('/api/auth/verify-token');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Clear any onboarding data as well since user is logging out
    localStorage.removeItem('financialCopilot_userData');
    localStorage.removeItem('financialCopilot_onboardingComplete');
    localStorage.removeItem('financialCopilot_onboardingSkipped');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store authentication data
   */
  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * OAuth Login - Google
   */
  async loginWithGoogle(): Promise<void> {
    // Redirect to Google OAuth
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  /**
   * OAuth Login - GitHub
   */
  async loginWithGitHub(): Promise<void> {
    // Redirect to GitHub OAuth
    window.location.href = `${API_BASE_URL}/api/auth/github`;
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(token: string): Promise<User> {
    try {
      // Store token and get user data
      localStorage.setItem(this.TOKEN_KEY, token);
      return await this.getCurrentUser();
    } catch (error: any) {
      this.logout();
      throw new Error('OAuth authentication failed');
    }
  }
}

export const authService = new AuthService();
export { apiClient };
