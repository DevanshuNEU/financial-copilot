import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import AddExpenseModal from '../components/dashboard/AddExpenseModal';
import { 
  Plus,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Brain,
  Eye,
  BarChart3,
  Receipt,
  ArrowRight,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Gamepad2,
  DollarSign,
  Waves,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appData } = useAppData();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(0);
  
  // Get user's first name
  const getFirstName = () => {
    return appData.user?.firstName || user?.email?.split('@')[0] || 'Student';
  };

  // Financial calculations with enhanced metrics
  const financialData = useMemo(() => {
    const availableAmount = appData.safeToSpendData?.availableAmount || 0;
    const dailyAmount = appData.safeToSpendData?.dailySafeAmount || 0;
    const totalBudget = appData.safeToSpendData?.totalBudget || 0;
    const totalSpent = appData.totalSpent || 0;
    const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.max(1, lastDay.getDate() - now.getDate());
    const daysElapsed = now.getDate();
    const monthProgress = (daysElapsed / lastDay.getDate()) * 100;
    
    const healthScore = Math.max(0, 100 - (budgetUsedPercentage - monthProgress));
    const spendingVelocity = budgetUsedPercentage / monthProgress;
    
    return {
      availableAmount,
      dailyAmount,
      totalBudget,
      totalSpent,
      budgetUsedPercentage,
      daysRemaining,
      daysElapsed,
      monthProgress,
      healthScore,
      spendingVelocity,
      projectedEndAmount: availableAmount - (dailyAmount * daysRemaining * spendingVelocity),
      isOnTrack: spendingVelocity <= 1.2,
      riskLevel: spendingVelocity > 1.5 ? 'high' : spendingVelocity > 1.2 ? 'medium' : 'low'
    };
  }, [appData.safeToSpendData, appData.totalSpent]);

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

  // Dynamic insights that rotate
  const dynamicInsights = [
    {
      title: "Spending Velocity",
      value: `${financialData.spendingVelocity.toFixed(1)}x`,
      subtitle: "spending rate vs time",
      status: financialData.spendingVelocity > 1.2 ? "warning" : "good",
      icon: TrendingUp
    },
    {
      title: "Financial Health",
      value: `${financialData.healthScore.toFixed(0)}%`,
      subtitle: "overall wellness score",
      status: "good",
      icon: Target
    },
    {
      title: "Month Progress",
      value: `${financialData.monthProgress.toFixed(0)}%`,
      subtitle: "time elapsed this month",
      status: "neutral",
      icon: Calendar
    }
  ];

  // Recent transactions
  const recentTransactions = appData.expenses.slice(-4).reverse();

  if (appData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentInsight = dynamicInsights[selectedInsight];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Clean Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          {/* Welcome Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 mb-8 shadow-sm border border-gray-100"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-700 font-medium">Good evening, {getFirstName()}</span>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </motion.div>

          {/* Hero Amount - Clean & Big */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.h1 
              className="text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-4 leading-none tracking-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              ${financialData.availableAmount.toFixed(0)}
            </motion.h1>
            
            <p className="text-xl text-gray-600 font-medium">
              available from your ${financialData.totalBudget.toFixed(0)} monthly flow
            </p>
          </motion.div>

          {/* Interactive Insights Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => setSelectedInsight((prev) => (prev + 1) % dynamicInsights.length)}
              className="bg-white rounded-2xl px-8 py-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  currentInsight.status === 'good' ? 'bg-green-100 text-green-600' :
                  currentInsight.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <currentInsight.icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{currentInsight.value}</div>
                  <div className="text-sm text-gray-600">{currentInsight.title}</div>
                </div>
                <div className="flex space-x-1">
                  {dynamicInsights.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === selectedInsight ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Today's Power - Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Today's Power</h3>
                    <p className="text-sm text-gray-600">Your spending energy</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 rounded-2xl p-6">
                    <div className="text-4xl font-black text-green-600 mb-2">
                      ${financialData.dailyAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-green-700 font-medium">Available today</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Week</span>
                      <span className="font-bold text-gray-900">${(financialData.dailyAmount * 7).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Days Left</span>
                      <span className="font-bold text-gray-900">{financialData.daysRemaining}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Track Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Flow - Center Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Waves className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Financial Flow</h3>
                    <p className="text-sm text-gray-600">Your money's rhythm</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className="text-blue-500"
                        initial={{ strokeDasharray: "0 251.2" }}
                        animate={{ 
                          strokeDasharray: `${(financialData.budgetUsedPercentage / 100) * 251.2} 251.2` 
                        }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 1.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-black text-gray-900">
                          {financialData.budgetUsedPercentage.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-600">consumed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flow Summary */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      ${financialData.totalBudget.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600">Total Flow</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      ${financialData.totalSpent.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600">Consumed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      ${financialData.availableAmount.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600">Flowing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insights - Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-0">
                      Smart
                    </Badge>
                  </div>
                </div>

                {/* Financial DNA */}
                <div className="bg-purple-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Financial DNA</span>
                  </div>
                  <p className="text-sm text-purple-800 leading-relaxed">
                    Your spending rhythm shows excellent financial discipline. 
                    Smart patterns suggest {financialData.healthScore.toFixed(0)}% probability of month-end surplus.
                  </p>
                </div>

                {/* Activity Stream */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Activity Stream</h4>
                  <div className="space-y-3">
                    {recentTransactions.map((expense, index) => {
                      const IconComponent = getCategoryIcon(expense.category);
                      return (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {expense.description}
                            </div>
                            <div className="text-xs text-gray-600">{expense.category}</div>
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            ${expense.amount.toFixed(2)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Command Center</h2>
            <p className="text-gray-600 mb-8">Navigate your financial universe</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  icon: Plus, 
                  label: "Add Expense", 
                  bgClass: "bg-green-50 hover:bg-green-100", 
                  borderClass: "border-green-100 hover:border-green-200",
                  iconClass: "text-green-600",
                  textClass: "text-green-900",
                  onClick: () => setShowAddExpenseModal(true) 
                },
                { 
                  icon: BarChart3, 
                  label: "Analytics", 
                  bgClass: "bg-blue-50 hover:bg-blue-100", 
                  borderClass: "border-blue-100 hover:border-blue-200",
                  iconClass: "text-blue-600",
                  textClass: "text-blue-900",
                  onClick: () => navigate('/analytics') 
                },
                { 
                  icon: Target, 
                  label: "Budget", 
                  bgClass: "bg-purple-50 hover:bg-purple-100", 
                  borderClass: "border-purple-100 hover:border-purple-200",
                  iconClass: "text-purple-600",
                  textClass: "text-purple-900",
                  onClick: () => navigate('/budget') 
                },
                { 
                  icon: Receipt, 
                  label: "Expenses", 
                  bgClass: "bg-orange-50 hover:bg-orange-100", 
                  borderClass: "border-orange-100 hover:border-orange-200",
                  iconClass: "text-orange-600",
                  textClass: "text-orange-900",
                  onClick: () => navigate('/expenses') 
                }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  className={`p-6 rounded-2xl ${action.bgClass} border ${action.borderClass} transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  <action.icon className={`h-8 w-8 ${action.iconClass} mx-auto mb-3`} />
                  <div className={`text-sm font-semibold ${action.textClass}`}>
                    {action.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Future Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-8 w-8" />
              <span className="text-2xl font-bold">Neural Financial Coach</span>
              <Badge className="bg-white/20 text-white border-0">Quantum Ready</Badge>
            </div>
            
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto leading-relaxed">
              Experience the future of financial intelligence. Advanced neural networks will predict 
              your spending patterns, optimize your financial decisions, and guide you towards 
              financial freedom with unprecedented precision.
            </p>
            
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
              onClick={() => toast.success("AI Coach coming soon! 🤖")}
            >
              <Eye className="h-5 w-5 mr-2" />
              Experience Intelligence
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={showAddExpenseModal}
        onOpenChange={setShowAddExpenseModal}
        onExpenseAdded={() => {
          setShowAddExpenseModal(false);
          // The AppDataContext will automatically refresh the data
        }}
      />
    </div>
  );
};

export default DashboardPage;