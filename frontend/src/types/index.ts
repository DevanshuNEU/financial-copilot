/**
 * Main Types Index - Comprehensive Type Definitions
 * 
 * This file provides centralized access to all type definitions
 * used throughout the EXPENSESINK application.
 */

// Legacy types (maintained for backward compatibility)
export interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  vendor: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';  // ✅ All valid statuses
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
  summary: {
    totalSpent: number;
    totalBudget: number;
    totalFixedCosts: number;
    discretionaryBudget: number;
    availableAmount: number;
    dailySafeAmount: number;
    daysRemaining: number;
    spendingTrend: number;
  };
  spendingByCategory: Record<string, number>;
  budgetHealth: Record<string, any>;
  recentExpenses: Expense[];
  insights: Array<{
    type: string;
    message: string;
  }>;
  stats: {
    totalTransactions: number;
    averageTransaction: number;
    last7DaysSpending?: number;
    previous7DaysSpending?: number;
  };
  timestamp?: string;
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

// Enhanced type definitions (new type-safe approach)
export * from './services';
export * from './api/responses';
export * from './utils';
export * from './utils/guards';

// Re-export domain types with specific exports to avoid conflicts
export type {
  User as EnhancedUser,
  Expense as EnhancedExpense,
  Budget as EnhancedBudget,
  CategoryName,
  Currency,
  ExpenseStatus,
  UserId,
  ExpenseId,
  UserPreferences,
  NotificationSettings,
  UserProfile,
  ExpenseMetadata,
  BudgetStatus as EnhancedBudgetStatus
} from './domain';

// Export form types
export * from './forms';

// Common utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Application state types
export interface AppState {
  user: {
    isAuthenticated: boolean;
    data: any;
    loading: boolean;
    error: string | null;
  };
  expenses: {
    data: Expense[];
    loading: boolean;
    error: string | null;
  };
  budgets: {
    data: Budget[];
    loading: boolean;
    error: string | null;
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

export interface LoadingComponentProps extends BaseComponentProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

// Event types
export interface FormEvent<T = any> {
  target: T;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface ClickEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
}

// Configuration types
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'test';
  features: {
    analytics: boolean;
    notifications: boolean;
    exportData: boolean;
  };
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Route types
export interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  title?: string;
  description?: string;
}

// Navigation types
export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
  description?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  metrics: Record<string, number>;
  dimensions: Record<string, string>;
}

// AI-related types
export interface AIExpenseProcessing {
  success: boolean;
  expense?: Partial<Expense>;
  suggestions?: string[];
  confidence: number;
  error?: string;
}

export interface AIInsight {
  type: 'warning' | 'tip' | 'achievement' | 'suggestion';
  title: string;
  message: string;
  actionable?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    expenseProcessed?: boolean;
    confidence?: number;
    suggestions?: string[];
  };
}

export interface AIServiceConfig {
  apiKey: string;
  modelName: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}
