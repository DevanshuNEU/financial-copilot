/**
 * Enhanced Domain Types with Strict Type Safety
 */

// Brand types for better type safety
export type UserId = string & { readonly brand: 'UserId' };
export type ExpenseId = string & { readonly brand: 'ExpenseId' };
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'INR';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';
export type CategoryName = 'Food' | 'Transportation' | 'Housing' | 'Entertainment' | 'Shopping' | 'Other';

// Enhanced User Interface
export interface User {
  readonly id: UserId;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly preferences: UserPreferences;
  readonly profile: UserProfile;
}

export interface UserPreferences {
  readonly currency: Currency;
  readonly notifications: NotificationSettings;
  readonly theme: 'light' | 'dark' | 'system';
  readonly language: string;
}

export interface NotificationSettings {
  readonly budgetWarnings: boolean;
  readonly dailySummaries: boolean;
  readonly weeklyReports: boolean;
  readonly monthlyReports: boolean;
}

export interface UserProfile {
  readonly studentType: 'international' | 'domestic';
  readonly university?: string;
  readonly graduationYear?: number;
  readonly major?: string;
  readonly timezone: string;
}

// Enhanced Expense Interface
export interface Expense {
  readonly id: ExpenseId;
  readonly amount: number;
  readonly category: CategoryName;
  readonly description: string;
  readonly vendor?: string;
  readonly status: ExpenseStatus;
  readonly date: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly userId: UserId;
  readonly metadata?: ExpenseMetadata;
}

export interface ExpenseMetadata {
  readonly location?: {
    readonly latitude: number;
    readonly longitude: number;
    readonly address?: string;
  };
  readonly paymentMethod?: 'cash' | 'card' | 'digital_wallet' | 'bank_transfer';
  readonly receipt?: {
    readonly url: string;
    readonly ocrText?: string;
  };
  readonly isRecurring?: boolean;
  readonly recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// Enhanced Budget Interface
export interface Budget {
  readonly id: string;
  readonly category: CategoryName;
  readonly monthlyLimit: number;
  readonly currency: Currency;
  readonly userId: UserId;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly isActive: boolean;
  readonly rolloverUnused: boolean;
}

export interface BudgetStatus {
  readonly category: CategoryName;
  readonly limit: number;
  readonly spent: number;
  readonly remaining: number;
  readonly overBudget: number;
  readonly percentageUsed: number;
  readonly daysRemaining: number;
  readonly averageDailySpend: number;
  readonly projectedMonthEnd: number;
  readonly status: 'on_track' | 'caution' | 'over_budget';
}
