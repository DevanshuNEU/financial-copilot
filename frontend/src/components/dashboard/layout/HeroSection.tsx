/**
 * HeroSection Component - RESEARCH-BACKED VERSION
 * 
 * Features:
 * - Real financial data display with trend indicators
 * - Student-friendly context and language
 * - Cognitive load optimization (single primary focus)
 * - Smart welcome messaging based on time/data
 */

import React, { useMemo } from 'react';
import { SmartAIInput } from './SmartAIInput';
import { useAppData } from '../../../contexts/AppDataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingSpinner } from '../../loading';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { appData } = useAppData();
  const { user } = useAuth();

  // Get user's first name for personalization
  const getFirstName = () => {
    return appData.user?.firstName || user?.email?.split('@')[0] || 'Student';
  };

  // Smart welcome message based on time and financial status
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const name = getFirstName();
    
    if (hour >= 5 && hour < 12) {
      return `Good morning, ${name}`;
    } else if (hour >= 12 && hour < 17) {
      return `Good afternoon, ${name}`;
    } else if (hour >= 17 && hour < 22) {
      return `Good evening, ${name}`;
    } else {
      return `Hey ${name}`;
    }
  };

  // Calculate financial metrics and trends
  const financialInsights = useMemo(() => {
    const safeData = appData.safeToSpendData;
    const totalSpent = appData.totalSpent || 0;
    
    if (!safeData) {
      return {
        available: 0,
        context: 'Setting up your budget...',
        trend: null,
        status: 'loading',
        confidence: 0
      };
    }

    const available = safeData.availableAmount || 0;
    const totalBudget = safeData.totalBudget || 0;
    const dailyAmount = safeData.dailySafeAmount || 0;
    
    // Calculate spending velocity and trend
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const monthProgress = dayOfMonth / daysInMonth;
    const expectedSpent = totalBudget * monthProgress;
    const spendingVelocity = totalSpent / expectedSpent;
    
    // Determine status and trend
    let status: 'healthy' | 'warning' | 'danger' = 'healthy';
    let trend: 'up' | 'down' | 'stable' | null = null;
    let context = '';
    let confidence = 0;

    if (available <= 0) {
      status = 'danger';
      trend = 'down';
      context = 'Budget exceeded - time to be careful';
      confidence = 95;
    } else if (available < dailyAmount * 3) {
      status = 'warning';
      trend = 'down';
      context = 'Running low - watch your spending';
      confidence = 80;
    } else if (spendingVelocity < 0.8) {
      status = 'healthy';
      trend = 'up';
      context = 'Great job staying on track!';
      confidence = 90;
    } else if (spendingVelocity > 1.2) {
      status = 'warning';
      trend = 'down';
      context = 'Spending faster than planned';
      confidence = 85;
    } else {
      status = 'healthy';
      trend = 'stable';
      context = 'You\'re doing well this month';
      confidence = 75;
    }

    // Student-friendly context messages
    const studentContexts = {
      morning: {
        healthy: 'You\'re set for a great day!',
        warning: 'Maybe skip that extra coffee today?',
        danger: 'Time to be extra careful with spending'
      },
      afternoon: {
        healthy: 'Lunch budget looking good',
        warning: 'Consider a cheaper lunch option',
        danger: 'Pack a lunch to save money'
      },
      evening: {
        healthy: 'Room in budget for dinner out',
        warning: 'Maybe cook tonight?',
        danger: 'Ramen night it is!'
      }
    };

    const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';
    const timeSpecificContext = studentContexts[timeOfDay][status];

    return {
      available,
      context: totalBudget > 0 ? `Safe to spend ${timeSpecificContext.toLowerCase()}` : 'Setting up your financial plan...',
      trend,
      status,
      confidence,
      totalBudget,
      dailyAmount
    };
  }, [appData.safeToSpendData, appData.totalSpent]);

  // Get trend icon and styling
  const getTrendDisplay = () => {
    const { trend, status } = financialInsights;
    
    if (!trend) return null;

    const trendConfig = {
      up: { 
        icon: TrendingUp, 
        color: 'text-green-500', 
        bgColor: 'bg-green-50',
        label: 'On track' 
      },
      down: { 
        icon: TrendingDown, 
        color: status === 'danger' ? 'text-red-500' : 'text-orange-500',
        bgColor: status === 'danger' ? 'bg-red-50' : 'bg-orange-50',
        label: status === 'danger' ? 'Over budget' : 'Watch out'
      },
      stable: { 
        icon: Minus, 
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        label: 'Steady'
      }
    };

    const config = trendConfig[trend];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${config.bgColor}`}>
        <IconComponent className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    );
  };

  return (
    <section className="text-center space-y-6">
      {/* Clean welcome */}
      <div className="text-gray-600">
        <span className="font-medium">{getWelcomeMessage()}</span>
      </div>

      {/* Hero Amount Display - CLEAN & MINIMAL */}
      <div className="space-y-4">
        {appData.loading ? (
          <div className="flex items-center justify-center space-x-4">
            <LoadingSpinner size="lg" />
            <h1 className="text-4xl font-semibold text-gray-400">Loading...</h1>
          </div>
        ) : appData.error ? (
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-gray-400 mb-2">$---</h1>
            <p className="text-red-500 text-sm">Unable to load data</p>
          </div>
        ) : (
          <>
            {/* Main Amount - Properly sized */}
            <div className="flex items-center justify-center space-x-3">
              <h1 className="text-5xl md:text-6xl font-light text-gray-900 leading-none">
                ${financialInsights.available.toFixed(0)}
              </h1>
              {getTrendDisplay()}
            </div>
          </>
        )}
      </div>

      {/* Smart AI Input with Full Functionality */}
      <div className="max-w-2xl mx-auto">
        <SmartAIInput />
      </div>

      {/* Simple 3-stat summary - ESSENTIAL ONLY */}
      {!appData.loading && !appData.error && (financialInsights.totalBudget || 0) > 0 && (
        <div className="flex justify-center space-x-12 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900">${appData.totalSpent?.toFixed(0) || '0'}</div>
            <div className="text-gray-500">Spent</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">${financialInsights.available.toFixed(0)}</div>
            <div className="text-gray-500">Available</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {Math.max(0, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate())}
            </div>
            <div className="text-gray-500">Days left</div>
          </div>
        </div>
      )}
    </section>
  );
};