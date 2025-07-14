/**
 * InsightsGrid Component - COGNITIVE LOAD OPTIMIZED
 * 
 * Research-backed design featuring:
 * - Maximum 3 key metrics (prevents cognitive overload)
 * - Student-focused financial indicators
 * - Real data integration with smart categorization
 * - Working navigation and quick actions
 */

import React, { useMemo } from 'react';
import { 
  DollarSign, 
  Target,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Gamepad2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../contexts/AppDataContext';
import { LoadingSpinner } from '../../loading';

export const InsightsGrid: React.FC = () => {
  const navigate = useNavigate();
  const { appData } = useAppData();

  // Calculate student-focused financial metrics
  const studentMetrics = useMemo(() => {
    const safeData = appData.safeToSpendData;
    const totalSpent = appData.totalSpent || 0;
    const expenses = appData.expenses || [];
    
    if (!safeData) {
      return {
        weeklyBudget: 0,
        monthlyHealth: 0,
        spendingStreak: 0,
        isLoading: true
      };
    }

    // Calculate weekly budget (more relevant for students)
    const weeklyBudget = (safeData.dailySafeAmount || 0) * 7;
    
    // Calculate monthly health score
    const totalBudget = safeData.totalBudget || 0;
    const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthProgress = (now.getDate() / lastDay.getDate()) * 100;
    const healthScore = Math.max(0, Math.min(100, 100 - (budgetUsedPercentage - monthProgress)));
    
    // Calculate spending streak (days with tracked expenses)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    
    const spendingStreak = last7Days.filter(date => 
      expenses.some(expense => expense.date === date)
    ).length;

    return {
      weeklyBudget,
      monthlyHealth: healthScore,
      spendingStreak,
      isLoading: false
    };
  }, [appData.safeToSpendData, appData.totalSpent, appData.expenses]);

  // Get category icon with student-specific categories
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      'Food': Coffee,
      'Transportation': Car,
      'Housing': Home,
      'Entertainment': Gamepad2,
      'Shopping': ShoppingBag,
      'Education': Target,
      'Other': DollarSign
    };
    return iconMap[category] || DollarSign;
  };

  // Get last 3 transactions with smart insights
  const recentTransactions = useMemo(() => {
    const recent = appData.expenses.slice(-3).reverse();
    
    return recent.map(expense => {
      const IconComponent = getCategoryIcon(expense.category);
      const isToday = expense.date === new Date().toISOString().split('T')[0];
      const isYesterday = expense.date === new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let timeLabel = expense.date;
      if (isToday) timeLabel = 'Today';
      else if (isYesterday) timeLabel = 'Yesterday';
      
      return {
        ...expense,
        icon: IconComponent,
        timeLabel
      };
    });
  }, [appData.expenses]);

  return (
    <div className="space-y-8">
      {/* Two Essential Metrics - MINIMAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        
        {/* Health Score */}
        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <h3 className="text-green-800 font-medium mb-2">Health Score</h3>
          <div className="text-3xl font-light text-green-700 mb-1">
            {studentMetrics.isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              `${Math.round(studentMetrics.monthlyHealth)}%`
            )}
          </div>
          <p className="text-green-600 text-sm">Budget wellness</p>
        </div>

        {/* Tracking Streak */}
        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <h3 className="text-blue-800 font-medium mb-2">Tracking Streak</h3>
          <div className="text-3xl font-light text-blue-700 mb-1">
            {studentMetrics.isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              studentMetrics.spendingStreak
            )}
          </div>
          <p className="text-blue-600 text-sm">
            {studentMetrics.spendingStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Recent Activity - CLEAN */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <button 
            onClick={() => navigate('/expenses')}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {appData.loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.timeLabel}</div>
                </div>
                <div className="font-medium text-gray-900">${transaction.amount.toFixed(0)}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium">No expenses yet</p>
              <p className="text-sm">Start tracking above!</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {appData.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Unable to load financial data</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{appData.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-red-600 text-sm hover:underline mt-2"
          >
            Try refreshing the page
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightsGrid;