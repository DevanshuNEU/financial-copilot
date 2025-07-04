// Main Auth Context - Properly handles switching without hook violations
import React, { ReactNode, createContext, useContext } from 'react'
import { databaseConfig } from '../config/database'
import { LocalAuthProvider, useLocalAuth } from './authContext.local'
import { SupabaseAuthProvider, useSupabaseAuth } from './authContext.supabase'
import type { IAuthService } from '../types/services'

interface AuthProviderProps {
  children: ReactNode
}

// Main Auth Provider - switches based on config
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  if (databaseConfig.mode === 'local') {
    console.log('🔐 Using LOCAL authentication')
    return <LocalAuthProvider>{children}</LocalAuthProvider>
  } else {
    console.log('🔐 Using SUPABASE authentication')
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
  }
}

// Create a unified auth hook that works with both providers
export const useAuth = (): IAuthService => {
  if (databaseConfig.mode === 'local') {
    return useLocalAuth()
  } else {
    return useSupabaseAuth()
  }
}

// Export individual hooks for direct access if needed
export { useLocalAuth, useSupabaseAuth }

// Export auth types for TypeScript
export type { IAuthService } from '../types/services'
export type { User } from '../types/services'
