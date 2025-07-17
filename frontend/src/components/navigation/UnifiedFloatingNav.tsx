/**
 * UNIFIED FLOATING GLASSMORPHISM NAVIGATION
 * 
 * Reusable navigation component that adapts to:
 * - Landing Page (public): Logo + Sign In + Get Started
 * - Dashboard Pages (authenticated): Logo + Navigation + User Profile
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LiquidGlassSVG } from '../ui/LiquidGlassSVG';
import { 
  Home, 
  BarChart3, 
  Target, 
  Receipt, 
  LogOut,
  Settings
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface UnifiedNavProps {
  mode: 'public' | 'authenticated';
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'budget', label: 'Budget', icon: Target, path: '/budget' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/expenses' },
];

export const UnifiedFloatingNav: React.FC<UnifiedNavProps> = ({ 
  mode, 
  onGetStarted, 
  onSignIn 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appData } = useAppData();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll effect for dynamic blur
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowUserMenu(false);
  };

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut, navigate]);

  // Enhanced user info (only for authenticated mode)
  const userDisplayName = appData.user?.email || user?.email || 'dev@gmail.com';
  const userInitials = userDisplayName.split('@')[0].slice(0, 2).toUpperCase();

  return (
    <>
      {/* SVG Filters for Liquid Glass Effects */}
      <LiquidGlassSVG />
      
      <nav className={`
        fixed top-6 left-1/2 transform -translate-x-1/2 z-50 
        liquid-transition w-[90%] max-w-4xl
        ${scrolled 
          ? 'glass-xl shadow-2xl' 
          : 'glass-lg shadow-xl'
        }
      `}
      style={{
        height: '72px',
        borderRadius: '36px'
      }}>
      <div className="h-full flex items-center justify-between px-8">
        
        {/* Logo with Brand Text - Universal */}
        <button
          onClick={() => mode === 'public' ? navigate('/') : handleNavigation('/dashboard')}
          className="flex items-center space-x-3 group"
          title="Financial Copilot"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md liquid-transition hover:shadow-lg hover:scale-105">
            <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform">$</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-semibold text-gray-900 tracking-tight">Financial Copilot</div>
            <div className="text-xs text-emerald-600 font-medium">Smart Finance AI</div>
          </div>
        </button>

        {/* Center Content - Changes based on mode */}
        {mode === 'authenticated' ? (
          /* Navigation Icons for Authenticated Users */
          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex flex-col items-center space-y-1 p-3 rounded-2xl liquid-transition group relative min-w-[60px]
                    ${isActive 
                      ? 'bg-emerald-500/15 text-emerald-600' 
                      : 'text-gray-600 hover:bg-emerald-500/10 hover:text-emerald-600'
                    }
                  `}
                  title={item.label}
                >
                  <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Empty space for public mode */
          <div className="flex-1"></div>
        )}

        {/* Right Section - Changes based on mode */}
        {mode === 'authenticated' ? (
          /* User Profile for Authenticated Users */
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 glass-md px-4 py-3 rounded-2xl liquid-transition hover:glass-lg group"
              title={userDisplayName}
            >
              {/* User Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md liquid-transition hover:shadow-lg hover:scale-105">
                  {userInitials}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              
              {/* User Info */}
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-900">{userDisplayName.split('@')[0]}</div>
                <div className="text-xs text-emerald-600 font-medium">Online</div>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-3 w-56 glass-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20">
                
                {/* User Info - Compact */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {userInitials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{userDisplayName}</div>
                      <div className="text-xs text-emerald-600">Online • Student</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center space-x-3 px-3 py-3 glass-sm hover:glass-md rounded-xl liquid-transition group"
                  >
                    <Settings className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
                    <span className="text-sm text-gray-900 group-hover:text-emerald-600">Settings</span>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-3 glass-sm hover:glass-md rounded-xl liquid-transition group mt-1"
                  >
                    <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                    <span className="text-sm text-gray-900 group-hover:text-red-600">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Auth Buttons for Public Users */
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={onSignIn}
              className="glass-button-secondary text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-xl liquid-transition"
            >
              Sign In
            </Button>
            <Button 
              onClick={onGetStarted}
              className="glass-button-primary px-6 py-2 rounded-xl liquid-transition hover:scale-105"
            >
              Get Started Free
            </Button>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default UnifiedFloatingNav;