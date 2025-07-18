/**
 * Comprehensive Error Boundary Component for EXPENSESINK
 * Provides graceful error handling with user-friendly interfaces
 */

import React, { Component, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, Bug } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'app' | 'page' | 'component' | 'critical';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableLogging?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, enableLogging = true } = this.props;
    
    this.setState({
      errorInfo
    });

    // Log error details
    if (enableLogging) {
      console.error('🚨 ErrorBoundary caught an error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        level: this.props.level || 'component',
        timestamp: new Date().toISOString()
      });
    }

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to error tracking service (in production)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, integrate with error tracking service like Sentry
    // For now, log to console and localStorage for debugging
    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level: this.props.level || 'component',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.state.retryCount
      };

      // Store in localStorage for debugging
      const existingErrors = JSON.parse(localStorage.getItem('financial_copilot_errors') || '[]');
      existingErrors.push(errorReport);
      
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      
      localStorage.setItem('financial_copilot_errors', JSON.stringify(existingErrors));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1
      });
    } else {
      // Max retries reached, reload page
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private renderErrorUI = () => {
    const { level = 'component' } = this.props;
    const { error, errorId, retryCount } = this.state;
    
    switch (level) {
      case 'app':
        return this.renderAppLevelError();
      case 'page':
        return this.renderPageLevelError();
      case 'critical':
        return this.renderCriticalError();
      default:
        return this.renderComponentLevelError();
    }
  };

  private renderAppLevelError = () => {
    const { error, errorId } = this.state;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            EXPENSESINK encountered an unexpected error. Don't worry, your data is safe.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={this.handleRetry}
              className="w-full"
              disabled={this.state.retryCount >= this.maxRetries}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={this.handleReload}
              variant="outline"
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
          
          {errorId && (
            <p className="text-xs text-gray-400 mt-4">
              Error ID: {errorId}
            </p>
          )}
        </div>
      </div>
    );
  };

  private renderPageLevelError = () => {
    const { error, errorId } = this.state;
    
    return (
      <div className="min-h-96 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Page Error
          </h2>
          
          <p className="text-gray-600 mb-6">
            This page encountered an error. Please try again.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={this.handleRetry}
              size="sm"
              disabled={this.state.retryCount >= this.maxRetries}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            
            <Button 
              onClick={this.handleGoHome}
              variant="outline"
              size="sm"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
          
          {errorId && (
            <p className="text-xs text-gray-400 mt-4">
              Error ID: {errorId}
            </p>
          )}
        </div>
      </div>
    );
  };

  private renderComponentLevelError = () => {
    const { error, errorId } = this.state;
    
    return (
      <Alert className="my-4">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>Component failed to load</span>
            <Button 
              onClick={this.handleRetry}
              size="sm"
              variant="outline"
              disabled={this.state.retryCount >= this.maxRetries}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  private renderCriticalError = () => {
    const { error, errorId } = this.state;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border border-red-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Bug className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-xl font-semibold text-red-900 mb-2">
            Critical Error
          </h1>
          
          <p className="text-red-700 mb-6">
            A critical error has occurred. Please contact support if this issue persists.
          </p>
          
          <Button 
            onClick={this.handleReload}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Reload Application
          </Button>
          
          {errorId && (
            <p className="text-xs text-red-400 mt-4">
              Error ID: {errorId}
            </p>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return fallback || this.renderErrorUI();
    }

    return children;
  }
}

export default ErrorBoundary;