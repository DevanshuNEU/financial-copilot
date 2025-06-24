import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { SafeToSpendResponse } from '../types';
import SafeToSpendCard from '../components/dashboard/SafeToSpendCard';
import FinancialHealthGauge from '../components/dashboard/FinancialHealthGauge';
import AddExpenseModal from '../components/dashboard/AddExpenseModal';
import { BarChart3, Receipt, PiggyBank, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial health...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your quick financial health check
          </p>
        </div>

        {/* Core Dashboard - Only 3 Essential Cards */}
        <div className="space-y-6">
          {/* 1. Safe to Spend Calculator - Most Important */}
          <SafeToSpendCard />

          {/* 2. Financial Health Gauge - Visual Overview */}
          {safeToSpendData && (
            <FinancialHealthGauge
              safeToSpend={safeToSpendData.safe_to_spend.discretionary_remaining}
              totalBudget={safeToSpendData.safe_to_spend.total_budget}
              totalSpent={safeToSpendData.safe_to_spend.total_spent}
              daysLeftInMonth={safeToSpendData.safe_to_spend.days_left_in_month}
              dailySafeAmount={safeToSpendData.safe_to_spend.daily_safe_amount}
            />
          )}

          {/* 3. Quick Actions - Clear CTAs */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>
                What would you like to do next?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Add Expense */}
                <div className="flex flex-col items-center">
                  <AddExpenseModal onExpenseAdded={fetchData} />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Record a new purchase
                  </p>
                </div>

                {/* View Analytics */}
                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => navigate('/analytics')}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <BarChart3 className="h-5 w-5" />
                    View Analytics
                  </Button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Deep dive into spending patterns
                  </p>
                </div>

                {/* Manage Budget */}
                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => navigate('/budget')}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                  >
                    <PiggyBank className="h-5 w-5" />
                    Manage Budget
                  </Button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Set and track spending limits
                  </p>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => navigate('/expenses')}
                    variant="ghost"
                    className="text-gray-600 hover:text-green-600"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    View All Expenses
                  </Button>
                  <Button
                    onClick={() => navigate('/analytics')}
                    variant="ghost"
                    className="text-gray-600 hover:text-green-600"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    See Trends
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encouraging Footer Message */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            💚 You're doing great! Remember, this is about awareness, not restriction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;