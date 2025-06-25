import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target } from 'lucide-react';
import { SafeToSpendResponse } from '../../types';

interface FinancialHealthGaugeProps {
  data?: SafeToSpendResponse | null;
}

const FinancialHealthGauge: React.FC<FinancialHealthGaugeProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const safeToSpend = data.safe_to_spend;
  const totalBudget = safeToSpend.total_budget;
  const totalSpent = safeToSpend.total_spent;
  const dailySafeAmount = safeToSpend.daily_safe_amount;

  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;
  
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-8 h-full bg-gradient-to-br from-white to-blue-50/20 relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-100/10 to-transparent rounded-full -ml-12 -mt-12"></div>
      
      <div className="relative h-full flex flex-col justify-between">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-11 h-11 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Financial Health</h3>
            <p className="text-sm text-gray-600">{healthStatus.mood} {healthStatus.status}</p>
          </div>
        </motion.div>

        {/* Clean Circular Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={budgetUsedPercentage <= 60 ? '#10b981' : budgetUsedPercentage <= 90 ? '#3b82f6' : budgetUsedPercentage <= 100 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${healthStatus.percentage}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${healthStatus.percentage}, 100` }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className={`text-2xl font-bold ${healthStatus.color} mb-1`}>
                  {Math.round(budgetUsedPercentage)}%
                </div>
                <div className="text-xs text-gray-600 font-medium">Budget Used</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Clean Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="text-center p-3 bg-white/50 rounded-lg border border-green-100/50">
            <div className="text-xl font-bold text-green-600">
              ${safeToSpend.discretionary_remaining.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Safe to Spend</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg border border-blue-100/50">
            <div className="text-xl font-bold text-blue-600">
              ${dailySafeAmount.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Per Day</div>
          </div>
        </motion.div>

        {/* Smart Suggestion - Condensed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="p-4 bg-gray-50/50 rounded-lg space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <Target className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">💡 Smart Suggestion</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {budgetUsedPercentage <= 70 
              ? "🎉 You have room to treat yourself occasionally! Your spending is well-controlled." 
              : budgetUsedPercentage <= 90
              ? "🥗 Consider meal prepping to save money this week and stay on track."
              : "⚠️ Focus on essentials only for the rest of the month to stay within budget."
            }
          </p>
          
          {/* Month-End Prediction - Integrated */}
          <div className="pt-2 border-t border-gray-200/60">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-semibold text-gray-900">📈 Month-End Prediction</span>
            </div>
            <p className="text-xs text-gray-600">
              {budgetUsedPercentage <= 100 
                ? `🎯 On track to save $${(totalBudget - totalSpent).toFixed(0)} this month!`
                : `🚨 Projected to exceed budget by $${(totalSpent - totalBudget).toFixed(0)}.`
              }
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinancialHealthGauge;