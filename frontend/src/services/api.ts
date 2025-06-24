import { Expense, DashboardData, ExpensesResponse, Budget, SafeToSpendResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    return this.fetchApi('/');
  }

  // Get all expenses
  async getExpenses(): Promise<ExpensesResponse> {
    return this.fetchApi('/api/expenses');
  }

  // Get dashboard data
  async getDashboardData(): Promise<DashboardData> {
    return this.fetchApi('/api/dashboard/overview');
  }

  // Create new expense
  async createExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    return this.fetchApi('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  // Update existing expense
  async updateExpense(id: number, expense: Partial<Omit<Expense, 'id' | 'created_at'>>): Promise<Expense> {
    return this.fetchApi(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  // Delete expense
  async deleteExpense(id: number): Promise<{ message: string }> {
    return this.fetchApi(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget Management
  async getBudgets(): Promise<{ budgets: Budget[] }> {
    return this.fetchApi('/api/budgets');
  }

  async createOrUpdateBudget(category: string, monthly_limit: number): Promise<Budget> {
    return this.fetchApi('/api/budgets', {
      method: 'POST',
      body: JSON.stringify({ category, monthly_limit }),
    });
  }

  // Safe to Spend
  async getSafeToSpend(): Promise<SafeToSpendResponse> {
    return this.fetchApi('/api/safe-to-spend');
  }
}

export const apiService = new ApiService();
