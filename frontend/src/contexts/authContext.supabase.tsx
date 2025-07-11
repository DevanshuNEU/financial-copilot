// Supabase Authentication Context Implementation
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User, IAuthService } from '../types/services'

interface SupabaseAuthContextType extends IAuthService {}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

interface SupabaseAuthProviderProps {
  children: ReactNode
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Convert Supabase user to our User type
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    firstName: supabaseUser.user_metadata?.firstName,
    lastName: supabaseUser.user_metadata?.lastName
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Supabase Auth: Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ? convertSupabaseUser(session.user) : null)
          console.log('✅ Supabase Auth: Session restored:', session?.user?.email || 'None')
        }
      } catch (error) {
        console.error('❌ Supabase Auth: Session initialization failed:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Supabase Auth: State change:', event)
        setSession(session)
        setUser(session?.user ? convertSupabaseUser(session.user) : null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      console.log('✅ Supabase Auth: User signed in:', email)
    } catch (error: any) {
      console.error('❌ Supabase Auth: Sign in failed:', error.message)
      throw new Error(error.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string): Promise<void> => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: firstName || '',
            lastName: lastName || ''
          }
        }
      })

      if (error) {
        throw error
      }

      console.log('✅ Supabase Auth: User signed up:', email)
    } catch (error: any) {
      console.error('❌ Supabase Auth: Sign up failed:', error.message)
      throw new Error(error.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      console.log('✅ Supabase Auth: User signed out')
    } catch (error: any) {
      console.error('❌ Supabase Auth: Sign out failed:', error.message)
      throw new Error(error.message || 'Sign out failed')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = (): User | null => {
    return user
  }

  // Legacy method aliases for compatibility
  const login = signIn
  const register = signUp
  const logout = signOut

  const value: SupabaseAuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    login,
    register,
    logout
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}
