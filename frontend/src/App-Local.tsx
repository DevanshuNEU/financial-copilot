import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LocalAuthProvider } from './contexts/LocalAuthContext';
import Navigation from './components/navigation/Navigation';
import ScrollToTop from './components/ui/ScrollToTop';
import SimpleProtectedRoute from './components/auth/SimpleProtectedRoute';
import SimpleAuthPage from './pages/auth/SimpleAuthPage';
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

function App() {
  return (
    <LocalAuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<SimpleAuthPage />} />
          
          {/* Test Route - Direct Access */}
          <Route path="/test" element={<SuperSimpleTest />} />
          
          {/* Protected Routes - Authentication Required */}
          <Route path="/onboarding" element={
            <SimpleProtectedRoute>
              <OnboardingPage />
            </SimpleProtectedRoute>
          } />
          
          {/* Protected Routes - Authentication + Onboarding Required */}
          <Route path="/dashboard" element={
            <SimpleProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <DashboardPage />
              </div>
            </SimpleProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <SimpleProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <AnalyticsPage />
              </div>
            </SimpleProtectedRoute>
          } />
          
          <Route path="/budget" element={
            <SimpleProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <BudgetPage />
              </div>
            </SimpleProtectedRoute>
          } />
          
          <Route path="/expenses" element={
            <SimpleProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <ExpensesPage />
              </div>
            </SimpleProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <SimpleProtectedRoute requireOnboarding>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <SettingsPage />
              </div>
            </SimpleProtectedRoute>
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
    </LocalAuthProvider>
  );
}

export default App;
