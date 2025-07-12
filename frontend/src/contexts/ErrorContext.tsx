/**
 * Global Error Management Context
 * Centralized error handling with user-friendly messages and retry mechanisms
 */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Define ApiError and ApiResult types locally to avoid import issues
export interface ApiError {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly timestamp: string;
}

export interface ApiResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError['error'];
  readonly timestamp: string;
}

// Error types that can occur in the application
export type ErrorType = 
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'server'
  | 'client'
  | 'unknown';

export interface AppError {
  id: string;
  type: ErrorType;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
  resolved: boolean;
  retryable: boolean;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
  };
}

interface ErrorState {
  errors: AppError[];
  isOnline: boolean;
  retryQueue: Array<{
    id: string;
    action: () => Promise<void>;
    maxRetries: number;
    currentRetries: number;
  }>;
}

type ErrorAction = 
  | { type: 'ADD_ERROR'; payload: Omit<AppError, 'id' | 'timestamp'> }
  | { type: 'RESOLVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_RETRY_ACTION'; payload: { id: string; action: () => Promise<void>; maxRetries: number } }
  | { type: 'REMOVE_RETRY_ACTION'; payload: string }
  | { type: 'INCREMENT_RETRY_COUNT'; payload: string };

const initialState: ErrorState = {
  errors: [],
  isOnline: navigator.onLine,
  retryQueue: []
};

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [
          ...state.errors,
          {
            ...action.payload,
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now()
          }
        ]
      };
    
    case 'RESOLVE_ERROR':
      return {
        ...state,
        errors: state.errors.map(error => 
          error.id === action.payload 
            ? { ...error, resolved: true }
            : error
        )
      };
    
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: []
      };
    
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };
    
    case 'ADD_RETRY_ACTION':
      return {
        ...state,
        retryQueue: [
          ...state.retryQueue,
          {
            ...action.payload,
            currentRetries: 0
          }
        ]
      };
    
    case 'REMOVE_RETRY_ACTION':
      return {
        ...state,
        retryQueue: state.retryQueue.filter(item => item.id !== action.payload)
      };
    
    case 'INCREMENT_RETRY_COUNT':
      return {
        ...state,
        retryQueue: state.retryQueue.map(item =>
          item.id === action.payload
            ? { ...item, currentRetries: item.currentRetries + 1 }
            : item
        )
      };
    
    default:
      return state;
  }
};

interface ErrorContextValue {
  errors: AppError[];
  isOnline: boolean;
  
  // Error management functions
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
  resolveError: (errorId: string) => void;
  clearErrors: () => void;
  
  // API error handling
  handleApiError: (error: ApiError, context?: AppError['context']) => void;
  handleNetworkError: (error: Error, context?: AppError['context']) => void;
  
  // Retry mechanisms
  scheduleRetry: (id: string, action: () => Promise<void>, maxRetries?: number) => void;
  executeRetry: (id: string) => Promise<void>;
  
  // Utility functions
  getErrorsByType: (type: ErrorType) => AppError[];
  getUnresolvedErrors: () => AppError[];
  hasUnresolvedErrors: () => boolean;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry failed actions when coming back online
  React.useEffect(() => {
    if (state.isOnline && state.retryQueue.length > 0) {
      const retryableActions = state.retryQueue.filter(
        item => item.currentRetries < item.maxRetries
      );
      
      retryableActions.forEach(item => {
        setTimeout(() => executeRetry(item.id), 1000);
      });
    }
  }, [state.isOnline, state.retryQueue]);

  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_ERROR', payload: error });
    
    // Show appropriate toast notification
    const message = getUserFriendlyMessage(error.type, error.message);
    
    switch (error.type) {
      case 'network':
        toast.error(message, { duration: 5000, id: 'network-error' });
        break;
      case 'validation':
        toast.error(message, { duration: 4000, id: 'validation-error' });
        break;
      case 'authentication':
        toast.error(message, { duration: 6000, id: 'auth-error' });
        break;
      case 'authorization':
        toast.error(message, { duration: 4000, id: 'auth-error' });
        break;
      case 'not_found':
        toast.error(message, { duration: 3000, id: 'not-found-error' });
        break;
      case 'server':
        toast.error(message, { duration: 5000, id: 'server-error' });
        break;
      default:
        toast.error(message, { duration: 4000, id: 'general-error' });
    }
  }, []);

  const resolveError = useCallback((errorId: string) => {
    dispatch({ type: 'RESOLVE_ERROR', payload: errorId });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const handleApiError = useCallback((error: ApiError, context?: AppError['context']) => {
    let errorType: ErrorType = 'unknown';
    
    switch (error.error.code) {
      case 'VALIDATION_ERROR':
        errorType = 'validation';
        break;
      case 'AUTHENTICATION_ERROR':
        errorType = 'authentication';
        break;
      case 'NOT_FOUND':
        errorType = 'not_found';
        break;
      default:
        errorType = 'server';
    }
    
    addError({
      type: errorType,
      message: error.error.message,
      details: error.error.details,
      resolved: false,
      retryable: ['network', 'server'].includes(errorType),
      context
    });
  }, [addError]);

  const handleNetworkError = useCallback((error: Error, context?: AppError['context']) => {
    addError({
      type: 'network',
      message: error.message,
      details: { originalError: error.toString() },
      resolved: false,
      retryable: true,
      context
    });
  }, [addError]);

  const scheduleRetry = useCallback((id: string, action: () => Promise<void>, maxRetries: number = 3) => {
    dispatch({ 
      type: 'ADD_RETRY_ACTION', 
      payload: { id, action, maxRetries } 
    });
  }, []);

  const executeRetry = useCallback(async (id: string) => {
    const retryItem = state.retryQueue.find(item => item.id === id);
    if (!retryItem) return;

    if (retryItem.currentRetries >= retryItem.maxRetries) {
      dispatch({ type: 'REMOVE_RETRY_ACTION', payload: id });
      return;
    }

    try {
      await retryItem.action();
      dispatch({ type: 'REMOVE_RETRY_ACTION', payload: id });
      toast.success('Action completed successfully');
    } catch (error) {
      dispatch({ type: 'INCREMENT_RETRY_COUNT', payload: id });
      
      if (retryItem.currentRetries + 1 >= retryItem.maxRetries) {
        dispatch({ type: 'REMOVE_RETRY_ACTION', payload: id });
        toast.error('Action failed after maximum retries');
      }
    }
  }, [state.retryQueue]);

  const getErrorsByType = useCallback((type: ErrorType) => {
    return state.errors.filter(error => error.type === type);
  }, [state.errors]);

  const getUnresolvedErrors = useCallback(() => {
    return state.errors.filter(error => !error.resolved);
  }, [state.errors]);

  const hasUnresolvedErrors = useCallback(() => {
    return getUnresolvedErrors().length > 0;
  }, [getUnresolvedErrors]);

  const value: ErrorContextValue = {
    errors: state.errors,
    isOnline: state.isOnline,
    addError,
    resolveError,
    clearErrors,
    handleApiError,
    handleNetworkError,
    scheduleRetry,
    executeRetry,
    getErrorsByType,
    getUnresolvedErrors,
    hasUnresolvedErrors
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Helper function to convert technical errors to user-friendly messages
const getUserFriendlyMessage = (type: ErrorType, originalMessage: string): string => {
  switch (type) {
    case 'network':
      return 'Network connection failed. Please check your internet connection.';
    case 'validation':
      return 'Please check your input and try again.';
    case 'authentication':
      return 'Authentication failed. Please sign in again.';
    case 'authorization':
      return 'You don\'t have permission to perform this action.';
    case 'not_found':
      return 'The requested resource was not found.';
    case 'server':
      return 'Server error occurred. Please try again later.';
    default:
      return originalMessage || 'An unexpected error occurred.';
  }
};

export default ErrorProvider;