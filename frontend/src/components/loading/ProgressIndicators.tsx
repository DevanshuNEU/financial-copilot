/**
 * Progress Indicators for Complex Operations
 * Step-by-step progress tracking for multi-step processes
 */

import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProgressBar, CircularProgress } from './LoadingComponents';

// Progress step status
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: StepStatus;
  error?: string;
}

// Step indicator component
interface StepIndicatorProps {
  step: ProgressStep;
  isLast?: boolean;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  step, 
  isLast = false, 
  className 
}) => {
  const getStepIcon = () => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-white animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-white" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = () => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getLineColor = () => {
    return step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300';
  };

  return (
    <div className={cn('flex items-start', className)}>
      <div className="flex flex-col items-center">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
          getStepColor()
        )}>
          {getStepIcon()}
        </div>
        {!isLast && (
          <div className={cn(
            'w-0.5 h-16 mt-2 transition-colors',
            getLineColor()
          )} />
        )}
      </div>
      <div className="ml-4 flex-1">
        <h3 className={cn(
          'text-sm font-medium',
          step.status === 'active' ? 'text-blue-600' : 'text-gray-900'
        )}>
          {step.title}
        </h3>
        {step.description && (
          <p className="text-sm text-gray-500 mt-1">
            {step.description}
          </p>
        )}
        {step.error && (
          <p className="text-sm text-red-600 mt-1">
            {step.error}
          </p>
        )}
      </div>
    </div>
  );
};

// Multi-step progress component
interface MultiStepProgressProps {
  steps: ProgressStep[];
  className?: string;
}

export const MultiStepProgress: React.FC<MultiStepProgressProps> = ({ 
  steps, 
  className 
}) => {
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="text-gray-900 font-medium">
            {completedSteps} of {totalSteps} completed
          </span>
        </div>
        <ProgressBar 
          progress={progress} 
          color="primary" 
          showPercentage={false}
          animated={true}
        />
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <StepIndicator 
            key={step.id} 
            step={step} 
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

// Onboarding progress component
interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  className?: string;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  className
}) => {
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Step {currentStep} of {totalSteps}</span>
        <span className="text-gray-900 font-medium">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      <ProgressBar 
        progress={progress} 
        color="primary" 
        showPercentage={false}
        animated={true}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {stepTitles.map((title, index) => (
          <div 
            key={index}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              index < currentStep - 1 
                ? 'bg-green-100 text-green-800' 
                : index === currentStep - 1
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-500'
            )}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

// File upload progress component
interface FileUploadProgressProps {
  files: Array<{
    name: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
  }>;
  className?: string;
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({ 
  files, 
  className 
}) => {
  const totalProgress = files.reduce((sum, file) => sum + file.progress, 0) / files.length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          Uploading {files.length} file{files.length > 1 ? 's' : ''}
        </h3>
        <span className="text-sm text-gray-500">
          {Math.round(totalProgress)}%
        </span>
      </div>
      
      <ProgressBar 
        progress={totalProgress} 
        color="primary" 
        showPercentage={false}
        animated={true}
      />
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </span>
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {file.progress}%
                  </span>
                </div>
              </div>
              <div className="mt-1">
                <ProgressBar 
                  progress={file.progress} 
                  size="sm"
                  color={file.status === 'error' ? 'error' : 'primary'}
                  showPercentage={false}
                  animated={file.status === 'uploading'}
                />
              </div>
              {file.error && (
                <p className="text-xs text-red-600 mt-1">{file.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data processing progress component
interface DataProcessingProgressProps {
  title: string;
  currentOperation: string;
  progress: number;
  estimatedTime?: string;
  className?: string;
}

export const DataProcessingProgress: React.FC<DataProcessingProgressProps> = ({
  title,
  currentOperation,
  progress,
  estimatedTime,
  className
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <CircularProgress 
            progress={progress} 
            size="sm" 
            color="primary"
            showPercentage={false}
          />
          <span className="text-sm font-medium text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-700">{currentOperation}</span>
        </div>
        
        <ProgressBar 
          progress={progress} 
          color="primary" 
          showPercentage={false}
          animated={true}
        />
        
        {estimatedTime && (
          <p className="text-sm text-gray-500">
            Estimated time remaining: {estimatedTime}
          </p>
        )}
      </div>
    </div>
  );
};

// Hook for managing multi-step progress
export const useMultiStepProgress = (initialSteps: ProgressStep[]) => {
  const [steps, setSteps] = useState<ProgressStep[]>(initialSteps);

  const updateStep = (stepId: string, updates: Partial<ProgressStep>) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId 
          ? { ...step, ...updates }
          : step
      )
    );
  };

  const completeStep = (stepId: string) => {
    updateStep(stepId, { status: 'completed' });
  };

  const setStepActive = (stepId: string) => {
    updateStep(stepId, { status: 'active' });
  };

  const setStepError = (stepId: string, error: string) => {
    updateStep(stepId, { status: 'error', error });
  };

  const resetSteps = () => {
    setSteps(initialSteps);
  };

  const getProgress = () => {
    const completed = steps.filter(step => step.status === 'completed').length;
    return (completed / steps.length) * 100;
  };

  return {
    steps,
    updateStep,
    completeStep,
    setStepActive,
    setStepError,
    resetSteps,
    getProgress
  };
};

export default {
  StepIndicator,
  MultiStepProgress,
  OnboardingProgress,
  FileUploadProgress,
  DataProcessingProgress,
  useMultiStepProgress
};