// Unified Protected Route - Works with both Local and Supabase
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { financialService } from '../../services/financialService'
import { databaseConfig } from '../../config/database'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">
            {databaseConfig.mode === 'local' 
              ? 'Checking local storage...' 
              : 'Checking authentication...'
            }
          </p>
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // If onboarding is required, check completion status
  if (requireOnboarding) {
    if (databaseConfig.mode === 'local') {
      // For local mode, do synchronous check to avoid hanging
      const hasOnboardingData = localStorage.getItem('financial_copilot_onboarding')
      
      if (!hasOnboardingData) {
        // User hasn't completed onboarding
        return <Navigate to="/onboarding" replace />
      }
    } else {
      // For Supabase mode, we'd need to add async checking here
      // For now, we'll use a similar approach but could enhance later
      // This is where we could add the async onboarding check for Supabase
    }
  }

  // If user has onboarding data but is trying to access onboarding again
  if (!requireOnboarding && location.pathname === '/onboarding') {
    if (databaseConfig.mode === 'local') {
      const hasOnboardingData = localStorage.getItem('financial_copilot_onboarding')
      
      if (hasOnboardingData) {
        // Existing user trying to access onboarding - redirect to dashboard
        return <Navigate to="/dashboard" replace />
      }
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
