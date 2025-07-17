/**
 * EXPENSESINK Dashboard Demo Data
 * Mock data for the animated dashboard carousel
 */

import { Coffee, Car, Utensils, ShoppingBag, Home } from 'lucide-react';
import { DashboardScreenData, CategoryData } from './types';

export const dashboardScreensData: DashboardScreenData[] = [
  {
    id: 'safe-to-spend',
    title: 'Safe to Spend Today',
    mainValue: '$43.20',
    subtitle: 'Based on your spending patterns',
    insight: '✨ You\'re 15% under budget this week!',
    chart: 'spending',
    color: 'green'
  },
  {
    id: 'monthly-overview',
    title: 'Monthly Overview',
    mainValue: '$1,247',
    subtitle: 'Total spending this month',
    insight: '📊 Your best month yet - great job!',
    chart: 'categories',
    color: 'blue'
  },
  {
    id: 'smart-insights',
    title: 'Smart Insights',
    mainValue: '23%',
    subtitle: 'Money saved vs last month',
    insight: '🎯 You\'re building amazing habits!',
    chart: 'trends',
    color: 'purple'
  },
  {
    id: 'budget-health',
    title: 'Budget Health',
    mainValue: 'Excellent',
    subtitle: 'Overall financial wellness',
    insight: '🚀 You\'re on track to save $500 this month!',
    chart: 'health',
    color: 'emerald'
  }
];

export const categoriesData: CategoryData[] = [
  {
    id: 'food',
    name: 'Food',
    amount: 342,
    icon: Utensils,
    color: 'bg-orange-500'
  },
  {
    id: 'transport',
    name: 'Transport',
    amount: 128,
    icon: Car,
    color: 'bg-blue-500'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    amount: 89,
    icon: Coffee,
    color: 'bg-amber-500'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    amount: 256,
    icon: ShoppingBag,
    color: 'bg-purple-500'
  },
  {
    id: 'housing',
    name: 'Housing',
    amount: 680,
    icon: Home,
    color: 'bg-green-500'
  }
];
