import { Expense, DashboardData, ExpensesResponse, Budget, SafeToSpendResponse, WeeklyComparisonData } from '../types';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const USE_EDGE_FUNCTIONS = process.env.REACT_APP_USE_EDGE_FUNCTIONS === 'true';
const EDGE_FUNCTIONS_BASE_URL = `${SUPABASE_URL}/functions/v1`;

class HybridApiService {
  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No active session');
    }
    return session.access_token;
  }

  private async fetchEdgeFunction<T>(functionName: string, options?: RequestInit): Promise<T> {
    const url = `${EDGE_FUNCTIONS_BASE_URL}/${functionName}`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options?.headers,
        },
        ...options,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Edge Function error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Edge Function call failed for ${functionName}:`, error);
      throw error;
    }
  }

  private shouldUseEdgeFunctions(): boolean {
    return USE_EDGE_FUNCTIONS;
  }

  async getHealth() {
    return this.fetchEdgeFunction('health-check');
  }

  async getDashboardData(): Promise<DashboardData> {
    return this.fetchEdgeFunction('dashboard-api');
  }

  async getExpenses(filters?: any): Promise<ExpensesResponse> {
    return this.fetchEdgeFunction('expenses-list');
  }

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    return this.fetchEdgeFunction('expenses-create', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id: string | number, updates: Partial<Expense>): Promise<Expense> {
    return this.fetchEdgeFunction('expenses-update', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteExpense(id: string | number): Promise<void> {
    return this.fetchEdgeFunction('expenses-delete', {
      method: 'DELETE',
    });
  }

  async getOnboarding() {
    return this.fetchEdgeFunction('onboarding-simple');
  }

  async saveOnboarding(data: any) {
    return this.fetchEdgeFunction('onboarding-simple', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBudgets(): Promise<Budget[]> {
    return this.fetchEdgeFunction('budget-api');
  }

  async createBudget(budget: Partial<Budget>): Promise<Budget> {
    return this.fetchEdgeFunction('budget-api', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async updateBudget(id: string | number, updates: Partial<Budget>): Promise<Budget> {
    return this.fetchEdgeFunction('budget-api', {
      method: 'PUT',
      body: JSON.stringify({ id: String(id), ...updates }),
    });
  }

  async deleteBudget(id: string | number): Promise<void> {
    return this.fetchEdgeFunction('budget-api', {
      method: 'DELETE',
      body: JSON.stringify({ id: String(id) }),
    });
  }

  async getSafeToSpend(): Promise<SafeToSpendResponse> {
    return this.fetchEdgeFunction('safe-to-spend-api');
  }

  async getAnalytics() {
    return this.fetchEdgeFunction('analytics-api');
  }

  async getWeeklyComparison(): Promise<WeeklyComparisonData> {
    return this.fetchEdgeFunction('weekly-comparison');
  }
}

export const apiService = new HybridApiService();
