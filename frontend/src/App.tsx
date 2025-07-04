import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import Navigation from './components/navigation/Navigation';
import ScrollToTop from './components/ui/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import { 
  LandingPage,
  DashboardPage, 
  AnalyticsPage, 
  BudgetPage, 
  ExpensesPage, 
  SettingsPage 
} from './pages';
import OnboardingPage from './pages/OnboardingPage';
import SuperSimpleTest from './pages/SuperSimpleTest';
import './App.css';

// Import the database switcher utility
import './utils/databaseSwitcher';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Test Route - Direct Access */}
            <Route path="/test" element={<SuperSimpleTest />} />
            
            {/* Protected Routes - Authentication Required */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Authentication + Onboarding Required */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <DashboardPage />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <AnalyticsPage />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/budget" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <BudgetPage />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <ExpensesPage />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <SettingsPage />
                </div>
              </ProtectedRoute>
            } />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </Router>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
