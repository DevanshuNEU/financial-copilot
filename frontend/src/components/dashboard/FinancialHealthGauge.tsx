import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

interface FinancialHealthGaugeProps {
  safeToSpend: number;
  totalBudget: number;
  totalSpent: number;
  daysLeftInMonth: number;
  dailySafeAmount: number;
  monthlyTrend?: number; // Percentage change from last month
}

const FinancialHealthGauge: React.FC<FinancialHealthGaugeProps> = ({
  safeToSpend,
  totalBudget,
  totalSpent,
  daysLeftInMonth,
  dailySafeAmount,
  monthlyTrend = 0,
}) => {
  // Calculate health metrics
  const budgetUsedPercent = (totalSpent / totalBudget) * 100;
  const remainingBudgetPercent = Math.max(0, 100 - budgetUsedPercent);
  
  // Determine financial health status
  const getHealthStatus = () => {
    if (budgetUsedPercent <= 70) return 'excellent';
    if (budgetUsedPercent <= 85) return 'good';
    if (budgetUsedPercent <= 100) return 'caution';
    return 'over';
  };

  const healthStatus = getHealthStatus();

  const getHealthConfig = () => {
    switch (healthStatus) {
      case 'excellent':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-500',
          lightBg: 'bg-green-50',
          emoji: '😊',
          message: 'Excellent! You\'re doing great!',
          suggestion: 'You have room to treat yourself occasionally.',
        };
      case 'good':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-500',
          lightBg: 'bg-blue-50',
          emoji: '🎯',
          message: 'Good progress! Stay on track.',
          suggestion: 'Continue your current spending habits.',
        };
      case 'caution':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-500',
          lightBg: 'bg-yellow-50',
          emoji: '⚠️',
          message: 'Be mindful of your spending.',
          suggestion: 'Consider reducing non-essential expenses.',
        };
      default:
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-500',
          lightBg: 'bg-red-50',
          emoji: '🚨',
          message: 'Over budget - time to adjust.',
          suggestion: 'Focus on essential expenses only.',
        };
    }
  };

  const config = getHealthConfig();

  // Calculate circular progress for the gauge
  const gaugePercent = Math.min(budgetUsedPercent, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (gaugePercent / 100) * circumference;

  const getPrediction = () => {
    if (daysLeftInMonth <= 0) return "Month ending soon!";
    
    const currentPace = totalSpent / (30 - daysLeftInMonth);
    const projectedMonthEnd = currentPace * 30;
    const projectedRemaining = totalBudget - projectedMonthEnd;
    
    if (projectedRemaining > 0) {
      return `On track to save $${projectedRemaining.toFixed(0)} this month`;
    } else {
      return `May exceed budget by $${Math.abs(projectedRemaining).toFixed(0)}`;
    }
  };

  return (
    <Card className={`${config.lightBg} border-l-4 border-l-current ${config.color}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-2xl">{config.emoji}</span>
            Financial Health
          </span>
          {monthlyTrend !== 0 && (
            <div className={`flex items-center gap-1 text-sm ${
              monthlyTrend > 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {monthlyTrend > 0 ? 
                <TrendingUp className="h-4 w-4" /> : 
                <TrendingDown className="h-4 w-4" />
              }
              {Math.abs(monthlyTrend).toFixed(0)}% vs last month
            </div>
          )}
        </CardTitle>
        <CardDescription className={config.color}>
          {config.message}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Circular Gauge */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ease-out ${config.color.replace('text-', 'text-')}`}
                style={{
                  strokeDashoffset,
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-2xl font-bold ${config.color}`}>
                {gaugePercent.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">Budget Used</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${safeToSpend.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Safe to Spend</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${dailySafeAmount.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Per Day</div>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Smart Suggestion</div>
              <div className="text-sm text-gray-600">{config.suggestion}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Month-End Prediction</div>
              <div className="text-sm text-gray-600">{getPrediction()}</div>
            </div>
          </div>

          {daysLeftInMonth > 0 && (
            <div className="text-center p-2 bg-white rounded-lg border">
              <div className="text-xs text-gray-500">
                {daysLeftInMonth} days left in month
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialHealthGauge;