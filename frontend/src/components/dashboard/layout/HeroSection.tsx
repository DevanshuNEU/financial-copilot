/**
 * HeroSection Component
 * 
 * Primary section featuring spending amount and smart AI input
 * Implements 5-second rule with critical info immediately visible
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SmartAIInput } from './SmartAIInput';

export const HeroSection: React.FC = () => {
  // TODO: Replace with real data from context
  const spendingData = {
    available: 399,
    total: 1200,
    velocity: 0.3,
    trend: 'up' as const
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left Side - Spending Amount (Hero) */}
      <div className="space-y-6">
        {/* Main Spending Amount */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-6xl font-bold text-gray-900">
              {formatCurrency(spendingData.available)}
            </h1>
            <div className={`flex items-center space-x-1 ${
              spendingData.trend === 'up' ? 'text-green-600' : 'text-red-500'
            }`}>
              {spendingData.trend === 'up' ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
            </div>
          </div>
          
          <p className="text-lg text-gray-600">
            available from your {formatCurrency(spendingData.total)} monthly flow
          </p>
        </div>

        {/* Spending Velocity */}
        <div className="inline-flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-medium">
            {spendingData.velocity}x Spending Velocity
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-gray-900">14%</div>
            <div className="text-sm text-gray-600">consumed</div>
          </div>
          <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-gray-900">18</div>
            <div className="text-sm text-gray-600">days left</div>
          </div>
        </div>
      </div>

      {/* Right Side - Smart AI Input */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Log your expenses
          </h2>
          <p className="text-gray-600">
            Just type naturally - I'll handle the rest!
          </p>
        </div>
        
        <SmartAIInput />
      </div>
    </section>
  );
};

export default HeroSection;