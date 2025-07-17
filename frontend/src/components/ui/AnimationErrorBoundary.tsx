import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Graceful Error Boundary for Animation Components
 * Prevents the entire app from crashing if animations fail
 */
class AnimationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Animation Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fallback UI - show content without animations
      return (
        this.props.fallback || (
          <div className="animate-none">
            {this.props.children}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default AnimationErrorBoundary;
