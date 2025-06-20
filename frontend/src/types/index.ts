export interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  vendor: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface DashboardOverview {
  total_expenses: number;
  total_transactions: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  category_breakdown: CategoryBreakdown[];
}

export interface ExpensesResponse {
  expenses: Expense[];
  total: number;
}
