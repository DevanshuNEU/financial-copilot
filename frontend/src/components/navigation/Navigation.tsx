import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  PiggyBank, 
  Receipt, 
  Settings,
  DollarSign
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', description: 'Quick overview' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', description: 'Charts & insights' },
    { path: '/budget', icon: PiggyBank, label: 'Budget', description: 'Manage budgets' },
    { path: '/expenses', icon: Receipt, label: 'Expenses', description: 'Track spending' },
    { path: '/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Financial Copilot</h1>
              <p className="text-xs text-gray-500">Smart money management for students</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:block">{item.label}</span>
                  <span className="sm:hidden text-[10px]">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
