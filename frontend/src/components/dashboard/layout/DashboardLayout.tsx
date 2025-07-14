/**
 * DashboardLayout Component
 * 
 * Professional layout with REAL data integration and error handling
 * Maintains beautiful design while restoring full functionality
 */

import React from 'react';
import { GlassmorphismNav } from './GlassmorphismNav';
import { HeroSection } from './HeroSection';
import { InsightsGrid } from './InsightsGrid';
import { useAppData } from '../../../contexts/AppDataContext';
import { DashboardSkeleton, ComponentErrorBoundary } from '../../loading';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const { appData } = useAppData();

  // Show loading skeleton while data loads
  if (appData.loading && !appData.safeToSpendData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-green-50 to-white ${className}`}>
        <GlassmorphismNav />
        <main className="container mx-auto px-4 py-6">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className={`min-h-screen bg-gradient-to-br from-green-50 to-white ${className}`}>
        {/* Glassmorphism Navigation */}
        <GlassmorphismNav />
        
        {/* Main Content Container */}
        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Hero Section - Real spending amount + Functional AI input */}
          <HeroSection />
          
          {/* Insights Grid - Real data + Recent transactions + Working actions */}
          <InsightsGrid />
          
          {/* Additional Content */}
          {children && (
            <section className="space-y-6">
              {children}
            </section>
          )}
        </main>
      </div>
    </ComponentErrorBoundary>
  );
};

export default DashboardLayout;