/**
 * Glassmorphism Navigation Component
 * 
 * Apple-inspired navigation with glass effects and blur
 * Implements Liquid Glass design language for 2025
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppData } from '../../../contexts/AppDataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Home, 
  BarChart3, 
  Target, 
  Receipt, 
  User,
  Wifi
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'budget', label: 'Budget', icon: Target, path: '/budget' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/expenses' },
];

export const GlassmorphismNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appData } = useAppData();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="liquid-nav glass-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center liquid-reflection">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              EXPENSESINK
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    liquid-nav-button flex items-center space-x-2 px-4 py-2 rounded-lg liquid-transition
                    ${isActive 
                      ? 'active glass-md' 
                      : 'glass-sm hover:glass-md'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {/* AI Status */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-green-600 glass-sm px-3 py-1 rounded-full">
              <Wifi className="w-3 h-3" />
              <span>AI Online</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {appData.user?.email || user?.email || 'dev@gmail.com'}
                </div>
                <div className="text-xs text-gray-500">
                  {appData.user?.studentType === 'international' ? 'International Student' : 'Student'}
                </div>
              </div>
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium hover:bg-green-600 liquid-transition liquid-reflection">
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlassmorphismNav;