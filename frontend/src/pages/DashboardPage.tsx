/**
 * DashboardPage - Redesigned 2025
 * 
 * Clean, modern dashboard content (without layout wrapper)
 * Used with unified MainLayout for consistent navigation
 */

import React, { useState } from 'react';
import { HeroSection } from '../components/dashboard/layout/HeroSection';
import { InsightsGrid } from '../components/dashboard/layout/InsightsGrid';
import AddExpenseModal from '../components/dashboard/AddExpenseModal';
import { useAppData } from '../contexts/AppDataContext';
import { DashboardSkeleton, ComponentErrorBoundary } from '../components/loading';

const DashboardPage: React.FC = () => {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const { appData } = useAppData();

  // Show loading skeleton while data loads
  if (appData.loading && !appData.safeToSpendData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section - Real spending amount + Functional AI input */}
        <HeroSection />
        
        {/* Insights Grid - Real data + Recent transactions + Working actions */}
        <InsightsGrid />
        
        {/* Add Expense Modal */}
        <AddExpenseModal
          open={showAddExpenseModal}
          onOpenChange={setShowAddExpenseModal}
          onExpenseAdded={() => {
            setShowAddExpenseModal(false);
            // Refresh data if needed
          }}
        />
      </div>
    </ComponentErrorBoundary>
  );
};

export default DashboardPage;
