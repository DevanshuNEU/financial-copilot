/**
 * InsightsGrid Component
 * 
 * Horizontal layout for Today's Power, Financial Flow, and AI Insights
 * Replaces vertical stacking with efficient horizontal cards
 */

import React from 'react';
import { 
  Zap, 
  Waves, 
  Brain, 
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const InsightsGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Today's Power */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-green-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Today's Power</h3>
            <p className="text-sm text-gray-600">Your spending energy</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-green-600">$29.95</div>
            <div className="text-sm text-gray-600">Available today</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="font-medium">$210</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Days Left</span>
              <span className="font-medium">18</span>
            </div>
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Track Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Flow */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Waves className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Financial Flow</h3>
            <p className="text-sm text-gray-600">Your money's rhythm</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.14)}`}
                  className="text-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">14%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">$1200</div>
              <div className="text-xs text-gray-600">Total Flow</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">$170</div>
              <div className="text-xs text-gray-600">Consumed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">$399</div>
              <div className="text-xs text-gray-600">Flowing</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-purple-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-purple-600 font-medium">Smart</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Financial DNA */}
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Financial DNA</span>
            </div>
            <p className="text-sm text-purple-800">
              Your spending rhythm shows excellent financial discipline. Smart patterns suggest 128% probability of month-end surplus.
            </p>
          </div>

          {/* Activity Stream Preview */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Stream</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Netflix</div>
                  <div className="text-xs text-gray-600">Fixed Costs</div>
                </div>
                <div className="text-sm font-medium">$8.90</div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Waves className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Internet/WiFi</div>
                  <div className="text-xs text-gray-600">Fixed Costs</div>
                </div>
                <div className="text-sm font-medium">$12.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsGrid;