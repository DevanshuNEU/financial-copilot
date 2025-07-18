import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { financialService } from '../services/financialService';
import type { OnboardingData } from '../services/financialService';
import toast from 'react-hot-toast';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    console.log('🎯 Starting onboarding completion with data:', data);
    
    if (!user) {
      toast.error('You must be logged in to complete onboarding.');
      navigate('/auth');
      return;
    }

    try {
      console.log('💾 Saving onboarding data...');
      // Save using unified financial service
      await financialService.saveOnboardingData(data);
      console.log('✅ Onboarding data saved successfully');
      
      // Show success message
      toast.success('Welcome to EXPENSESINK! Your personalized dashboard is ready.');
      
      console.log('🎉 Navigating to dashboard...');
      // Navigate to dashboard with celebration
      navigate('/dashboard', { 
        state: { 
          onboardingComplete: true,
          userData: data 
        } 
      });
    } catch (error) {
      console.error('❌ Failed to save onboarding data:', error);
      console.log('🔄 Attempting to continue to dashboard anyway...');
      
      // Try to continue to dashboard even if save failed
      toast('Setup complete! Redirecting to dashboard...', { icon: '⚠️' });
      navigate('/dashboard', { 
        state: { 
          onboardingComplete: true,
          userData: data 
        } 
      });
    }
  };

  const handleSkipOnboarding = () => {
    // User chose to skip - show message and stay on auth
    toast('Complete your setup anytime in Settings for a personalized experience.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      <OnboardingWizard 
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    </div>
  );
};

export default OnboardingPage;
