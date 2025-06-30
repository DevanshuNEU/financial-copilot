// Main authentication page for Financial Copilot
// Professional design with OAuth and email/password options

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OAuthButtons from './OAuthButtons';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string>('');

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const oauthError = urlParams.get('error');

    if (oauthError) {
      setError('Authentication failed. Please try again.');
      // Clean URL
      navigate('/auth', { replace: true });
    } else if (token) {
      // OAuth success will be handled by AuthContext
      // Clean URL
      navigate('/auth', { replace: true });
    }
  }, [location, navigate]);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      // If user has onboarding data, go to dashboard
      // Note: This old auth page is deprecated, using SupabaseAuthPage instead
      // if (user.has_onboarding_data) {
      //   navigate('/dashboard');
      // } else {
      //   // New user, send to onboarding
      //   navigate('/onboarding');
      // }
      navigate('/dashboard'); // Simple redirect for now
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">FC</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Financial Copilot
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Smart money management for students
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Mode Toggle */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* OAuth Buttons */}
          <OAuthButtons onError={setError} />

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="mt-6">
            {mode === 'login' ? (
              <LoginForm onError={setError} />
            ) : (
              <RegisterForm onError={setError} />
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
