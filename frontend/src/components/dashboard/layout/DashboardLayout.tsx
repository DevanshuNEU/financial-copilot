/**
 * DashboardLayout Component
 * 
 * Professional layout structure for the redesigned dashboard
 * Implements Apple-inspired design with proper information hierarchy
 */

import React from 'react';
import { GlassmorphismNav } from './GlassmorphismNav';
import { HeroSection } from './HeroSection';
import { InsightsGrid } from './InsightsGrid';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-white ${className}`}>
      {/* Glassmorphism Navigation */}
      <GlassmorphismNav />
      
      {/* Main Content Container */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section - Spending Amount + AI Input */}
        <HeroSection />
        
        {/* Insights Grid - Today's Power, Financial Flow, AI Insights */}
        <InsightsGrid />
        
        {/* Additional Content */}
        {children && (
          <section className="space-y-6">
            {children}
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;