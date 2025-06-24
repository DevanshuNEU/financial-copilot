import React from 'react';
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

const SettingsPage: React.FC = () => {
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
            Manage your Financial Copilot preferences and account settings
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
                <p className="font-medium">International Student</p>
                <p className="text-sm text-gray-500">Monthly Budget: $1,030</p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Edit Profile (Coming Soon)
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
                  <span className="text-sm text-green-600">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Summaries</span>
                  <span className="text-sm text-gray-500">Disabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Reports</span>
                  <span className="text-sm text-gray-500">Disabled</span>
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
            <CardTitle className="text-blue-800">About Financial Copilot</CardTitle>
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
    </div>
  );
};

export default SettingsPage;