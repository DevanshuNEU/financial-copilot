/**
 * Empty State Components for EXPENSESINK
 * Meaningful empty states with actionable guidance
 */

import React from 'react';
import { 
  PlusCircle, 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  CreditCard, 
  Target,
  Search,
  FileText,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

// Base empty state component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      className
    )}>
      <div className="w-16 h-16 mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || 'default'}
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button 
            onClick={secondaryAction.onClick}
            variant={secondaryAction.variant || 'outline'}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// No expenses empty state
interface NoExpensesEmptyStateProps {
  onAddExpense: () => void;
  onImportExpenses?: () => void;
  className?: string;
}

export const NoExpensesEmptyState: React.FC<NoExpensesEmptyStateProps> = ({
  onAddExpense,
  onImportExpenses,
  className
}) => {
  return (
    <EmptyState
      icon={<Wallet className="w-full h-full" />}
      title="No expenses yet"
      description="Start tracking your spending by adding your first expense. You can add expenses manually or import them from your bank."
      action={{
        label: "Add First Expense",
        onClick: onAddExpense
      }}
      secondaryAction={onImportExpenses ? {
        label: "Import Expenses",
        onClick: onImportExpenses,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// No budget categories empty state
interface NoBudgetEmptyStateProps {
  onCreateBudget: () => void;
  onUseTemplate?: () => void;
  className?: string;
}

export const NoBudgetEmptyState: React.FC<NoBudgetEmptyStateProps> = ({
  onCreateBudget,
  onUseTemplate,
  className
}) => {
  return (
    <EmptyState
      icon={<Target className="w-full h-full" />}
      title="No budget set up"
      description="Create your first budget to start managing your finances effectively. You can start from scratch or use one of our templates."
      action={{
        label: "Create Budget",
        onClick: onCreateBudget
      }}
      secondaryAction={onUseTemplate ? {
        label: "Use Template",
        onClick: onUseTemplate,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// No analytics data empty state
interface NoAnalyticsDataEmptyStateProps {
  onAddData: () => void;
  onViewGuide?: () => void;
  className?: string;
}

export const NoAnalyticsDataEmptyState: React.FC<NoAnalyticsDataEmptyStateProps> = ({
  onAddData,
  onViewGuide,
  className
}) => {
  return (
    <EmptyState
      icon={<BarChart3 className="w-full h-full" />}
      title="No data to analyze"
      description="Add some expenses and set up your budget to see detailed analytics and insights about your spending patterns."
      action={{
        label: "Add Expenses",
        onClick: onAddData
      }}
      secondaryAction={onViewGuide ? {
        label: "View Guide",
        onClick: onViewGuide,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// No search results empty state
interface NoSearchResultsEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
  onTryAgain?: () => void;
  className?: string;
}

export const NoSearchResultsEmptyState: React.FC<NoSearchResultsEmptyStateProps> = ({
  searchQuery,
  onClearSearch,
  onTryAgain,
  className
}) => {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="No results found"
      description={`We couldn't find any results for "${searchQuery}". Try adjusting your search terms or clearing the search to see all items.`}
      action={{
        label: "Clear Search",
        onClick: onClearSearch
      }}
      secondaryAction={onTryAgain ? {
        label: "Try Again",
        onClick: onTryAgain,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// No transactions empty state
interface NoTransactionsEmptyStateProps {
  timeRange?: string;
  onAddTransaction: () => void;
  onChangeFilter?: () => void;
  className?: string;
}

export const NoTransactionsEmptyState: React.FC<NoTransactionsEmptyStateProps> = ({
  timeRange,
  onAddTransaction,
  onChangeFilter,
  className
}) => {
  return (
    <EmptyState
      icon={<CreditCard className="w-full h-full" />}
      title="No transactions found"
      description={
        timeRange 
          ? `No transactions found for ${timeRange}. Try changing the date range or add a new transaction.`
          : "You haven't recorded any transactions yet. Start by adding your first transaction."
      }
      action={{
        label: "Add Transaction",
        onClick: onAddTransaction
      }}
      secondaryAction={onChangeFilter ? {
        label: "Change Filter",
        onClick: onChangeFilter,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// Error state component
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We encountered an error while loading your data. Please try again.",
  onRetry,
  onGoBack,
  className
}) => {
  return (
    <EmptyState
      icon={<AlertCircle className="w-full h-full" />}
      title={title}
      description={description}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
      secondaryAction={onGoBack ? {
        label: "Go Back",
        onClick: onGoBack,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// Coming soon state
interface ComingSoonStateProps {
  feature: string;
  description?: string;
  onNotifyMe?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export const ComingSoonState: React.FC<ComingSoonStateProps> = ({
  feature,
  description,
  onNotifyMe,
  onGoBack,
  className
}) => {
  return (
    <EmptyState
      icon={<Settings className="w-full h-full" />}
      title={`${feature} Coming Soon`}
      description={description || `We're working hard to bring you ${feature}. Stay tuned for updates!`}
      action={onNotifyMe ? {
        label: "Notify Me",
        onClick: onNotifyMe
      } : undefined}
      secondaryAction={onGoBack ? {
        label: "Go Back",
        onClick: onGoBack,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
};

// Onboarding complete state
interface OnboardingCompleteStateProps {
  onGetStarted: () => void;
  onViewDashboard: () => void;
  className?: string;
}

export const OnboardingCompleteState: React.FC<OnboardingCompleteStateProps> = ({
  onGetStarted,
  onViewDashboard,
  className
}) => {
  return (
    <EmptyState
      icon={<TrendingUp className="w-full h-full text-green-500" />}
      title="You're all set!"
      description="Your EXPENSESINK is ready to help you manage your finances. Let's start by adding your first expense or viewing your dashboard."
      action={{
        label: "Add First Expense",
        onClick: onGetStarted
      }}
      secondaryAction={{
        label: "View Dashboard",
        onClick: onViewDashboard,
        variant: 'outline'
      }}
      className={className}
    />
  );
};

// Maintenance mode state
interface MaintenanceModeStateProps {
  expectedTime?: string;
  onCheckStatus?: () => void;
  className?: string;
}

export const MaintenanceModeState: React.FC<MaintenanceModeStateProps> = ({
  expectedTime,
  onCheckStatus,
  className
}) => {
  return (
    <EmptyState
      icon={<Settings className="w-full h-full" />}
      title="Under Maintenance"
      description={
        expectedTime 
          ? `We're currently performing maintenance to improve your experience. Expected completion: ${expectedTime}`
          : "We're currently performing maintenance to improve your experience. Please check back shortly."
      }
      action={onCheckStatus ? {
        label: "Check Status",
        onClick: onCheckStatus
      } : undefined}
      className={className}
    />
  );
};

export default {
  EmptyState,
  NoExpensesEmptyState,
  NoBudgetEmptyState,
  NoAnalyticsDataEmptyState,
  NoSearchResultsEmptyState,
  NoTransactionsEmptyState,
  ErrorState,
  ComingSoonState,
  OnboardingCompleteState,
  MaintenanceModeState
};