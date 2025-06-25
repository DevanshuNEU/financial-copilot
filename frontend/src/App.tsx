import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/navigation/Navigation';
import ScrollToTop from './components/ui/ScrollToTop';
import { 
  LandingPage,
  DashboardPage, 
  AnalyticsPage, 
  BudgetPage, 
  ExpensesPage, 
  SettingsPage 
} from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Beautiful Landing Page - No Navigation */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App Pages - With Navigation */}
        <Route path="/dashboard" element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <DashboardPage />
          </div>
        } />
        <Route path="/analytics" element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <AnalyticsPage />
          </div>
        } />
        <Route path="/budget" element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <BudgetPage />
          </div>
        } />
        <Route path="/expenses" element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <ExpensesPage />
          </div>
        } />
        <Route path="/settings" element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <SettingsPage />
          </div>
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
  );
}

export default App;
