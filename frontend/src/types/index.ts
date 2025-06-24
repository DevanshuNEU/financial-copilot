export interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  vendor: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Budget {
  id: number;
  category: string;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetStatus {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  over_budget: number;
  percentage_used: number;
}

export interface SafeToSpend {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  discretionary_remaining: number;
  days_left_in_month: number;
  daily_safe_amount: number;
}

export interface SafeToSpendResponse {
  safe_to_spend: SafeToSpend;
  budget_status: BudgetStatus[];
  recommendations: {
    can_spend_today: number;
    status: 'on_track' | 'caution' | 'over_budget';
  };
}

export interface DashboardOverview {
  total_expenses: number;
  total_transactions: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  budget?: number;
  budgetUsed?: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  category_breakdown: CategoryBreakdown[];
}

export interface WeeklyData {
  day: string;
  dayName: string;
  thisWeek: number;
  lastWeek: number;
}

export interface WeeklyComparisonData {
  weeklyData: WeeklyData[];
  thisWeekTotal: number;
  lastWeekTotal: number;
  currentDayOfWeek: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  total: number;
}
