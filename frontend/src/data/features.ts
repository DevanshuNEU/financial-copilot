/**
 * EXPENSESINK Features Data
 * Clean, maintainable feature definitions with demo content
 */

import { Zap, Heart, Brain, Shield } from 'lucide-react';
import { FeatureData } from './types';
import React from 'react';

export const featuresData: FeatureData[] = [
  {
    id: 'instant-confidence',
    icon: Zap,
    title: 'Instant Financial Confidence',
    description: 'Know your exact safe-to-spend amount in seconds, not stress',
    benefit: 'Never wonder "Can I afford this?" again',
    color: 'from-yellow-400 to-orange-500',
    hoverColor: 'hover:border-yellow-300',
    demoContent: {
      title: 'See Your Safe Amount',
      description: 'Real-time calculation based on your actual spending patterns',
      visual: React.createElement('div', { className: 'text-center p-4' }, [
        React.createElement('div', { 
          key: 'amount',
          className: 'text-3xl font-bold text-yellow-600 mb-2' 
        }, '$43.20'),
        React.createElement('div', { 
          key: 'label',
          className: 'text-sm text-gray-600' 
        }, 'Safe to spend today'),
        React.createElement('div', { 
          key: 'bar',
          className: 'w-full bg-gray-200 rounded-full h-2 mt-3'
        }, React.createElement('div', { 
          className: 'bg-yellow-500 h-2 rounded-full animate-pulse',
          style: { width: '73%' }
        }))
      ])
    }
  },
  {
    id: 'zero-guilt',
    icon: Heart,
    title: 'Zero-Guilt Money Management',
    description: 'Encouraging insights that celebrate your progress, never shame your choices',
    benefit: 'Transform financial anxiety into confidence',
    color: 'from-pink-400 to-red-500',
    hoverColor: 'hover:border-pink-300',
    demoContent: {
      title: 'Positive Encouragement',
      description: 'We celebrate your wins, big and small',
      visual: React.createElement('div', { className: 'text-center p-4' }, [
        React.createElement('div', { 
          key: 'message',
          className: 'text-pink-600 font-semibold mb-2' 
        }, '🎉 Great job saving $12 this week!'),
        React.createElement('div', { 
          key: 'streak',
          className: 'text-sm text-gray-600' 
        }, 'You\'re on a 5-day spending streak!'),
      ])
    }
  },
  {
    id: 'ai-insights',
    icon: Brain,
    title: 'AI-Powered Smart Insights',
    description: 'Personalized recommendations that actually understand student life',
    benefit: 'Make smarter decisions automatically',
    color: 'from-purple-400 to-indigo-500',
    hoverColor: 'hover:border-purple-300',
    demoContent: {
      title: 'Smart Recommendations',
      description: 'AI insights tailored to your lifestyle',
      visual: React.createElement('div', { className: 'text-center p-4 space-y-2' }, [
        React.createElement('div', { 
          key: 'insight1',
          className: 'text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded' 
        }, '💡 Consider meal prep - save $8/week'),
        React.createElement('div', { 
          key: 'insight2',
          className: 'text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded' 
        }, '📚 Textbook rental could save $120'),
      ])
    }
  },
  {
    id: 'privacy-security',
    icon: Shield,
    title: 'Privacy-First & Secure',
    description: 'Your financial data stays private with bank-level encryption',
    benefit: 'Complete peace of mind with your money',
    color: 'from-green-400 to-teal-500',
    hoverColor: 'hover:border-green-300',
    demoContent: {
      title: 'Bank-Level Security',
      description: 'Your data is always protected and private',
      visual: React.createElement('div', { className: 'text-center p-4' }, [
        React.createElement('div', { 
          key: 'security',
          className: 'text-green-600 font-semibold mb-2' 
        }, '🔒 256-bit Encryption'),
        React.createElement('div', { 
          key: 'privacy',
          className: 'text-sm text-gray-600' 
        }, 'Zero data selling • Full privacy'),
      ])
    }
  }
];
