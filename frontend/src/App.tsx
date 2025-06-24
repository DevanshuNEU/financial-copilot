import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/navigation/Navigation';
import { 
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      
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