import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { supabaseOnboardingService, OnboardingData } from '../services/supabaseOnboarding';
import toast from 'react-hot-toast';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) {
      toast.error('You must be logged in to complete onboarding.');
      navigate('/auth');
      return;
    }

    try {
      // Save to Supabase database
      await supabaseOnboardingService.saveOnboardingData(data);
      
      // Show success message
      toast.success('Welcome to Financial Copilot! Your personalized dashboard is ready.');
      
      // Navigate to dashboard with celebration
      navigate('/dashboard', { 
        state: { 
          onboardingComplete: true,
          userData: data 
        } 
      });
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      toast.error('There was an issue saving your data. Please try again.');
    }
  };

  const handleSkipOnboarding = () => {
    // User chose to skip - show message and stay on auth
    toast('Complete your setup anytime in Settings for a personalized experience.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/20"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <OnboardingWizard 
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
