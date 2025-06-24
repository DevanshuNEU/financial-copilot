import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '../../services/api';
import { SafeToSpendResponse } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const SafeToSpendCard: React.FC = () => {
  const [safeToSpendData, setSafeToSpendData] = useState<SafeToSpendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSafeToSpend = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSafeToSpend();
        setSafeToSpendData(data);
        setError(null);
      } catch (err) {
        setError('Failed to calculate safe spending amount');
        console.error('Safe to spend fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSafeToSpend();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Safe to Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !safeToSpendData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Safe to Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error || 'No budget data available'}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Set up your monthly budgets to see spending recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  const { safe_to_spend, recommendations } = safeToSpendData;
  const isOverBudget = safe_to_spend.total_spent > safe_to_spend.total_budget;
  const remainingAmount = Math.max(0, safe_to_spend.discretionary_remaining);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'over_budget': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <TrendingUp className="h-4 w-4" />;
      case 'caution': return <AlertCircle className="h-4 w-4" />;
      case 'over_budget': return <TrendingDown className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`border-l-4 ${
      recommendations.status === 'on_track' 
        ? 'border-l-green-500' 
        : recommendations.status === 'caution' 
        ? 'border-l-yellow-500' 
        : 'border-l-red-500'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Safe to Spend
          </div>
          <Badge className={getStatusColor(recommendations.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(recommendations.status)}
              {recommendations.status.replace('_', ' ')}
            </div>
          </Badge>
        </CardTitle>
        <CardDescription>
          Money available for discretionary spending this month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Safe to Spend Amount */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${
            remainingAmount > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${remainingAmount.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            Available for fun stuff this month
          </p>
        </div>

        {/* Daily Recommendation */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Today you can spend:</span>
            <span className="text-lg font-bold text-blue-600">
              ${recommendations.can_spend_today.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {safe_to_spend.days_left_in_month} days left this month
          </p>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Budget</p>
            <p className="font-semibold">${safe_to_spend.total_budget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Spent</p>
            <p className={`font-semibold ${
              isOverBudget ? 'text-red-600' : 'text-gray-900'
            }`}>
              ${safe_to_spend.total_spent.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Warning if over budget */}
        {isOverBudget && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Over Budget</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              You're ${(safe_to_spend.total_spent - safe_to_spend.total_budget).toFixed(2)} over 
              your monthly budget. Consider reducing discretionary spending.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SafeToSpendCard;