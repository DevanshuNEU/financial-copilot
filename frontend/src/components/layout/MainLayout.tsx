/**
 * MAIN LAYOUT COMPONENT
 * 
 * Unified layout wrapper for all protected pages
 * - Uses UnifiedFloatingNav in authenticated mode
 * - Consistent spacing and background
 * - Responsive design
 * - Beautiful gradient backgrounds
 */

import React from 'react';
import { UnifiedFloatingNav } from '../navigation/UnifiedFloatingNav';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* Unified Navigation in Authenticated Mode */}
      <UnifiedFloatingNav mode="authenticated" />
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Content */}
      <div className={`relative z-10 pt-24 pb-8 px-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;