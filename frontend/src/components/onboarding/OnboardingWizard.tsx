import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

// Step Components (to be created)
import FinancialSituationStep from './FinancialSituationStep';
import FixedCostsStep from './FixedCostsStep';
import SpendingCategoriesStep from './SpendingCategoriesStep';

interface OnboardingData {
  monthlyBudget: number;
  currency: string;
  hasMealPlan: boolean;
  fixedCosts: Array<{ name: string; amount: number; category: string }>;
  spendingCategories: Record<string, number>;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    monthlyBudget: 0,
    currency: 'USD',
    hasMealPlan: false,
    fixedCosts: [],
    spendingCategories: {}
  });

  const steps = [
    {
      id: 'financial-situation',
      title: 'Financial Situation',
      subtitle: "What's your monthly situation?",
      component: FinancialSituationStep
    },
    {
      id: 'fixed-costs',
      title: 'Fixed Costs',
      subtitle: 'What do you pay for every month?',
      component: FixedCostsStep
    },
    {
      id: 'spending-categories',
      title: 'Spending Categories',
      subtitle: "Let's organize your spending",
      component: SpendingCategoriesStep
    }
  ];

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="font-semibold text-gray-900">EXPENSESINK</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-8">
              {/* Step Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].subtitle}
                </h1>
                <p className="text-gray-600">
                  This will take less than 2 minutes. We'll use this to personalize your experience.
                </p>
              </motion.div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent
                    data={data}
                    onUpdate={updateData}
                    onNext={nextStep}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100"
              >
                <div className="flex items-center gap-4">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  
                  {onSkip && currentStep === 0 && (
                    <Button
                      variant="ghost"
                      onClick={onSkip}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      I'll do this later
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete Setup
                    </Button>
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Encouraging Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500">
            🎓 Built by students, for students. Your data stays private and secure.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;