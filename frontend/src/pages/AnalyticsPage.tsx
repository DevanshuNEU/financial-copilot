import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  Calendar, 
  Target, 
  BarChart3, 
  AlertCircle,
  Zap,
  DollarSign,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  Gamepad2,
  Plus,
  Eye,
  Settings,
  Sparkles
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { appData } = useAppData();
  const { loading, error, expenses, totalSpent, safeToSpendData } = appData;

  // Get user's first name or default
  const getFirstName = () => {
    return appData.user?.firstName || appData.user?.email?.split('@')[0] || 'Student';
  };

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalBudget = safeToSpendData?.totalBudget || 0;
    const remaining = safeToSpendData?.availableAmount || 0;
    const budgetUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Category breakdown
    const categorySpending = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Top spending category
    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate trends (mock for now)
    const isIncreasing = Math.random() > 0.5;
    const trendPercentage = Math.floor(Math.random() * 20) + 5;

    return {
      totalBudget,
      totalSpent,
      remaining,
      budgetUsed,
      categorySpending,
      topCategory,
      transactionCount: expenses.length,
      categoriesUsed: Object.keys(categorySpending).length,
      isIncreasing,
      trendPercentage,
      avgTransaction: expenses.length > 0 ? totalSpent / expenses.length : 0
    };
  }, [expenses, totalSpent, safeToSpendData]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      'Food': Coffee,
      'Transportation': Car,
      'Housing': Home,
      'Entertainment': Gamepad2,
      'Shopping': ShoppingBag,
      'Other': DollarSign
    };
    return iconMap[category] || DollarSign;
  };

  // Get health status
  const getHealthStatus = () => {
    if (analytics.budgetUsed < 50) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (analytics.budgetUsed < 75) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (analytics.budgetUsed < 90) return { label: 'Caution', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your spending analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <Card className="max-w-md mx-auto border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Analytics
            </CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Badge variant="outline" className="bg-white/80 text-indigo-700 border-indigo-200">
              <BarChart3 className="h-3 w-3 mr-1" />
              Spending Analytics
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Your Financial Story, {getFirstName()}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Deep insights into your spending patterns, trends, and opportunities for growth
          </p>
        </motion.div>

        {/* Key Metrics Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          {/* Total Spending */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Spending</p>
                  <p className="text-3xl font-bold text-slate-900">${analytics.totalSpent.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    {analytics.isIncreasing ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={`text-sm ${analytics.isIncreasing ? 'text-red-600' : 'text-green-600'}`}>
                      {analytics.trendPercentage}% vs last month
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Health */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Budget Health</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.budgetUsed.toFixed(1)}%</p>
                  <Badge className={`mt-2 ${healthStatus.bg} ${healthStatus.color} border-0`}>
                    {healthStatus.label}
                  </Badge>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Transactions</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.transactionCount}</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Avg: ${analytics.avgTransaction.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-violet-100 rounded-full">
                  <Calendar className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Categories Used</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.categoriesUsed}</p>
                  <p className="text-sm text-slate-500 mt-2">
                    of 6 available
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <PieChart className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Spending Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Spending Breakdown</CardTitle>
                    <CardDescription className="text-slate-600">Where your money is going</CardDescription>
                  </div>
                  <PieChart className="h-5 w-5 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.categorySpending)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = (amount / analytics.totalSpent) * 100;
                    const IconComponent = getCategoryIcon(category);
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <IconComponent className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{category}</p>
                            <p className="text-sm text-slate-500">{percentage.toFixed(1)}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">${amount.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                
                {Object.keys(analytics.categorySpending).length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No spending data yet</p>
                    <Button onClick={() => navigate('/expenses')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Budget Health</CardTitle>
                    <CardDescription className="text-slate-600">Your spending vs budget</CardDescription>
                  </div>
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="none" 
                        className="text-slate-200" 
                      />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - analytics.budgetUsed / 100)}`}
                        className={analytics.budgetUsed > 80 ? "text-red-500" : analytics.budgetUsed > 60 ? "text-yellow-500" : "text-emerald-500"}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">{analytics.budgetUsed.toFixed(0)}%</p>
                        <p className="text-xs text-slate-500">used</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Total Budget</span>
                    <span className="font-semibold text-slate-900">${analytics.totalBudget.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Spent</span>
                    <span className="font-semibold text-orange-600">${analytics.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Remaining</span>
                    <span className="font-semibold text-emerald-600">${analytics.remaining.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Smart Insights</CardTitle>
                    <CardDescription className="text-slate-600">AI-powered observations</CardDescription>
                  </div>
                  <Sparkles className="h-5 w-5 text-violet-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topCategory && (
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100">
                    <div className="flex items-center mb-2">
                      <Zap className="h-4 w-4 text-violet-600 mr-2" />
                      <span className="font-medium text-violet-900">Top Spending Category</span>
                    </div>
                    <p className="text-violet-800 mb-3">
                      You spent <span className="font-semibold">${analytics.topCategory[1].toFixed(2)}</span> on {analytics.topCategory[0]} this month
                    </p>
                    <Button size="sm" variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                )}

                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center mb-2">
                    <Target className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="font-medium text-emerald-900">Budget Status</span>
                  </div>
                  <p className="text-emerald-800 mb-3">
                    {analytics.budgetUsed < 50 
                      ? "Excellent! You're well within budget this month 🎉" 
                      : analytics.budgetUsed < 80 
                      ? "Good pace! Keep monitoring your spending ⚠️"
                      : "Budget alert! Consider reducing discretionary spending 🚨"
                    }
                  </p>
                  <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <Settings className="h-3 w-3 mr-1" />
                    Adjust Budget
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Monthly Trend</span>
                  </div>
                  <p className="text-blue-800 mb-3">
                    Your average transaction is <span className="font-semibold">${analytics.avgTransaction.toFixed(2)}</span>
                  </p>
                  <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    View Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">What's Next?</CardTitle>
                  <CardDescription className="text-slate-600">Take action to improve your financial health</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate('/expenses')}
                  className="h-auto p-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg"
                >
                  <div className="text-center">
                    <Plus className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Add Expense</div>
                    <div className="text-xs opacity-90">Track new spending</div>
                  </div>
                </Button>

                <Button 
                  onClick={() => navigate('/budget')}
                  variant="outline"
                  className="h-auto p-6 border-slate-200 hover:bg-slate-50"
                >
                  <div className="text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-slate-600" />
                    <div className="font-medium text-slate-900">Manage Budget</div>
                    <div className="text-xs text-slate-500">Adjust categories</div>
                  </div>
                </Button>

                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="h-auto p-6 border-slate-200 hover:bg-slate-50"
                >
                  <div className="text-center">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-slate-600" />
                    <div className="font-medium text-slate-900">View Dashboard</div>
                    <div className="text-xs text-slate-500">Quick overview</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;