// Phase 2 Hybrid API Service
// Routes simple CRUD to Edge Functions, complex operations to Flask API

// Re-export all types that might be needed
export type { Expense, DashboardData, ExpensesResponse, Budget, SafeToSpendResponse } from '../types';

// Export the main API service
export { apiService } from './api.hybrid';