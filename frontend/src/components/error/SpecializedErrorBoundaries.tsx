/**
 * Specialized Error Boundary Components for Different Application Contexts
 */

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { toast } from 'react-hot-toast';

interface SpecializedErrorBoundaryProps {
  children: ReactNode;
}

// App-level error boundary - wraps the entire application
export const AppErrorBoundary: React.FC<SpecializedErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log critical app errors
    console.error('🚨 CRITICAL APP ERROR:', error);
    
    // Report to error tracking service
    // In production, integrate with Sentry, LogRocket, etc.
    
    // Show user-friendly notification
    toast.error('Application encountered a critical error. Please reload the page.', {
      duration: 8000,
      id: 'app-error'
    });
  };

  return (
    <ErrorBoundary 
      level="app"
      onError={handleError}
      enableLogging={true}
    >
      {children}
    </ErrorBoundary>
  );
};

// Page-level error boundary - wraps individual pages
export const PageErrorBoundary: React.FC<SpecializedErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('🚨 PAGE ERROR:', error);
    
    toast.error('Page encountered an error. Please try again.', {
      duration: 5000,
      id: 'page-error'
    });
  };

  return (
    <ErrorBoundary 
      level="page"
      onError={handleError}
      enableLogging={true}
    >
      {children}
    </ErrorBoundary>
  );
};

// Component-level error boundary - wraps individual components
export const ComponentErrorBoundary: React.FC<SpecializedErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('🚨 COMPONENT ERROR:', error);
    
    toast.error('Component failed to load', {
      duration: 3000,
      id: 'component-error'
    });
  };

  return (
    <ErrorBoundary 
      level="component"
      onError={handleError}
      enableLogging={true}
    >
      {children}
    </ErrorBoundary>
  );
};

// Critical error boundary - for critical operations like auth and data
export const CriticalErrorBoundary: React.FC<SpecializedErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('🚨 CRITICAL ERROR:', error);
    
    // For critical errors, we might want to:
    // 1. Log out the user
    // 2. Clear application state
    // 3. Force reload
    
    toast.error('Critical system error occurred. Application will reload.', {
      duration: 10000,
      id: 'critical-error'
    });
  };

  return (
    <ErrorBoundary 
      level="critical"
      onError={handleError}
      enableLogging={true}
    >
      {children}
    </ErrorBoundary>
  );
};

// Form error boundary - specifically for form components
export const FormErrorBoundary: React.FC<SpecializedErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('🚨 FORM ERROR:', error);
    
    toast.error('Form encountered an error. Please try again.', {
      duration: 4000,
      id: 'form-error'
    });
  };

  return (
    <ErrorBoundary 
      level="component"
      onError={handleError}
      enableLogging={true}
    >
      {children}
    </ErrorBoundary>
  );
};

export default {
  AppErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary,
  CriticalErrorBoundary,
  FormErrorBoundary
};