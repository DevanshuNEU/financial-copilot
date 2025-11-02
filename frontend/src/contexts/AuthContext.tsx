// Main Auth Context - Properly handles switching without hook violations
import React, { ReactNode, createContext, useContext } from 'react'
import { databaseConfig } from '../config/database'
import { LocalAuthProvider, useLocalAuth } from './authContext.local'
import { SupabaseAuthProvider, useSupabaseAuth } from './authContext.supabase'
import type { IAuthService } from '../types/services'

interface AuthProviderProps {
  children: ReactNode
}

// Create a unified context
const AuthContext = createContext<IAuthService | null>(null)

// Wrapper providers that inject the correct implementation
const LocalWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useLocalAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const SupabaseWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// Main Auth Provider - switches based on config
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  if (databaseConfig.mode === 'local') {
    console.log('🔐 Using LOCAL authentication')
    return (
      <LocalAuthProvider>
        <LocalWrapper>{children}</LocalWrapper>
      </LocalAuthProvider>
    )
  } else {
    console.log('🔐 Using SUPABASE authentication')
    return (
      <SupabaseAuthProvider>
        <SupabaseWrapper>{children}</SupabaseWrapper>
      </SupabaseAuthProvider>
    )
  }
}

// ✅ FIXED: Single hook that works regardless of provider
export const useAuth = (): IAuthService => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Export individual hooks for direct access if needed (rare)
export { useLocalAuth, useSupabaseAuth }

// Export auth types for TypeScript
export type { IAuthService } from '../types/services'
export type { User } from '../types/services'
