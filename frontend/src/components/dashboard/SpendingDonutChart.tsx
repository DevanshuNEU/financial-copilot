import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CategoryData {
  category: string;
  total: number;
  count: number;
  budget?: number;
  lastWeekTotal?: number;
}

interface SpendingDonutChartProps {
  data: CategoryData[];
  totalSpent: number;
  totalBudget: number;
}

// Student-friendly color palette
const COLORS = [
  '#3B82F6', // Blue - Meals
  '#10B981', // Green - Transport
  '#F59E0B', // Orange - Entertainment
  '#8B5CF6', // Purple - Office/Books
  '#EF4444', // Red - Utilities
  '#6B7280', // Gray - Other
  '#EC4899', // Pink - Software
];

// Category emoji mapping for better visual storytelling
const CATEGORY_ICONS: Record<string, string> = {
  meals: '🍽️',
  travel: '✈️',
  office: '📚',
  software: '💻',
  utilities: '🔌',
  marketing: '🎯',
  other: '📦',
};

const SpendingDonutChart: React.FC<SpendingDonutChartProps> = ({
  data,
  totalSpent,
  totalBudget,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Fallback for no data
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Spending Breakdown
          </CardTitle>
          <CardDescription>
            Where your money is going this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">📊</div>
            <p>No spending data available</p>
            <p className="text-sm">Add some expenses to see your spending breakdown!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate budget utilization and trends
  const enrichedData = data.map((item, index) => {
    const budgetUsed = item.budget ? (item.total / item.budget) * 100 : 0;
    const trend = item.lastWeekTotal ? 
      ((item.total - item.lastWeekTotal) / item.lastWeekTotal) * 100 : 0;

    return {
      ...item,
      color: COLORS[index % COLORS.length],
      budgetUsed: Math.min(budgetUsed, 100),
      trend,
      icon: CATEGORY_ICONS[item.category] || '📦',
    };
  });

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (trend < -5) return <TrendingDown className="h-3 w-3 text-green-500" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getTrendText = (trend: number) => {
    if (Math.abs(trend) < 1) return 'Similar to last week';
    const direction = trend > 0 ? 'more' : 'less';
    return `${Math.abs(trend).toFixed(0)}% ${direction} than last week`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{data.icon}</span>
            <span className="font-medium capitalize">{data.category}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div>Spent: <span className="font-bold">${data.total.toFixed(2)}</span></div>
            <div>Transactions: {data.count}</div>
            {data.budget && (
              <div>Budget: ${data.budget.toFixed(2)} ({data.budgetUsed.toFixed(0)}% used)</div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {getTrendIcon(data.trend)}
              {getTrendText(data.trend)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Spending Breakdown
        </CardTitle>
        <CardDescription>
          Where your money is going this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Donut Chart */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enrichedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="total"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {enrichedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeIndex === index ? '#374151' : 'none'}
                      strokeWidth={activeIndex === index ? 2 : 0}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalSpent.toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
                <div className="text-xs text-gray-400">
                  {((totalSpent / totalBudget) * 100).toFixed(0)}% of budget
                </div>
              </div>
            </div>
          </div>

          {/* Category Details with Progress Bars */}
          <div className="space-y-4">
            {enrichedData.map((item, index) => (
              <div
                key={item.category}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  activeIndex === index 
                    ? 'border-gray-300 shadow-md bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium capitalize">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${item.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{item.count} transactions</div>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                {item.budget && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Budget Progress</span>
                      <span>{item.budgetUsed.toFixed(0)}% used</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.budgetUsed > 90 ? 'bg-red-500' :
                          item.budgetUsed > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(item.budgetUsed, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Trend Indicator */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {getTrendIcon(item.trend)}
                  <span>{getTrendText(item.trend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingDonutChart;