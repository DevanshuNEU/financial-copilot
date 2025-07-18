import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { AppErrorBoundary, PageErrorBoundary } from './components/error';
import { initializeSecurity } from './components/security';
import ScrollToTop from './components/ui/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import { MainLayout } from './components/layout/MainLayout'; // New unified layout
import { LandingPage } from './pages'; // Keep landing page for immediate loading
import './styles/glassmorphism.css'; // Import glassmorphism styles
import './App.css';
import './utils/databaseSwitcher'; // Import the database switcher utility

// 🚀 PERFORMANCE OPTIMIZATION: Lazy load dashboard pages for faster initial load
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const BudgetPage = React.lazy(() => import('./pages/BudgetPage'));
const ExpensesPage = React.lazy(() => import('./pages/ExpensesPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));

// Loading component for lazy-loaded pages
const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Loading EXPENSESINK...</p>
    </div>
  </div>
);

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
                  <Suspense fallback={<PageLoadingSpinner />}>
                    <OnboardingPage />
                  </Suspense>
                </PageErrorBoundary>
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Authentication + Onboarding Required */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireOnboarding>
                <MainLayout>
                  <PageErrorBoundary>
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <DashboardPage />
                    </Suspense>
                  </PageErrorBoundary>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute requireOnboarding>
                <MainLayout>
                  <PageErrorBoundary>
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <AnalyticsPage />
                    </Suspense>
                  </PageErrorBoundary>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/budget" element={
              <ProtectedRoute requireOnboarding>
                <MainLayout>
                  <PageErrorBoundary>
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <BudgetPage />
                    </Suspense>
                  </PageErrorBoundary>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute requireOnboarding>
                <MainLayout>
                  <PageErrorBoundary>
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <ExpensesPage />
                    </Suspense>
                  </PageErrorBoundary>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requireOnboarding>
                <MainLayout>
                  <PageErrorBoundary>
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <SettingsPage />
                    </Suspense>
                  </PageErrorBoundary>
                </MainLayout>
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
