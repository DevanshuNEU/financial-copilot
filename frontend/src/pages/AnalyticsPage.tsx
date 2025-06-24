import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '../services/api';
import { DashboardData, WeeklyComparisonData, SafeToSpendResponse } from '../types';
import SpendingDonutChart from '../components/dashboard/SpendingDonutChart';
import WeeklyComparison from '../components/dashboard/WeeklyComparison';
import { TrendingUp, PieChart, Calendar, Target, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const AnalyticsPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyComparisonData | null>(null);
  const [safeToSpendData, setSafeToSpendData] = useState<SafeToSpendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, weeklyResponse, safeToSpendResponse] = await Promise.all([
        apiService.getDashboardData(),
        apiService.getWeeklyComparison(),
        apiService.getSafeToSpend()
      ]);
      
      setDashboardData(dashboardResponse);
      setWeeklyData(weeklyResponse);
      setSafeToSpendData(safeToSpendResponse);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data.');
      console.error('Analytics fetch error:', err);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your spending analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Spending Analytics
          </h1>
          <p className="text-gray-600 text-lg">
            Deep insights into your financial patterns and trends
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Spending</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                ${dashboardData?.overview.total_expenses.toFixed(2)}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {dashboardData?.overview.total_transactions}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Expenses recorded
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Categories Used</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {dashboardData?.category_breakdown.length || 0}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Different spending areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Category Breakdown */}
        {dashboardData && safeToSpendData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Category Breakdown
              </CardTitle>
              <CardDescription>
                Interactive view of your spending by category with budget comparisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingDonutChart
                data={dashboardData.category_breakdown.map(cat => ({
                  ...cat,
                  budget: safeToSpendData.budget_status.find(b => b.category === cat.category)?.limit || 0,
                  lastWeekTotal: 0, // TODO: Add last week data from backend
                }))}
                totalSpent={dashboardData.overview.total_expenses}
                totalBudget={safeToSpendData.safe_to_spend.total_budget}
              />
            </CardContent>
          </Card>
        )}

        {/* Weekly Comparison */}
        {weeklyData && weeklyData.weeklyData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Weekly Spending Trends
              </CardTitle>
              <CardDescription>
                Compare your current week's spending with last week to track progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyComparison
                weeklyData={weeklyData.weeklyData}
                thisWeekTotal={weeklyData.thisWeekTotal}
                lastWeekTotal={weeklyData.lastWeekTotal}
                currentDayOfWeek={weeklyData.currentDayOfWeek}
              />
            </CardContent>
          </Card>
        )}

        {/* Insights Section */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">💡 Smart Insights</CardTitle>
            <CardDescription className="text-yellow-700">
              AI-powered observations about your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.category_breakdown
                .sort((a, b) => b.total - a.total)
                .slice(0, 3)
                .map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                    <div>
                      <span className="font-medium text-gray-900 capitalize">
                        #{index + 1} spending area: {category.category}
                      </span>
                      <p className="text-sm text-gray-600">
                        ${category.total.toFixed(2)} spent this month
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-700">
                        {((category.total / (dashboardData?.overview.total_expenses || 1)) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">of total</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;