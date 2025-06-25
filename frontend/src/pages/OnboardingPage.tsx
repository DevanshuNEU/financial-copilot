import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { motion } from 'framer-motion';

interface OnboardingData {
  monthlyBudget: number;
  currency: string;
  hasMealPlan: boolean;
  fixedCosts: Array<{ name: string; amount: number; category: string }>;
  spendingCategories: Record<string, number>;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // TODO: Save onboarding data to backend
      console.log('Onboarding completed with data:', data);
      
      // For now, store in localStorage until we build the API
      localStorage.setItem('financialCopilot_onboardingComplete', 'true');
      localStorage.setItem('financialCopilot_userData', JSON.stringify(data));
      
      // Navigate to dashboard with celebration
      navigate('/dashboard', { 
        state: { 
          onboardingComplete: true,
          userData: data 
        } 
      });
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      // Still navigate to dashboard even if save fails
      navigate('/dashboard');
    }
  };

  const handleSkipOnboarding = () => {
    // User chose to skip - go to dashboard with default data
    localStorage.setItem('financialCopilot_onboardingSkipped', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      </div>

      {/* Floating Student Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-6 right-6 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-xs"
      >
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎓</span>
            <span className="font-semibold text-gray-900">Student Tip</span>
          </div>
          <p className="text-gray-600">
            Take your time! This setup will make budgeting so much easier throughout your semester.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;