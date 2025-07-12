/**
 * Advanced Loading Components for Financial Copilot
 * Beautiful, responsive loading indicators with smooth animations
 */

import React from 'react';
import { Loader2, TrendingUp, DollarSign, BarChart3, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';

// Loading Spinner with customizable size and color
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    accent: 'text-green-600',
    muted: 'text-gray-400'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

// Financial-themed loading spinner
interface FinancialLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FinancialLoadingSpinner: React.FC<FinancialLoadingSpinnerProps> = ({ 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 animate-spin">
        <div className="flex items-center justify-center w-full h-full">
          <DollarSign className={cn('text-green-600', sizeClasses[size])} />
        </div>
      </div>
      <div className="absolute inset-0 animate-pulse">
        <div className="w-full h-full rounded-full border-2 border-blue-200"></div>
      </div>
    </div>
  );
};

// Loading dots animation
interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'md',
  color = 'primary',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    accent: 'bg-green-600'
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

// Progress bar with percentage
interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'primary',
  showPercentage = true,
  animated = true,
  className
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    accent: 'bg-purple-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
    </div>
  );
};

// Circular progress indicator
interface CircularProgressProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  thickness?: number;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 'md',
  color = 'primary',
  showPercentage = true,
  thickness = 4,
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'stroke-blue-600',
    secondary: 'stroke-gray-600',
    accent: 'stroke-purple-600',
    success: 'stroke-green-600',
    warning: 'stroke-yellow-600',
    error: 'stroke-red-600'
  };

  const radius = 50 - thickness;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-300 ease-out', colorClasses[color])}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Pulsing loader for content areas
interface PulsingLoaderProps {
  lines?: number;
  className?: string;
}

export const PulsingLoader: React.FC<PulsingLoaderProps> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Financial data loading placeholder
export const FinancialDataLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  FinancialLoadingSpinner,
  LoadingDots,
  ProgressBar,
  CircularProgress,
  PulsingLoader,
  FinancialDataLoader
};