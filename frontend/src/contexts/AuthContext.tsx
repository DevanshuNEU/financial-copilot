// Deprecated AuthContext - Use SupabaseAuthContext instead
// This file exists only to prevent import errors in legacy files

import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  login: () => Promise<void>;
  logout: () => void;
  register: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasOnboardingData: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const value: AuthContextType = {
    user: null,
    login: async () => console.warn('Using deprecated AuthContext'),
    logout: () => console.warn('Using deprecated AuthContext'),
    register: async () => console.warn('Using deprecated AuthContext'),
    isAuthenticated: false,
    isLoading: false,
    hasOnboardingData: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
