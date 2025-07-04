// Analytics Page - Real user data from AppDataContext
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppData } from '../contexts/AppDataContext';
import { TrendingUp, PieChart, Calendar, Target, BarChart3, AlertCircle } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { appData } = useAppData();
  const { loading, error, expenses, budgetCategories, totalSpent, onboardingData, safeToSpendData } = appData;

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
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please ensure you've completed the onboarding process and try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!onboardingData || !safeToSpendData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-yellow-600">Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Complete your financial setup to view detailed analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate analytics data from real user data
  const totalTransactions = expenses.length;
  const categoriesUsed = budgetCategories.length;
  const currencySymbol = safeToSpendData.currency === 'USD' ? '$' : onboardingData.currency;

  // Calculate insights
  const topSpendingCategories = budgetCategories
    .filter(cat => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  const budgetWarnings = budgetCategories.filter(cat => cat.percentage > 80);
  const healthyCategories = budgetCategories.filter(cat => cat.percentage <= 80 && cat.spent > 0);

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
                {currencySymbol}{totalSpent.toFixed(2)}
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
                {totalTransactions}
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
                {categoriesUsed}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Different spending areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Spending Breakdown
              </CardTitle>
              <CardDescription>
                Where your money is going this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalSpent > 0 ? (
                <div className="space-y-4">
                  {/* Simple donut chart representation */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {currencySymbol}{totalSpent.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Spent</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {((totalSpent / safeToSpendData.totalBudget) * 100).toFixed(1)}% of budget
                    </div>
                  </div>
                  
                  {/* Category breakdown list */}
                  <div className="space-y-2">
                    {budgetCategories
                      .filter(cat => cat.spent > 0)
                      .sort((a, b) => b.spent - a.spent)
                      .map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` 
                              }}
                            />
                            <span className="font-medium text-gray-900 capitalize">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {currencySymbol}{category.spent.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {category.percentage.toFixed(1)}% used
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No expenses recorded yet</p>
                  <p className="text-sm">Start tracking your spending to see insights here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Budget Health
              </CardTitle>
              <CardDescription>
                How well you're staying within your limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall budget progress */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-blue-900">Overall Progress</span>
                    <span className="text-blue-700">
                      {((totalSpent / safeToSpendData.totalBudget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (totalSpent / safeToSpendData.totalBudget) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {currencySymbol}{(safeToSpendData.totalBudget - totalSpent).toFixed(2)} remaining
                  </div>
                </div>

                {/* Category health indicators */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Category Status</div>
                  
                  {healthyCategories.length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800 mb-1">
                        ✅ Healthy ({healthyCategories.length})
                      </div>
                      <div className="text-xs text-green-600">
                        {healthyCategories.map(cat => cat.name).join(', ')}
                      </div>
                    </div>
                  )}

                  {budgetWarnings.length > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm font-medium text-orange-800 mb-1">
                        ⚠️ Near Limit ({budgetWarnings.length})
                      </div>
                      <div className="text-xs text-orange-600">
                        {budgetWarnings.map(cat => `${cat.name} (${cat.percentage.toFixed(0)}%)`).join(', ')}
                      </div>
                    </div>
                  )}

                  {budgetCategories.filter(cat => cat.spent === 0).length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        💤 Unused Categories ({budgetCategories.filter(cat => cat.spent === 0).length})
                      </div>
                      <div className="text-xs text-gray-500">
                        {budgetCategories.filter(cat => cat.spent === 0).map(cat => cat.name).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Insights */}
        {topSpendingCategories.length > 0 && (
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">💡 Smart Insights</CardTitle>
              <CardDescription className="text-yellow-700">
                AI-powered observations about your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSpendingCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                    <div>
                      <span className="font-medium text-gray-900 capitalize">
                        #{index + 1} spending area: {category.name}
                      </span>
                      <p className="text-sm text-gray-600">
                        {currencySymbol}{category.spent.toFixed(2)} spent this month
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-700">
                        {((category.spent / totalSpent) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">of total</div>
                    </div>
                  </div>
                ))}
                
                {totalSpent === 0 && (
                  <div className="text-center py-4 text-yellow-700">
                    <p className="font-medium">Ready to start tracking!</p>
                    <p className="text-sm">Add your first expense to see personalized insights here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;