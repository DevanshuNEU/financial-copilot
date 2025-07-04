// Budget Page - Real user data from AppDataContext
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAppData } from '../contexts/AppDataContext';
import { 
  PiggyBank, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Target,
  DollarSign,
  Edit3,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const BudgetPage: React.FC = () => {
  const { appData, updateBudgetCategory } = useAppData();
  const { loading, error, budgetCategories, onboardingData, safeToSpendData, totalSpent } = appData;
  
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

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
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Budget
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
              Complete your financial setup to view detailed budget management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate budget health metrics
  const totalBudget = safeToSpendData.totalBudget;
  const actualTotalSpent = safeToSpendData.totalFixedCosts + totalSpent; // Fixed costs + expenses
  const actualRemaining = safeToSpendData.availableAmount; // This is already calculated correctly
  const overallProgress = totalBudget > 0 ? (actualTotalSpent / totalBudget) * 100 : 0;
  const currencySymbol = safeToSpendData.currency === 'USD' ? '$' : onboardingData.currency;
  
  // Categorize budget items by status
  const healthyCategories = budgetCategories.filter(cat => cat.percentage <= 80);
  const warningCategories = budgetCategories.filter(cat => cat.percentage > 80 && cat.percentage <= 100);
  const overBudgetCategories = budgetCategories.filter(cat => cat.percentage > 100);

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

  const handleEditCategory = (categoryName: string, currentBudget: number) => {
    setEditingCategory(categoryName);
    setEditValue(currentBudget.toString());
  };

  const handleSaveCategory = async (categoryName: string) => {
    const newBudget = parseFloat(editValue);
    
    if (isNaN(newBudget) || newBudget < 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    try {
      await updateBudgetCategory(categoryName, newBudget);
      setEditingCategory(null);
      setEditValue('');
      toast.success(`Updated ${categoryName} budget`);
    } catch (error) {
      toast.error('Failed to update budget category');
      console.error('Budget update error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
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
                    {currencySymbol}{totalBudget.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-700">Total Budget</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {currencySymbol}{actualTotalSpent.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">Amount Spent</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {currencySymbol}{actualRemaining.toFixed(2)}
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
              {budgetCategories
                .sort((a, b) => b.percentage - a.percentage)
                .map((category) => {
                  const color = getBudgetColor(category.percentage);
                  const Icon = getBudgetIcon(category.percentage);
                  const isOverBudget = category.percentage > 100;
                  const isEditing = editingCategory === category.name;
                  
                  return (
                    <div key={category.name} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
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
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {currencySymbol}{category.spent.toFixed(2)} of {currencySymbol}{category.budgeted.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              color === 'green' ? 'text-green-600' :
                              color === 'yellow' ? 'text-yellow-600' :
                              color === 'orange' ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {category.percentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">
                              {isOverBudget ? 'Over budget' : `${currencySymbol}${category.remaining.toFixed(2)} left`}
                            </div>
                          </div>
                          
                          {!isEditing ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category.name, category.budgeted)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-24 h-8"
                                min="0"
                                step="0.01"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveCategory(category.name)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min(category.percentage, 100)} 
                        className={`h-3 ${
                          color === 'green' ? '[&>div]:bg-green-500' :
                          color === 'yellow' ? '[&>div]:bg-yellow-500' :
                          color === 'orange' ? '[&>div]:bg-orange-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                      
                      {isOverBudget && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Over by {currencySymbol}{(category.spent - category.budgeted).toFixed(2)}</strong> - Consider adjusting spending in this category
                        </div>
                      )}
                    </div>
                  );
                })}
              
              {budgetCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No budget categories found</p>
                  <p className="text-sm">Complete your onboarding to set up budget categories</p>
                </div>
              )}
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
                      <li key={cat.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="capitalize">{cat.name}</span> - Consider reducing by {currencySymbol}{(cat.spent - cat.budgeted).toFixed(2)}
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
                      <li key={cat.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="capitalize">{cat.name}</span> - {currencySymbol}{cat.remaining.toFixed(2)} buffer remaining
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

        {/* Safe to Spend Reminder */}
        {safeToSpendData.dailySafeAmount > 0 && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                💰 Daily Safe Spending
              </CardTitle>
              <CardDescription className="text-green-700">
                Based on your remaining budget and days left in the month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {currencySymbol}{safeToSpendData.dailySafeAmount.toFixed(2)}
                </div>
                <p className="text-green-600">
                  You can safely spend this much per day for the rest of the month
                </p>
                <p className="text-sm text-green-500 mt-1">
                  {safeToSpendData.daysLeftInMonth} days remaining in {new Date().toLocaleDateString('en-US', { month: 'long' })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;