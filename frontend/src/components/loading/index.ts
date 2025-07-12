/**
 * Loading Components and Utilities - Export Index
 * Centralized exports for all loading states and UX components
 */

// Error Boundary Components
export { default as ErrorBoundary } from '../error/ErrorBoundary';
export {
  AppErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary,
  CriticalErrorBoundary,
  FormErrorBoundary
} from '../error/SpecializedErrorBoundaries';

// Loading Components
export {
  LoadingSpinner,
  FinancialLoadingSpinner,
  LoadingDots,
  ProgressBar,
  CircularProgress,
  PulsingLoader,
  FinancialDataLoader
} from './LoadingComponents';

// Skeleton Components
export {
  Skeleton,
  DashboardSkeleton,
  AnalyticsSkeleton,
  ExpenseListSkeleton,
  BudgetCategoriesSkeleton,
  TableSkeleton,
  ProfileSettingsSkeleton,
  CardSkeleton
} from './SkeletonComponents';

// Empty States
export {
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
} from './EmptyStates';

// Progress Indicators
export {
  StepIndicator,
  MultiStepProgress,
  OnboardingProgress,
  FileUploadProgress,
  DataProcessingProgress,
  useMultiStepProgress
} from './ProgressIndicators';

// Re-export types
export type { StepStatus, ProgressStep } from './ProgressIndicators';

// Loading State Hooks
export {
  useLoadingState,
  useMultipleLoadingStates,
  useAsyncOperation,
  useFormLoadingState
} from '../../hooks/useLoadingState';

export type { LoadingState, LoadingStateWithId } from '../../hooks/useLoadingState';