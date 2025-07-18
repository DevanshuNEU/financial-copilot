import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { logWebVitals } from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🚀 EXPENSESINK Performance Monitoring - Phase 8 Optimization
logWebVitals();
