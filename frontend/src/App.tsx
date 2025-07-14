import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { AppErrorBoundary, PageErrorBoundary } from './components/error';
import { initializeSecurity } from './components/security';
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
import './App.css';

// Import the database switcher utility
import './utils/databaseSwitcher';

function App() {
  // Initialize security on app start
  useEffect(() => {
    initializeSecurity();
  }, []);

  return (
    <AppErrorBoundary>
        <ErrorProvider>
          <AuthProvider>
            <AppDataProvider>
              <Router>
                <ScrollToTop />
                <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes - Authentication Required */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <PageErrorBoundary>
                  <OnboardingPage />
                </PageErrorBoundary>
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Authentication + Onboarding Required */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireOnboarding>
                <PageErrorBoundary>
                  <DashboardPage />
                </PageErrorBoundary>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <PageErrorBoundary>
                    <AnalyticsPage />
                  </PageErrorBoundary>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/budget" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <PageErrorBoundary>
                    <BudgetPage />
                  </PageErrorBoundary>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <PageErrorBoundary>
                    <ExpensesPage />
                  </PageErrorBoundary>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requireOnboarding>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <PageErrorBoundary>
                    <SettingsPage />
                  </PageErrorBoundary>
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
  </ErrorProvider>
</AppErrorBoundary>
  );
}

export default App;
