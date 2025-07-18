import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  HelpCircle,
  Github
} from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import EditProfileModal from '../components/settings/EditProfileModal';

const SettingsPage: React.FC = () => {
  const { appData } = useAppData();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Show loading state while data is loading
  if (appData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading your settings...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Extract user data with fallbacks
  const userEmail = appData.user?.email || 'Unknown User';
  const studentType = appData.user?.studentType || 'international';
  const monthlyBudget = appData.onboardingData?.monthlyBudget || 0;
  const currency = appData.user?.preferences?.currency || appData.onboardingData?.currency || 'USD';
  const notifications = appData.user?.preferences?.notifications || {
    budgetWarnings: true,
    dailySummaries: false,
    weeklyReports: false
  };

  // Format student type for display
  const getStudentTypeDisplay = (type: string) => {
    return type === 'international' ? 'International Student' : 'Domestic Student';
  };

  // Format currency display
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get display name
  const getDisplayName = () => {
    const firstName = appData.user?.firstName;
    const lastName = appData.user?.lastName;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    return 'Student';
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <SettingsIcon className="h-8 w-8 text-gray-600" />
            Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your EXPENSESINK preferences and account settings
          </p>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your profile and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Student Profile</p>
                <p className="font-medium">{getDisplayName()}</p>
                <p className="text-sm text-gray-500">{getStudentTypeDisplay(studentType)}</p>
                <p className="text-sm text-gray-500">Monthly Budget: {formatBudget(monthlyBudget)}</p>
                {appData.user?.university && (
                  <p className="text-xs text-gray-400 mt-1">{appData.user.university}</p>
                )}
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">📧 Account: {userEmail}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Signed in • {appData.lastSyncAt ? `Last sync: ${new Date(appData.lastSyncAt).toLocaleString()}` : 'Local data'}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget Warnings</span>
                  <span className={`text-sm ${notifications.budgetWarnings ? 'text-green-600' : 'text-gray-500'}`}>
                    {notifications.budgetWarnings ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Summaries</span>
                  <span className={`text-sm ${notifications.dailySummaries ? 'text-green-600' : 'text-gray-500'}`}>
                    {notifications.dailySummaries ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Reports</span>
                  <span className={`text-sm ${notifications.weeklyReports ? 'text-green-600' : 'text-gray-500'}`}>
                    {notifications.weeklyReports ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Manage Notifications (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your data and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">🔒 Your Data is Secure</p>
                <p className="text-xs text-green-600 mt-1">
                  All financial data is stored locally and encrypted
                </p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Security Settings (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or reset your financial data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">📊 Your Financial Data</p>
                <div className="text-xs text-blue-600 mt-2 space-y-1">
                  <p>• Total Expenses: {appData.expenses.length} transactions</p>
                  <p>• Budget Categories: {appData.budgetCategories.length} active</p>
                  <p>• Storage: Local device (secure & private)</p>
                  <p>• Last Updated: {appData.lastSyncAt ? new Date(appData.lastSyncAt).toLocaleDateString() : 'Today'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  Export Data (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Import Data (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" disabled>
                  Reset All Data (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Information */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">About EXPENSESINK</CardTitle>
            <CardDescription className="text-blue-700">
              Smart money management designed specifically for international students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">🎯 Mission</h4>
                <p className="text-sm text-blue-700">
                  Empowering international students with guilt-free financial awareness 
                  and smart spending insights, not restrictive budgeting.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-800 mb-2">✨ Features</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Safe-to-spend calculator</li>
                  <li>• Visual spending analytics</li>
                  <li>• Encouraging progress tracking</li>
                  <li>• Student-focused insights</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-300">
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" disabled>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Github className="h-4 w-4 mr-2" />
                  View Source
                </Button>
              </div>
              <p className="text-center text-xs text-blue-600 mt-4">
                Version 1.0.0 • Built with React + Flask • Made for students, by students
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </div>
  );
};

export default SettingsPage;