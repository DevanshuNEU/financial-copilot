// Logout button component for Financial Copilot
// Handles user logout with confirmation

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogoutButton: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Account</h3>
          <p className="text-sm text-gray-500">
            Signed in as {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoggingOut ? 'Logging out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default LogoutButton;
