import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { SafeToSpendResponse } from '../types';
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
  Zap
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
      ease: [0.25, 0.1, 0.25, 1] // Cubic bezier for smooth easing
    }
  }
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [safeToSpendData, setSafeToSpendData] = useState<SafeToSpendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const safeToSpendResponse = await apiService.getSafeToSpend();
      setSafeToSpendData(safeToSpendResponse);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running on port 5002.');
      console.error('Dashboard fetch error:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg font-semibold text-gray-900 mb-2">Financial Copilot</p>
            <p className="text-gray-600">Loading your financial health...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={fetchData}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Quick action cards
  const quickActions = [
    {
      title: "Add Expense",
      description: "Track a new purchase",
      icon: Plus,
      color: "bg-blue-500",
      action: () => setShowAddExpenseModal(true)
    },
    {
      title: "View Analytics", 
      description: "See spending insights",
      icon: BarChart3,
      color: "bg-purple-500",
      action: () => navigate('/analytics')
    },
    {
      title: "Manage Budget",
      description: "Update your budgets", 
      icon: Target,
      color: "bg-green-500",
      action: () => navigate('/budget')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Clean Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <DollarSign className="h-4 w-4" />
              Welcome back! 👋
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
            >
              Here's your quick financial health check
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-gray-600 text-lg"
            >
              Stay on track with your spending goals
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content with clean spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Primary Cards Row - Perfect Symmetry */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Safe to Spend - Clean and Minimal */}
            <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardContent className="p-0 h-full">
                <SafeToSpendCard data={safeToSpendData} />
              </CardContent>
            </Card>

            {/* Financial Health - Matching Height */}
            <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardContent className="p-0 h-full">
                <FinancialHealthGauge data={safeToSpendData} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions - Clean and Minimal */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
              <p className="text-gray-600">Manage your finances with one click</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="cursor-pointer"
                    onClick={action.action}
                  >
                    <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
                      <CardContent className="p-6 text-center">
                        <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation Cards - Matching Quick Actions Style */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore More</h2>
              <p className="text-gray-600">Dive deeper into your financial data</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="cursor-pointer"
                onClick={() => navigate('/analytics')}
              >
                <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            Analytics & Insights
                          </h3>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Understand your spending patterns with beautiful charts and detailed analysis.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="cursor-pointer"
                onClick={() => navigate('/expenses')}
              >
                <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <Receipt className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            Expense Management
                          </h3>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <p className="text-sm text-gray-600">
                          View, edit, and organize all your expenses in one convenient location.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add Expense Modal - Controlled */}
      <AddExpenseModal 
        onExpenseAdded={fetchData} 
        open={showAddExpenseModal}
        onOpenChange={setShowAddExpenseModal}
      />
    </div>
  );
};

export default DashboardPage;
