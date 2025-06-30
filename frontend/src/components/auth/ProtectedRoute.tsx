// Protected route component for Financial Copilot (DEPRECATED)
// Use SupabaseProtectedRoute instead

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // This component is deprecated - redirect to auth
  return <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
