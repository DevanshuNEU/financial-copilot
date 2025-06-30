import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import Navigation from './components/navigation/Navigation';
import ScrollToTop from './components/ui/ScrollToTop';
import SupabaseProtectedRoute from './components/auth/SupabaseProtectedRoute';
import SupabaseAuthPage from './pages/auth/SupabaseAuthPage';
import { 
  LandingPage,
  DashboardPage, 
  AnalyticsPage, 
  BudgetPage, 
  ExpensesPage, 
  SettingsPage 
} from './pages';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingDebugPage from './pages/OnboardingDebugPage';
import './App.css';

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<SupabaseAuthPage />} />
          
          {/* Protected Routes - Authentication Required */}
          <Route path="/onboarding" element={
            <SupabaseProtectedRoute>
              <OnboardingPage />
            </SupabaseProtectedRoute>
          } />
          
          {/* Protected Routes - Authentication + Onboarding Required */}
          <Route path="/dashboard" element={
            <SupabaseProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <DashboardPage />
              </div>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <SupabaseProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <AnalyticsPage />
              </div>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/budget" element={
            <SupabaseProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <BudgetPage />
              </div>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/expenses" element={
            <SupabaseProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <ExpensesPage />
              </div>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <SupabaseProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <SettingsPage />
              </div>
            </SupabaseProtectedRoute>
          } />
          
          {/* Debug Page - Protected but doesn't require onboarding */}
          <Route path="/debug" element={
            <SupabaseProtectedRoute>
              <OnboardingDebugPage />
            </SupabaseProtectedRoute>
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
    </SupabaseAuthProvider>
  );
}

export default App;
