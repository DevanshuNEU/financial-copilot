import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiService } from '../services/api';
import { SafeToSpendResponse } from '../types';
import { 
  PiggyBank, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Target,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const BudgetPage: React.FC = () => {
  const [safeToSpendData, setSafeToSpendData] = useState<SafeToSpendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const safeToSpendResponse = await apiService.getSafeToSpend();
      setSafeToSpendData(safeToSpendResponse);
      setError(null);
    } catch (err) {
      setError('Failed to load budget data.');
      console.error('Budget fetch error:', err);
      toast.error('Failed to load budget data');
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your budget overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!safeToSpendData) {
    return null;
  }

  const { budget_status, safe_to_spend } = safeToSpendData;
  
  // Calculate overall budget health
  const totalBudget = safe_to_spend.total_budget;
  const totalSpent = safe_to_spend.total_spent;
  const overallProgress = (totalSpent / totalBudget) * 100;
  
  // Categorize budget items by status
  const healthyCategories = budget_status.filter(cat => cat.percentage_used <= 80);
  const warningCategories = budget_status.filter(cat => cat.percentage_used > 80 && cat.percentage_used <= 100);
  const overBudgetCategories = budget_status.filter(cat => cat.percentage_used > 100);

  const getBudgetColor = (percentage: number) => {
    if (percentage <= 60) return 'green';
    if (percentage <= 80) return 'yellow';
    if (percentage <= 100) return 'orange';
    return 'red';
  };

  const getBudgetIcon = (percentage: number) => {
    if (percentage <= 80) return CheckCircle;
    if (percentage <= 100) return AlertTriangle;
    return AlertTriangle;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <PiggyBank className="h-8 w-8 text-purple-600" />
            Budget Management
          </h1>
          <p className="text-gray-600 text-lg">
            Track your spending limits and optimize your financial health
          </p>
        </div>

        {/* Overall Budget Health */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Overall Budget Health
            </CardTitle>
            <CardDescription>
              Your total spending vs. monthly budget limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Monthly Progress</span>
                <span className="text-2xl font-bold text-purple-600">
                  {overallProgress.toFixed(1)}%
                </span>
              </div>
              
              <Progress 
                value={Math.min(overallProgress, 100)} 
                className="h-4"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    ${totalBudget.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-700">Total Budget</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalSpent.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">Amount Spent</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    ${(totalBudget - totalSpent).toFixed(2)}
                  </div>
                  <div className="text-sm text-purple-700">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Healthy Categories</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {healthyCategories.length}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Under 80% budget used
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Warning Categories</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {warningCategories.length}
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                80-100% budget used
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Over Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {overBudgetCategories.length}
              </div>
              <p className="text-xs text-red-600 mt-1">
                Exceeded budget limits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Budget Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Category Budget Breakdown
            </CardTitle>
            <CardDescription>
              Detailed view of spending vs. budget for each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budget_status
                .sort((a, b) => b.percentage_used - a.percentage_used)
                .map((category) => {
                  const color = getBudgetColor(category.percentage_used);
                  const Icon = getBudgetIcon(category.percentage_used);
                  const isOverBudget = category.percentage_used > 100;
                  
                  return (
                    <div key={category.category} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${
                            color === 'green' ? 'text-green-600' :
                            color === 'yellow' ? 'text-yellow-600' :
                            color === 'orange' ? 'text-orange-600' :
                            'text-red-600'
                          }`} />
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {category.category}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${category.spent.toFixed(2)} of ${category.limit.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            color === 'green' ? 'text-green-600' :
                            color === 'yellow' ? 'text-yellow-600' :
                            color === 'orange' ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {category.percentage_used.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {isOverBudget ? 'Over budget' : `${(category.limit - category.spent).toFixed(2)} left`}
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min(category.percentage_used, 100)} 
                        className={`h-3 ${
                          color === 'green' ? '[&>div]:bg-green-500' :
                          color === 'yellow' ? '[&>div]:bg-yellow-500' :
                          color === 'orange' ? '[&>div]:bg-orange-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                      
                      {isOverBudget && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Over by ${(category.spent - category.limit).toFixed(2)}</strong> - Consider adjusting spending in this category
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Tips */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Budget Optimization Tips</CardTitle>
            <CardDescription className="text-blue-700">
              Smart suggestions to improve your financial health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800">🎯 Focus Areas</h4>
                {overBudgetCategories.length > 0 ? (
                  <ul className="space-y-2 text-sm text-blue-700">
                    {overBudgetCategories.slice(0, 3).map(cat => (
                      <li key={cat.category} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="capitalize">{cat.category}</span> - Consider reducing by ${(cat.spent - cat.limit).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-700">
                    🎉 Great job! All categories are within budget limits.
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800">✨ Doing Well</h4>
                {healthyCategories.length > 0 ? (
                  <ul className="space-y-2 text-sm text-blue-700">
                    {healthyCategories.slice(0, 3).map(cat => (
                      <li key={cat.category} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="capitalize">{cat.category}</span> - ${(cat.limit - cat.spent).toFixed(2)} buffer remaining
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-700">
                    Consider reviewing your budget limits to create more breathing room.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetPage;