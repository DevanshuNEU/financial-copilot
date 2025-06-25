import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SafeToSpendResponse } from '../../types';
import { OnboardingData, PersonalizedSafeToSpend, onboardingService } from '../../services/onboarding';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface SafeToSpendCardProps {
  data: SafeToSpendResponse | null;
  personalizedData?: PersonalizedSafeToSpend | null;
  onboardingData?: OnboardingData | null;
}

const SafeToSpendCard: React.FC<SafeToSpendCardProps> = ({ data, personalizedData, onboardingData }) => {
  // Use personalized data if available, otherwise fall back to API data
  const usePersonalized = personalizedData && onboardingData;
  const currencySymbol = onboardingData ? onboardingService.getCurrencySymbol(onboardingData.currency) : '$';
  
  if (!data && !usePersonalized) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // Calculate values based on data source
  let totalBudget: number;
  let totalSpent: number;
  let dailySafeAmount: number;
  let daysLeft: number;
  let budgetUsedPercentage: number;
  let remainingBudget: number;
  
  if (usePersonalized) {
    // Use personalized calculations
    totalBudget = personalizedData!.totalBudget;
    totalSpent = personalizedData!.totalFixedCosts; // For now, just show fixed costs as "spent"
    remainingBudget = personalizedData!.availableForSpending;
    dailySafeAmount = personalizedData!.dailySafeAmount;
    daysLeft = personalizedData!.daysLeftInMonth;
    budgetUsedPercentage = (totalSpent / totalBudget) * 100;
  } else {
    // Use API data
    const safeToSpendData = data!.safe_to_spend;
    totalBudget = safeToSpendData.total_budget;
    totalSpent = safeToSpendData.total_spent;
    remainingBudget = safeToSpendData.total_budget - safeToSpendData.total_spent;
    dailySafeAmount = safeToSpendData.daily_safe_amount;
    daysLeft = safeToSpendData.days_left_in_month;
    budgetUsedPercentage = (safeToSpendData.total_spent / safeToSpendData.total_budget) * 100;
  }

  const isOverBudget = totalSpent > totalBudget;

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-8 h-full bg-gradient-to-br from-white to-green-50/20 relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100/10 to-transparent rounded-full -mr-12 -mt-12"></div>
      
      <div className="relative h-full flex flex-col justify-between">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Safe to Spend</h3>
              <p className="text-sm text-gray-600">Available for discretionary spending</p>
            </div>
          </div>
          <Badge variant={statusInfo.badge as any} className="flex items-center gap-1.5 text-xs font-medium">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.status}
          </Badge>
        </motion.div>

        {/* Main Amount - Clean and Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className={`text-4xl font-bold ${statusInfo.color} mb-2`}>
            {currencySymbol}{Math.max(0, remainingBudget).toFixed(2)}
          </div>
          <p className="text-gray-600 text-sm">
            {usePersonalized 
              ? isOverBudget 
                ? '⚠️ Budget tight - watch spending' 
                : '🎉 Available for fun stuff'
              : isOverBudget 
                ? '⚠️ Over budget this month' 
                : '🎉 Available for fun stuff'
            }
          </p>
          {usePersonalized && onboardingData?.hasMealPlan && (
            <p className="text-xs text-green-600 mt-1">
              🍕 Meal plan helping keep food costs down!
            </p>
          )}
        </motion.div>

        {/* Daily Breakdown - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mb-6 p-4 bg-white/50 rounded-lg border border-gray-100/50"
        >
          <p className="text-sm text-gray-600 mb-1 font-medium">
            {usePersonalized ? 'You can spend today' : 'Today you can spend'}
          </p>
          <div className="text-2xl font-bold text-blue-600">
            {currencySymbol}{dailySafeAmount.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on {daysLeft} days remaining
          </p>
        </motion.div>

        {/* Budget Breakdown - Clean Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="text-center p-3 bg-gray-50/50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">
              {usePersonalized ? 'Monthly Budget' : 'Total Budget'}
            </p>
            <p className="font-bold text-gray-900">{currencySymbol}{totalBudget.toFixed(2)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50/50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">
              {usePersonalized ? 'Fixed Costs' : 'Total Spent'}
            </p>
            <p className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
              {currencySymbol}{totalSpent.toFixed(2)}
            </p>
          </div>
        </motion.div>

        {/* Clean Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">Budget used</span>
            <span className={`text-sm font-bold ${statusInfo.color}`}>
              {budgetUsedPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
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