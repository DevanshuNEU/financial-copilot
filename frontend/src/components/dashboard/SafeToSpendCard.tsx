import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeToSpendResponse } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface SafeToSpendCardProps {
  data: SafeToSpendResponse | null;
}

const SafeToSpendCard: React.FC<SafeToSpendCardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const safeToSpend = data.safe_to_spend;
  const isOverBudget = safeToSpend.total_spent > safeToSpend.total_budget;
  const remainingBudget = safeToSpend.total_budget - safeToSpend.total_spent;
  const budgetUsedPercentage = (safeToSpend.total_spent / safeToSpend.total_budget) * 100;

  // Determine status and color
  const getStatusInfo = () => {
    if (budgetUsedPercentage <= 60) {
      return {
        status: "on track",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
        badge: "success"
      };
    } else if (budgetUsedPercentage <= 90) {
      return {
        status: "good pace",
        color: "text-blue-600", 
        bgColor: "bg-blue-50",
        icon: TrendingUp,
        badge: "warning"
      };
    } else if (budgetUsedPercentage <= 100) {
      return {
        status: "watch closely",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50", 
        icon: AlertCircle,
        badge: "warning"
      };
    } else {
      return {
        status: "over budget",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: TrendingDown,
        badge: "destructive"
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100 to-transparent rounded-full -mr-16 -mt-16"></div>
      
      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Safe to Spend</h3>
              <p className="text-sm text-gray-500">Money available for discretionary spending this month</p>
            </div>
          </div>
          <Badge variant={statusInfo.badge as any} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.status}
          </Badge>
        </motion.div>

        {/* Main Amount */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="text-center mb-6"
        >
          <div className={`text-4xl md:text-5xl font-bold ${statusInfo.color} mb-2`}>
            ${Math.max(0, remainingBudget).toFixed(2)}
          </div>
          <p className="text-gray-600">
            {isOverBudget ? 'Over budget this month' : 'Available for fun stuff this month'}
          </p>
        </motion.div>

        {/* Daily breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-sm text-gray-500 mb-1">Today you can spend:</p>
          <div className="text-2xl font-bold text-blue-600">
            ${safeToSpend.daily_safe_amount.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500">Based on {safeToSpend.days_left_in_month} days left this month</p>
        </motion.div>

        {/* Budget breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100"
        >
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="font-semibold text-gray-900">${safeToSpend.total_budget.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
              ${safeToSpend.total_spent.toFixed(2)}
            </p>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-4"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Budget used</span>
            <span className={`text-xs font-medium ${statusInfo.color}`}>
              {budgetUsedPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              transition={{ delay: 1.2, duration: 1 }}
              className={`h-2 rounded-full ${
                budgetUsedPercentage <= 60 ? 'bg-green-500' :
                budgetUsedPercentage <= 90 ? 'bg-blue-500' :
                budgetUsedPercentage <= 100 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SafeToSpendCard;
