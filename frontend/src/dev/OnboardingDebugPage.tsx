import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseAuth } from '../contexts/authContext.supabase';
import { supabaseOnboardingService, OnboardingData, PersonalizedSafeToSpend } from '../services/supabaseOnboarding';

const OnboardingDebugPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [personalizedData, setPersonalizedData] = useState<PersonalizedSafeToSpend | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load onboarding data
      const onboardingData = await supabaseOnboardingService.loadOnboardingData();
      setData(onboardingData);
      
      // Calculate personalized data if we have onboarding data
      if (onboardingData) {
        const personalizedInfo = supabaseOnboardingService.calculatePersonalizedSafeToSpend(onboardingData);
        setPersonalizedData(personalizedInfo);
      } else {
        setPersonalizedData(null);
      }
      
      // Check completion status
      const completed = await supabaseOnboardingService.hasCompletedOnboarding();
      setHasCompleted(completed);
      
    } catch (error) {
      console.error('Failed to load debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadData();
  };

  const clearData = async () => {
    try {
      await supabaseOnboardingService.clearOnboardingData();
      await loadData(); // Refresh after clearing
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to access the debug page.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debug data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Debug Center</h1>
          <p className="text-gray-600">Testing interface for Supabase onboarding data</p>
          <p className="text-sm text-gray-500 mt-2">User: {user.email}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button onClick={refresh} variant="outline">
            🔄 Refresh Data
          </Button>
          <Button onClick={clearData} variant="destructive">
            🗑️ Clear All Data
          </Button>
          <Button onClick={() => window.location.href = '/onboarding'} variant="default">
            ➡️ Go to Onboarding
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Completion Status */}
          <Card>
            <CardContent className="p-4 text-center">
              <Badge variant={hasCompleted ? "default" : "secondary"}>
                {hasCompleted ? "✅ Completed" : "❌ Not Completed"}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">Onboarding Status</p>
            </CardContent>
          </Card>

          {/* Data Status */}
          <Card>
            <CardContent className="p-4 text-center">
              <Badge variant={data ? "default" : "secondary"}>
                {data ? "📊 Has Data" : "📋 No Data"}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">Data Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Raw Data Display */}
        {data && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Raw Onboarding Data (Supabase)</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalized Calculations */}
        {personalizedData && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Personalized Calculations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {supabaseOnboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.totalBudget.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Fixed Costs</p>
                  <p className="text-2xl font-bold text-red-900">
                    {supabaseOnboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.totalFixedCosts.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Available</p>
                  <p className="text-2xl font-bold text-green-900">
                    {supabaseOnboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.availableForSpending.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Daily Safe</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {supabaseOnboardingService.getCurrencySymbol(personalizedData.currency)}
                    {personalizedData.dailySafeAmount.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Days Left</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {personalizedData.daysLeftInMonth}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Currency</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {personalizedData.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalized Messages */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Welcome Message */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium mb-1">Welcome Message</p>
                  <p className="text-lg text-green-900">
                    {supabaseOnboardingService.getWelcomeMessage(data)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 font-medium">Personalized Insights</p>
                <div className="flex flex-wrap gap-2">
                  {supabaseOnboardingService.getPersonalizedInsights(data).map((insight, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Data State */}
        {!data && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Onboarding Data</h3>
              <p className="text-gray-600 mb-6">
                Complete the onboarding process to see personalized data here.
              </p>
              <Button onClick={() => window.location.href = '/onboarding'}>
                Start Onboarding
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Supabase debug page for testing onboarding data and calculations</p>
          <p className="mt-1">
            <a href="/dashboard" className="text-green-600 hover:text-green-700">
              ← Back to Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDebugPage;
