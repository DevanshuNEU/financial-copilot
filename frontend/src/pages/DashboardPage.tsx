import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { financialService } from '../services/financialService';
import SafeToSpendCard from '../components/dashboard/SafeToSpendCard';
import FinancialHealthGauge from '../components/dashboard/FinancialHealthGauge';
import AddExpenseModal from '../components/dashboard/AddExpenseModal';
import { 
  BarChart3, 
  Receipt, 
  Plus,
  ArrowRight,
  DollarSign,
  Target,
  Zap,
  Sparkles,
  TrendingUp,
  PiggyBank,
  Calendar,
  ChevronRight,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

// Animation variants for staggered animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { appData } = useAppData();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [personalizedInsights, setPersonalizedInsights] = useState<string[]>([]);

  // Get user's first name or default
  const getFirstName = () => {
    return appData.user?.firstName || user?.email?.split('@')[0] || 'Student';
  };

  // Calculate financial stats
  const availableAmount = appData.safeToSpendData?.availableAmount || 0;
  const dailyAmount = appData.safeToSpendData?.dailySafeAmount || 0;
  const totalBudget = appData.safeToSpendData?.totalBudget || 0;
  const totalSpent = appData.totalSpent || 0;
  const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Generate dynamic insights
  const getSmartInsights = () => {
    const insights = [];
    
    if (budgetUsedPercentage < 50) {
      insights.push("🎉 Great job! You're staying well within budget this month");
    } else if (budgetUsedPercentage < 80) {
      insights.push("⚠️ You've used most of your budget - consider meal prepping to save");
    } else {
      insights.push("🚨 Budget alert! Focus on essentials for the rest of the month");
    }

    if (appData.expenses.length < 5) {
      insights.push("📊 Track more expenses to get better insights");
    }

    return insights;
  };

  useEffect(() => {
    if (appData.onboardingData) {
      const message = financialService.getWelcomeMessage(appData.onboardingData);
      const insights = financialService.getPersonalizedInsights(appData.onboardingData);
      setWelcomeMessage(message);
      setPersonalizedInsights(insights);
    }
  }, [appData.onboardingData]);

  if (appData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Modern Hero Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Welcome back, {getFirstName()}!
              </span>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            You've got{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              ${availableAmount.toFixed(0)}
            </span>
            {' '}available
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            From your <span className="font-semibold">${totalBudget}</span> monthly budget
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${dailyAmount.toFixed(0)}</div>
              <div className="text-sm text-gray-500">Safe per day</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{budgetUsedPercentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">Budget used</div>
            </div>
          </div>

          {/* Smart Insights Banner */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Zap className="h-5 w-5 text-amber-500 mr-2" />
              <span className="font-semibold text-gray-800">Smart Insight</span>
            </div>
            <p className="text-gray-700">
              {getSmartInsights()[0]}
            </p>
          </div>
        </motion.div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Safe to Spend Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Safe to Spend</h3>
                        <p className="text-sm text-gray-600">Available for discretionary spending</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">${availableAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">💎 Available for fun stuff</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">${dailyAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Today you can spend</div>
                      <div className="text-xs text-gray-500 mt-1">Based on 28 days remaining</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">${(availableAmount / 7).toFixed(0)}</div>
                      <div className="text-sm text-gray-600">Weekly budget</div>
                      <div className="text-xs text-gray-500 mt-1">Avg. per week</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Financial Health Gauge */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Financial Health</h3>
                      <p className="text-sm text-gray-600">Watch your spending closely</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center py-8">
                  <FinancialHealthGauge />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">${availableAmount.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Safe to Spend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">${dailyAmount.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Per Day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Budget Summary */}
        <motion.div variants={itemVariants} className="mb-12">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">${totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${(totalBudget - totalSpent).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Budget used</span>
                  <span className="text-sm font-medium text-blue-600">{budgetUsedPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Modern CTA Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Manage your finances with one click</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Expense */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setShowAddExpenseModal(true)}
                className="w-full h-24 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span className="font-medium">Add Expense</span>
                </div>
              </Button>
            </motion.div>

            {/* View Analytics */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/analytics')}
                variant="outline"
                className="w-full h-24 bg-white/80 hover:bg-white border-2 border-blue-200 hover:border-blue-300 shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-gray-700">View Analytics</span>
                </div>
              </Button>
            </motion.div>

            {/* Manage Budget */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/budget')}
                variant="outline"
                className="w-full h-24 bg-white/80 hover:bg-white border-2 border-purple-200 hover:border-purple-300 shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <PiggyBank className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-gray-700">Manage Budget</span>
                </div>
              </Button>
            </motion.div>

            {/* View Expenses */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/expenses')}
                variant="outline"
                className="w-full h-24 bg-white/80 hover:bg-white border-2 border-orange-200 hover:border-orange-300 shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Receipt className="h-6 w-6 text-orange-600" />
                  <span className="font-medium text-gray-700">View Expenses</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Hint */}
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-800">Pro Tip</span>
            </div>
            <p className="text-gray-700">
              Track your expenses regularly to get the most accurate spending insights and stay on budget! 💡
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Expense Modal */}
      <AddExpenseModal 
        open={showAddExpenseModal}
        onOpenChange={setShowAddExpenseModal}
        onExpenseAdded={() => {
          setShowAddExpenseModal(false);
          toast.success('Expense added successfully!');
        }}
      />
    </div>
  );
};

export default DashboardPage;