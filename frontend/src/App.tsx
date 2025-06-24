import React from 'react';
import Dashboard from './components/dashboard/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <>
      <Dashboard />
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
    </>
  );
}

export default App;
