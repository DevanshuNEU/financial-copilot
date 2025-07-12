/**
 * Skeleton Loading Components for Financial Copilot
 * Content-aware loading placeholders that match the actual UI layout
 */

import React from 'react';
import { cn } from '../../lib/utils';

// Base skeleton component
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  animate = true 
}) => {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded',
        animate && 'animate-pulse',
        className
      )}
    />
  );
};

// Dashboard skeleton - matches the dashboard layout
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>

      {/* Recent transactions skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics skeleton - matches the analytics page
export const AnalyticsSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter controls skeleton */}
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Main chart skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-56" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Expense list skeleton
export const ExpenseListSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Budget categories skeleton
export const BudgetCategoriesSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between text-sm">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Table skeleton for data tables
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow overflow-hidden', className)}>
      {/* Table header */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile settings skeleton
export const ProfileSettingsSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Profile header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Card skeleton for general use
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
};

export default {
  Skeleton,
  DashboardSkeleton,
  AnalyticsSkeleton,
  ExpenseListSkeleton,
  BudgetCategoriesSkeleton,
  TableSkeleton,
  ProfileSettingsSkeleton,
  CardSkeleton
};