import React from 'react';
import { onboardingService } from '../services/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OnboardingDebugPage: React.FC = () => {
  const [data, setData] = React.useState(onboardingService.getOnboardingData());
  const [personalizedData, setPersonalizedData] = React.useState(
    data ? onboardingService.calculatePersonalizedSafeToSpend(data) : null
  );

  const refresh = () => {
    const newData = onboardingService.getOnboardingData();
    setData(newData);
    setPersonalizedData(newData ? onboardingService.calculatePersonalizedSafeToSpend(newData) : null);
  };

  const clearData = () => {
    onboardingService.clearOnboardingData();
    refresh();
  };

  const hasCompleted = onboardingService.hasCompletedOnboarding();
  const hasSkipped = onboardingService.hasSkippedOnboarding();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛠️ Onboarding Debug Dashboard
          </h1>
          <p className="text-gray-600">
            Test and debug the onboarding data personalization
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Badge variant={hasCompleted ? "default" : "secondary"}>
                {hasCompleted ? "✅ Completed" : "❌ Not Completed"}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">Onboarding Status</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Badge variant={hasSkipped ? "destructive" : "secondary"}>
                {hasSkipped ? "⏭️ Skipped" : "🎯 Not Skipped"}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">Skip Status</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Badge variant={data ? "default" : "secondary"}>
                {data ? "📊 Has Data" : "📋 No Data"}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">Data Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={refresh} variant="outline">
            🔄 Refresh Data
          </Button>
          <Button onClick={clearData} variant="destructive">
            🗑️ Clear All Data
          </Button>
          <Button onClick={() => window.location.href = '/onboarding'}>
            🚀 Go to Onboarding
          </Button>
          <Button onClick={() => window.location.href = '/dashboard'}>
            📊 Go to Dashboard
          </Button>
        </div>

        {/* Raw Data Display */}
        {data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Raw Onboarding Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Personalized Data Display */}
        {personalizedData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Personalized Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {onboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.totalBudget.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Fixed Costs</p>
                  <p className="text-2xl font-bold text-red-900">
                    {onboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.totalFixedCosts.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Available for Spending</p>
                  <p className="text-2xl font-bold text-green-900">
                    {onboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.availableForSpending.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Daily Safe Amount</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {onboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.dailySafeAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium mb-2">Days Left in Month</p>
                <p className="text-lg font-bold text-gray-900">{personalizedData.daysLeftInMonth} days</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Message & Insights */}
        {data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💬 Personalized Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium mb-1">Welcome Message</p>
                <p className="text-lg text-green-900">
                  {onboardingService.getWelcomeMessage(data)}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Personalized Insights</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingService.getPersonalizedInsights(data).map((insight, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!data && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">
                🚀 No onboarding data found
              </p>
              <p className="text-gray-400 mb-6">
                Complete the onboarding flow to see personalized data here
              </p>
              <Button onClick={() => window.location.href = '/onboarding'}>
                Start Onboarding
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingDebugPage;
