import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { SafeToSpendResponse } from '../../types';

interface FinancialHealthGaugeProps {
  data?: SafeToSpendResponse | null;
}

const FinancialHealthGauge: React.FC<FinancialHealthGaugeProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const safeToSpend = data.safe_to_spend;
  const totalBudget = safeToSpend.total_budget;
  const totalSpent = safeToSpend.total_spent;
  const dailySafeAmount = safeToSpend.daily_safe_amount;
  const daysLeftInMonth = safeToSpend.days_left_in_month;

  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;
  const remainingBudgetPercent = 100 - budgetUsedPercentage;
  
  // Determine health status
  const getHealthStatus = () => {
    if (budgetUsedPercentage <= 60) {
      return {
        status: 'Excellent! You\'re doing great!',
        mood: '😊',
        color: 'text-green-600',
        bgColor: 'from-green-400 to-green-600',
        percentage: budgetUsedPercentage
      };
    } else if (budgetUsedPercentage <= 80) {
      return {
        status: 'Good progress, stay focused!',
        mood: '🎯',
        color: 'text-blue-600',
        bgColor: 'from-blue-400 to-blue-600',
        percentage: budgetUsedPercentage
      };
    } else if (budgetUsedPercentage <= 100) {
      return {
        status: 'Watch your spending closely',
        mood: '⚠️',
        color: 'text-yellow-600',
        bgColor: 'from-yellow-400 to-yellow-600',
        percentage: budgetUsedPercentage
      };
    } else {
      return {
        status: 'Over budget - time to adjust',
        mood: '🚨',
        color: 'text-red-600',
        bgColor: 'from-red-400 to-red-600',
        percentage: 100
      };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="p-6 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -ml-16 -mt-16"></div>
      
      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {healthStatus.mood} Financial Health
          </h3>
          <p className={`text-sm font-medium ${healthStatus.color}`}>
            {healthStatus.status}
          </p>
        </motion.div>

        {/* Circular Progress */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="relative w-32 h-32 mx-auto mb-6"
        >
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <motion.path
              className={`bg-gradient-to-r ${healthStatus.bgColor}`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${healthStatus.percentage}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${healthStatus.percentage}, 100` }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-blue-400" stopColor="currentColor" />
                <stop offset="100%" className="text-blue-600" stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className={`text-2xl font-bold ${healthStatus.color}`}
              >
                {Math.round(budgetUsedPercentage)}%
              </motion.div>
              <div className="text-xs text-gray-500">Budget Used</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              ${safeToSpend.discretionary_remaining.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Safe to Spend</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              ${dailySafeAmount.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Per Day</div>
          </div>
        </motion.div>

        {/* Smart Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Smart Suggestion</span>
          </div>
          <p className="text-sm text-gray-600">
            {budgetUsedPercentage <= 70 
              ? "You have room to treat yourself occasionally." 
              : budgetUsedPercentage <= 90
              ? "Consider meal prepping to save money this week."
              : "Focus on essentials only for the rest of the month."
            }
          </p>
        </motion.div>

        {/* Month-End Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-4 p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Month-End Prediction</span>
          </div>
          <p className="text-sm text-gray-600">
            {budgetUsedPercentage <= 100 
              ? `On track to save $${(totalBudget - totalSpent).toFixed(0)} this month`
              : `Projected to exceed budget by $${(totalSpent - totalBudget).toFixed(0)}`
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialHealthGauge;
