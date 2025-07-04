// Local Authentication Context Implementation
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import type { User, IAuthService } from '../types/services'

interface LocalAuthContextType extends IAuthService {}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined)

interface LocalAuthProviderProps {
  children: ReactNode
}

export const LocalAuthProvider: React.FC<LocalAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize user from localStorage on startup
  useEffect(() => {
    const initializeUser = () => {
      try {
        const stored = localStorage.getItem('financial_copilot_user')
        if (stored) {
          const userData = JSON.parse(stored)
          setUser(userData)
          console.log('✅ Local Auth: User restored from storage:', userData.email)
        } else {
          console.log('❌ Local Auth: No stored user found')
        }
      } catch (error) {
        console.error('❌ Local Auth: Error restoring user:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    
    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create user (accept any email/password for demo)
      const newUser: User = {
        id: 'user-' + Date.now(),
        email: email
      }
      
      setUser(newUser)
      localStorage.setItem('financial_copilot_user', JSON.stringify(newUser))
      console.log('✅ Local Auth: User signed in:', email)
    } catch (error) {
      console.error('❌ Local Auth: Sign in failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string): Promise<void> => {
    setLoading(true)
    
    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create user (accept any email/password for demo)
      const newUser: User = {
        id: 'user-' + Date.now(),
        email: email,
        firstName,
        lastName
      }
      
      setUser(newUser)
      localStorage.setItem('financial_copilot_user', JSON.stringify(newUser))
      console.log('✅ Local Auth: User signed up:', email)
    } catch (error) {
      console.error('❌ Local Auth: Sign up failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setLoading(true)
    
    try {
      // Clear user data
      setUser(null)
      localStorage.removeItem('financial_copilot_user')
      localStorage.removeItem('financial_copilot_onboarding') // Clear onboarding data too
      console.log('✅ Local Auth: User signed out')
    } catch (error) {
      console.error('❌ Local Auth: Sign out failed:', error)
      throw error
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

  const value: LocalAuthContextType = {
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
    <LocalAuthContext.Provider value={value}>
      {children}
    </LocalAuthContext.Provider>
  )
}

export const useLocalAuth = (): LocalAuthContextType => {
  const context = useContext(LocalAuthContext)
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider')
  }
  return context
}
