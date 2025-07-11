// Simple Protected Route - No Hanging, No Timeout Issues
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useLocalAuth } from '../../contexts/authContext.local'
import { financialService } from '../../services/financialService'

interface SimpleProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { user, loading } = useLocalAuth()
  const location = useLocation()

  // Show simple loading if auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
    // Simple synchronous check - no async hanging
    const hasOnboardingData = localStorage.getItem('financial_copilot_onboarding')
    
    if (!hasOnboardingData) {
      // User hasn't completed onboarding
      return <Navigate to="/onboarding" replace />
    }
  }

  // If user has onboarding data but is trying to access onboarding again
  if (!requireOnboarding && location.pathname === '/onboarding') {
    const hasOnboardingData = localStorage.getItem('financial_copilot_onboarding')
    
    if (hasOnboardingData) {
      // Existing user trying to access onboarding - redirect to dashboard
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

export default SimpleProtectedRoute
