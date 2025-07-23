import { Expense, DashboardData, ExpensesResponse, Budget, SafeToSpendResponse } from '../types';

// API Configuration
const FLASK_API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const USE_EDGE_FUNCTIONS = process.env.REACT_APP_USE_EDGE_FUNCTIONS === 'true';

// Edge Functions URLs
const EDGE_FUNCTIONS_BASE_URL = `${SUPABASE_URL}/functions/v1`;

class HybridApiService {
  /**
   * Generic fetch method for Flask API
   */
  private async fetchFlaskApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${FLASK_API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Flask API error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Flask API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Generic fetch method for Edge Functions
   */
  private async fetchEdgeFunction<T>(functionName: string, options?: RequestInit): Promise<T> {
    const url = `${EDGE_FUNCTIONS_BASE_URL}/${functionName}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Edge Function error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Edge Function call failed for ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Determine if an endpoint should use Edge Functions
   */
  private isSimpleEndpoint(endpoint: string): boolean {
    if (!USE_EDGE_FUNCTIONS) return false;
    
    const simplePatterns = [
      /^\/api\/expenses\/\d+$/,    // GET single expense
      /^\/api\/expenses\/?$/,      // GET list or POST create  
      /^\/api\/health$/,           // Health check
      /^\/api\/onboarding$/,       // GET/POST onboarding data
      /^\/api\/dashboard$/,        // GET comprehensive dashboard data
      /^\/api\/analytics$/,        // GET analytics data
      /^\/api\/budgets\/?$/,       // GET/POST/DELETE budgets
      /^\/api\/safe-to-spend$/,    // GET safe-to-spend calculations
    ];
    
    return simplePatterns.some(pattern => pattern.test(endpoint));
  }

  /**
   * Route request to appropriate backend
   */
  private async routeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // For simple CRUD operations, use Edge Functions if enabled
    if (this.isSimpleEndpoint(endpoint)) {
      console.log(`🚀 Routing to Edge Function: ${endpoint}`);
      
      // Map Flask endpoints to Edge Function names
      if (endpoint === '/api/health') {
        return this.fetchEdgeFunction('health-check', options);
      }
      
      if (endpoint === '/api/expenses' || endpoint === '/api/expenses/') {
        if (options?.method === 'POST') {
          return this.fetchEdgeFunction('expenses-create', options);
        } else {
          return this.fetchEdgeFunction('expenses-list', options);
        }
      }
      
      if (endpoint === '/api/onboarding') {
        if (options?.method === 'POST') {
          return this.fetchEdgeFunction('onboarding-save', options);
        } else {
          return this.fetchEdgeFunction('onboarding-simple', options);
        }
      }
      
      if (endpoint === '/api/dashboard') {
        return this.fetchEdgeFunction('dashboard-api', options);
      }
      
      if (endpoint === '/api/analytics') {
        return this.fetchEdgeFunction('analytics-api', options);
      }
      
      if (endpoint === '/api/budgets' || endpoint === '/api/budgets/') {
        return this.fetchEdgeFunction('budget-api', options);
      }
      
      if (endpoint === '/api/safe-to-spend') {
        return this.fetchEdgeFunction('safe-to-spend-api', options);
      }
      
      // Single expense GET - pass the ID as a query parameter
      const singleExpenseMatch = endpoint.match(/^\/api\/expenses\/(\d+)$/);
      if (singleExpenseMatch && (!options?.method || options.method === 'GET')) {
        // Pass ID as query parameter to the Edge Function
        return this.fetchEdgeFunction(`expenses-get?id=${singleExpenseMatch[1]}`, options);
      }
    }
    
    // For complex operations, use Flask API
    console.log(`🏗️ Routing to Flask API: ${endpoint}`);
    return this.fetchFlaskApi(endpoint, options);
  }

  // Health check - routed to Edge Functions if enabled
  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    return this.routeRequest('/api/health');
  }

  // Get all expenses - routed to Edge Functions if enabled
  async getExpenses(): Promise<ExpensesResponse> {
    return this.routeRequest('/api/expenses');
  }

  // Create new expense - routed to Edge Functions if enabled
  async createExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    return this.routeRequest('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  // ONBOARDING DATA - routed to Edge Functions if enabled
  async getOnboardingData(): Promise<any> {
    return this.routeRequest('/api/onboarding');
  }

  async saveOnboardingData(data: any): Promise<any> {
    return this.routeRequest('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update existing expense - complex operation, always use Flask
  async updateExpense(id: number, expense: Partial<Omit<Expense, 'id' | 'created_at'>>): Promise<Expense> {
    return this.fetchFlaskApi(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  // Delete expense - complex operation, always use Flask
  async deleteExpense(id: number): Promise<{ message: string }> {
    return this.fetchFlaskApi(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // COMPREHENSIVE DASHBOARD API - All calculations server-side
  async getDashboardData(): Promise<any> {
    return this.routeRequest('/api/dashboard');
  }

  // Budget Management - now routed to Edge Functions
  async getBudgets(): Promise<{ budgets: Budget[] }> {
    const response = await this.routeRequest('/api/budgets');
    // Transform response to match expected format
    return {
      budgets: response.budgets || []
    };
  }

  async createOrUpdateBudget(category: string, monthly_limit: number): Promise<Budget> {
    return this.routeRequest('/api/budgets', {
      method: 'POST',
      body: JSON.stringify({ category, monthly_limit }),
    });
  }

  // Safe to Spend - now routed to Edge Functions
  async getSafeToSpend(): Promise<SafeToSpendResponse> {
    return this.routeRequest('/api/safe-to-spend');
  }

  // Weekly Comparison Data - complex analytics, always Flask
  async getWeeklyComparison(): Promise<{
    weeklyData: Array<{
      day: string;
      dayName: string;
      thisWeek: number;
      lastWeek: number;
    }>;
    thisWeekTotal: number;
    lastWeekTotal: number;
    currentDayOfWeek: number;
  }> {
    return this.fetchFlaskApi('/api/dashboard/weekly-comparison');
  }
}

const hybridApiService = new HybridApiService();

// Export both the named instance and as apiService for compatibility
export { hybridApiService };
export const apiService = hybridApiService;