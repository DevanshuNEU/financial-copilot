import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface WeeklyData {
  day: string;
  thisWeek: number;
  lastWeek: number;
  dayName: string;
}

interface WeeklyComparisonProps {
  weeklyData: WeeklyData[];
  thisWeekTotal: number;
  lastWeekTotal: number;
  currentDayOfWeek: number; // 0 = Sunday, 6 = Saturday
}

const WeeklyComparison: React.FC<WeeklyComparisonProps> = ({
  weeklyData,
  thisWeekTotal,
  lastWeekTotal,
  currentDayOfWeek,
}) => {
  // Fallback for no data
  if (!weeklyData || weeklyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Spending Comparison
          </CardTitle>
          <CardDescription>
            How you're doing compared to last week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No spending data available for comparison</p>
            <p className="text-sm">Add some expenses to see weekly trends!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentageChange = lastWeekTotal > 0 
    ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 
    : 0;

  const isImproving = percentageChange < 0;
  const changeIcon = isImproving ? TrendingDown : TrendingUp;
  const changeColor = isImproving ? 'text-green-600' : 'text-red-600';
  
  const getEncouragingMessage = () => {
    if (isImproving) {
      if (Math.abs(percentageChange) > 20) return "Amazing progress! 🎉";
      if (Math.abs(percentageChange) > 10) return "Great improvement! 👏";
      return "Nice work keeping spending down! ✨";
    } else {
      if (percentageChange > 20) return "Let's focus on smaller expenses 💪";
      if (percentageChange > 10) return "Spending a bit more this week 📊";
      return "Spending is fairly consistent 📈";
    }
  };

  const getWeeklyInsight = () => {
    const daysCompleted = currentDayOfWeek + 1;
    const avgDailyThisWeek = thisWeekTotal / daysCompleted;
    const avgDailyLastWeek = lastWeekTotal / 7;
    
    if (avgDailyThisWeek < avgDailyLastWeek) {
      return `You're averaging $${avgDailyThisWeek.toFixed(0)}/day - better than last week's $${avgDailyLastWeek.toFixed(0)}/day!`;
    } else {
      return `Daily average: $${avgDailyThisWeek.toFixed(0)} (vs $${avgDailyLastWeek.toFixed(0)} last week)`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const thisWeekValue = payload.find((p: any) => p.dataKey === 'thisWeek')?.value || 0;
      const lastWeekValue = payload.find((p: any) => p.dataKey === 'lastWeek')?.value || 0;
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium mb-2">{label}</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>This week: ${thisWeekValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Last week: ${lastWeekValue.toFixed(2)}</span>
            </div>
            {thisWeekValue !== lastWeekValue && (
              <div className="text-xs text-gray-500 mt-1">
                {thisWeekValue > lastWeekValue ? '↑' : '↓'} 
                {' $'}{Math.abs(thisWeekValue - lastWeekValue).toFixed(2)} difference
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Spending Comparison
        </CardTitle>
        <CardDescription>
          How you're doing compared to last week
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Weekly Totals Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              ${thisWeekTotal.toFixed(2)}
            </div>
            <div className="text-sm text-blue-600 font-medium">This Week</div>
            <div className="text-xs text-gray-500 mt-1">
              {currentDayOfWeek + 1} day{currentDayOfWeek !== 0 ? 's' : ''} so far
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg border">
            <div className="text-2xl font-bold text-gray-600">
              ${lastWeekTotal.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Last Week</div>
            <div className="text-xs text-gray-500 mt-1">
              Complete week
            </div>
          </div>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center justify-center gap-3 p-4 bg-white border rounded-lg">
          <div className={`flex items-center gap-2 ${changeColor}`}>
            {React.createElement(changeIcon, { className: "h-5 w-5" })}
            <span className="font-bold">
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
            <span>
              {isImproving ? 'less' : 'more'} than last week
            </span>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="text-sm font-medium text-gray-700">
            {getEncouragingMessage()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getWeeklyInsight()}
          </div>
        </div>

        {/* Daily Spending Chart */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Daily Spending Pattern</span>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="lastWeek"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#9CA3AF' }}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="thisWeek"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>This Week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-gray-400" style={{ borderStyle: 'dashed' }}></div>
              <span>Last Week</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyComparison;