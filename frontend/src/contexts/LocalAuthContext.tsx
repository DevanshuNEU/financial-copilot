// Simple Local Authentication Context - 100% Reliable
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
}

interface LocalAuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  signOut: () => Promise<void>
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined)

interface LocalAuthProviderProps {
  children: ReactNode
}

export const LocalAuthProvider: React.FC<LocalAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check for existing user on startup
    const stored = localStorage.getItem('financial_copilot_user')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  })
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    
    // Simulate sign in (for demo - accept any email/password)
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for UX
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: email
    }
    
    setUser(newUser)
    localStorage.setItem('financial_copilot_user', JSON.stringify(newUser))
    setLoading(false)
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string): Promise<void> => {
    setLoading(true)
    
    // Simulate sign up (for demo - accept any email/password)
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for UX
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: email
    }
    
    setUser(newUser)
    localStorage.setItem('financial_copilot_user', JSON.stringify(newUser))
    setLoading(false)
  }

  const signOut = async (): Promise<void> => {
    setLoading(true)
    
    // Clear user data
    setUser(null)
    localStorage.removeItem('financial_copilot_user')
    localStorage.removeItem('financial_copilot_onboarding') // Clear onboarding data too
    
    setLoading(false)
  }

  const value: LocalAuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut
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
