/**
 * DashboardPage - Redesigned 2025
 * 
 * Clean, modern dashboard using the new layout system
 * Implements Apple-inspired design with glassmorphism
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import DashboardLayout from '../components/dashboard/layout';
import AddExpenseModal from '../components/dashboard/AddExpenseModal';
import { 
  ComponentErrorBoundary
} from '../components/loading';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { appData } = useAppData();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  return (
    <ComponentErrorBoundary>
      <DashboardLayout>
        {/* Additional content can be added here */}
        {/* The main layout (Hero + Insights) is handled by DashboardLayout */}
        
        {/* Add Expense Modal */}
        <AddExpenseModal
          open={showAddExpenseModal}
          onOpenChange={setShowAddExpenseModal}
          onExpenseAdded={() => {
            setShowAddExpenseModal(false);
            // Refresh data if needed
          }}
        />
      </DashboardLayout>
    </ComponentErrorBoundary>
  );
};

export default DashboardPage;