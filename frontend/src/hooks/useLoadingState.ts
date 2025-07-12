/**
 * Loading States Management Hook
 * Centralized loading state management for the entire application
 */

import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  error?: string;
  data?: any;
}

export interface LoadingStateWithId extends LoadingState {
  id: string;
}

// Loading manager hook
export const useLoadingState = (initialState: LoadingState = { isLoading: false }) => {
  const [state, setState] = useState<LoadingState>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setLoading = useCallback((isLoading: boolean, message?: string, progress?: number) => {
    setState(prev => ({
      ...prev,
      isLoading,
      message,
      progress,
      error: isLoading ? undefined : prev.error
    }));
  }, []);

  const setProgress = useCallback((progress: number, message?: string) => {
    setState(prev => ({
      ...prev,
      progress,
      message: message || prev.message
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      progress: undefined
    }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({
      ...prev,
      data,
      isLoading: false,
      error: undefined
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startLoading = useCallback((message?: string) => {
    setLoading(true, message);
  }, [setLoading]);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return {
    state,
    isLoading: state.isLoading,
    message: state.message,
    progress: state.progress,
    error: state.error,
    data: state.data,
    setLoading,
    setProgress,
    setError,
    setData,
    reset,
    startLoading,
    stopLoading
  };
};

// Multiple loading states manager
export const useMultipleLoadingStates = () => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});

  const setLoadingState = useCallback((id: string, state: Partial<LoadingState>) => {
    setStates(prev => ({
      ...prev,
      [id]: { ...prev[id], ...state }
    }));
  }, []);

  const startLoading = useCallback((id: string, message?: string) => {
    setLoadingState(id, { isLoading: true, message, error: undefined });
  }, [setLoadingState]);

  const stopLoading = useCallback((id: string) => {
    setLoadingState(id, { isLoading: false });
  }, [setLoadingState]);

  const setProgress = useCallback((id: string, progress: number, message?: string) => {
    setLoadingState(id, { progress, message });
  }, [setLoadingState]);

  const setError = useCallback((id: string, error: string) => {
    setLoadingState(id, { isLoading: false, error });
  }, [setLoadingState]);

  const getState = useCallback((id: string): LoadingState => {
    return states[id] || { isLoading: false };
  }, [states]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(states).some(state => state.isLoading);
  }, [states]);

  return {
    states,
    setLoadingState,
    startLoading,
    stopLoading,
    setProgress,
    setError,
    getState,
    isAnyLoading
  };
};

// Async operation wrapper with loading states
export const useAsyncOperation = <T = any>() => {
  const { state, setLoading, setError, setData, reset } = useLoadingState();

  const execute = useCallback(async (
    operation: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      showToast?: boolean;
    }
  ): Promise<T | null> => {
    const {
      loadingMessage = 'Loading...',
      successMessage,
      errorMessage,
      showToast = true
    } = options || {};

    try {
      setLoading(true, loadingMessage);
      const result = await operation();
      setData(result);
      
      if (showToast && successMessage) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMsg);
      
      if (showToast) {
        toast.error(errorMessage || errorMsg);
      }
      
      return null;
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    execute,
    reset
  };
};

// Form submission loading state
export const useFormLoadingState = () => {
  const { state, setLoading, setError, setData, reset } = useLoadingState();

  const submitForm = useCallback(async <T>(
    submitFn: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      resetOnSuccess?: boolean;
    }
  ): Promise<T | null> => {
    const {
      loadingMessage = 'Submitting...',
      successMessage = 'Form submitted successfully!',
      resetOnSuccess = true
    } = options || {};

    try {
      setLoading(true, loadingMessage);
      const result = await submitFn();
      setData(result);
      
      toast.success(successMessage);
      
      if (resetOnSuccess) {
        setTimeout(() => reset(), 1000);
      }
      
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Form submission failed';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    }
  }, [setLoading, setError, setData, reset]);

  return {
    ...state,
    submitForm,
    reset
  };
};

export default {
  useLoadingState,
  useMultipleLoadingStates,
  useAsyncOperation,
  useFormLoadingState
};