// Supabase Protected Route Component
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import { supabaseOnboardingService } from '../../services/supabaseOnboarding'

interface SupabaseProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

const SupabaseProtectedRoute: React.FC<SupabaseProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { user, loading } = useSupabaseAuth()
  const location = useLocation()
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null)
  const [checkingOnboarding, setCheckingOnboarding] = useState(requireOnboarding)

  // Check onboarding status when user is authenticated and onboarding is required
  useEffect(() => {
    const checkOnboarding = async () => {
      if (user && requireOnboarding) {
        try {
          const completed = await supabaseOnboardingService.hasCompletedOnboarding()
          setOnboardingComplete(completed)
        } catch (error) {
          console.error('Error checking onboarding status:', error)
          setOnboardingComplete(false)
        } finally {
          setCheckingOnboarding(false)
        }
      } else {
        setCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [user, requireOnboarding])

  // Show loading while checking auth or onboarding status
  if (loading || checkingOnboarding) {
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

  // If onboarding is required but user hasn't completed it
  if (requireOnboarding && onboardingComplete === false) {
    return <Navigate to="/onboarding" replace />
  }

  // If user has onboarding data but is trying to access onboarding again
  if (!requireOnboarding && onboardingComplete === true && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default SupabaseProtectedRoute
