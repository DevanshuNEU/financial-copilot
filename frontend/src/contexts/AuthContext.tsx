// Main Auth Context - Properly handles switching without hook violations
import React, { ReactNode } from 'react'
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
// This will be called from within the appropriate provider context
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useAuth = (): IAuthService => {
  // Since the provider is chosen at the top level, we can safely call the appropriate hook
  if (databaseConfig.mode === 'local') {
    // This will only be called when LocalAuthProvider is active
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLocalAuth()
  } else {
    // This will only be called when SupabaseAuthProvider is active
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSupabaseAuth()
  }
}

// Export individual hooks for direct access if needed
export { useLocalAuth, useSupabaseAuth }

// Export auth types for TypeScript
export type { IAuthService } from '../types/services'
export type { User } from '../types/services'
