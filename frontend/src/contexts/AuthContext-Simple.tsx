// Simplified Auth Context - Avoids conditional hook calls
import React, { ReactNode } from 'react'
import { databaseConfig } from '../config/database'
import { LocalAuthProvider } from './authContext.local'
import { SupabaseAuthProvider } from './authContext.supabase'

interface AuthProviderProps {
  children: ReactNode
}

// Main Auth Provider - switches based on config
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Always render both providers but wrap inactive one in a way that doesn't interfere
  if (databaseConfig.mode === 'local') {
    console.log('🔐 Using LOCAL authentication')
    return <LocalAuthProvider>{children}</LocalAuthProvider>
  } else {
    console.log('🔐 Using SUPABASE authentication')
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
  }
}

// Export hooks from the individual contexts
export { useLocalAuth } from './authContext.local'
export { useSupabaseAuth } from './authContext.supabase'

// Create a factory function for the auth hook
export const createAuthHook = () => {
  if (databaseConfig.mode === 'local') {
    return require('./authContext.local').useLocalAuth
  } else {
    return require('./authContext.supabase').useSupabaseAuth
  }
}

// Main auth hook
export const useAuth = createAuthHook()

// Export auth types for TypeScript
export type { IAuthService } from '../types/services'
export type { User } from '../types/services'
