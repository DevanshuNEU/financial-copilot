/**
 * Enhanced Form Error Handling Components and Hooks
 * Provides comprehensive form validation with field-level error states
 */

import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { cn } from '../../lib/utils';

// Form validation error types
export interface FormFieldError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'range' | 'custom';
  value?: unknown;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
  warnings: FormFieldError[];
}

export interface FormState<T> {
  values: T;
  errors: Record<string, FormFieldError | undefined>;
  warnings: Record<string, FormFieldError | undefined>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Hook for managing form state with comprehensive error handling
export const useFormWithErrors = <T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: (values: T) => FormValidationResult
) => {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    warnings: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false
  });

  // Validate a single field
  const validateField = useCallback((field: string, value: unknown): FormFieldError | null => {
    if (!validationSchema) return null;
    
    const result = validationSchema({ ...formState.values, [field]: value });
    const fieldError = result.errors.find(error => error.field === field);
    
    return fieldError || null;
  }, [formState.values, validationSchema]);

  // Set field value with validation
  const setFieldValue = useCallback((field: string, value: unknown) => {
    const fieldError = validateField(field, value);
    
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: fieldError 
        ? { ...prev.errors, [field]: fieldError }
        : { ...prev.errors, [field]: undefined },
      touched: { ...prev.touched, [field]: true },
      isDirty: true
    }));
  }, [validateField]);

  // Set field error manually
  const setFieldError = useCallback((field: string, error: FormFieldError | null) => {
    setFormState(prev => ({
      ...prev,
      errors: error
        ? { ...prev.errors, [field]: error }
        : { ...prev.errors, [field]: undefined }
    }));
  }, []);

  // Set multiple field errors
  const setFieldErrors = useCallback((errors: FormFieldError[]) => {
    const errorMap: Record<string, FormFieldError> = {};
    errors.forEach(error => {
      errorMap[error.field] = error;
    });
    
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errorMap }
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {},
      warnings: {}
    }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      warnings: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    });
  }, [initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback((field: string) => {
    const fieldError = formState.errors[field];
    const fieldWarning = formState.warnings[field];
    const isTouched = formState.touched[field];
    
    return {
      value: formState.values[field],
      error: fieldError,
      warning: fieldWarning,
      touched: isTouched,
      hasError: Boolean(fieldError),
      hasWarning: Boolean(fieldWarning),
      onChange: (value: unknown) => setFieldValue(field, value),
      onBlur: () => setFormState(prev => ({ 
        ...prev, 
        touched: { ...prev.touched, [field]: true } 
      }))
    };
  }, [formState, setFieldValue]);

  return {
    formState,
    setFieldValue,
    setFieldError,
    setFieldErrors,
    clearErrors,
    resetForm,
    getFieldProps
  };
};

// Enhanced Form Field Component with Error Display
interface FormFieldProps {
  children: React.ReactNode;
  error?: FormFieldError;
  warning?: FormFieldError;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  children, 
  error, 
  warning, 
  required,
  className 
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
      {error && (
        <div className="flex items-start space-x-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error.message}</span>
        </div>
      )}
      {warning && !error && (
        <div className="flex items-start space-x-2 text-sm text-yellow-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{warning.message}</span>
        </div>
      )}
    </div>
  );
};

// Form Summary Component showing all errors
interface FormErrorSummaryProps {
  errors: Record<string, FormFieldError | undefined>;
  warnings?: Record<string, FormFieldError | undefined>;
  className?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({ 
  errors, 
  warnings, 
  className 
}) => {
  const errorList = Object.values(errors).filter((error): error is FormFieldError => error !== undefined);
  const warningList = Object.values(warnings || {}).filter((warning): warning is FormFieldError => warning !== undefined);
  
  if (errorList.length === 0 && warningList.length === 0) {
    return null;
  }
  
  return (
    <div className={cn('space-y-2', className)}>
      {errorList.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {errorList.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {warningList.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium text-yellow-800">Please review:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                {warningList.map((warning, index) => (
                  <li key={index}>{warning.message}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Success message component
interface FormSuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const FormSuccessMessage: React.FC<FormSuccessMessageProps> = ({ 
  message, 
  onDismiss,
  className 
}) => {
  return (
    <Alert className={cn('border-green-200 bg-green-50', className)}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center justify-between">
          <span>{message}</span>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Common validation functions
export const validationRules = {
  required: (value: unknown, fieldName: string): FormFieldError | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        field: fieldName,
        message: `${fieldName} is required`,
        type: 'required',
        value
      };
    }
    return null;
  },
  
  email: (value: unknown, fieldName: string): FormFieldError | null => {
    if (typeof value !== 'string') return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        field: fieldName,
        message: 'Please enter a valid email address',
        type: 'format',
        value
      };
    }
    return null;
  },
  
  minLength: (minLength: number) => (value: unknown, fieldName: string): FormFieldError | null => {
    if (typeof value !== 'string') return null;
    
    if (value.length < minLength) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters`,
        type: 'range',
        value
      };
    }
    return null;
  },
  
  min: (minValue: number) => (value: unknown, fieldName: string): FormFieldError | null => {
    if (typeof value !== 'number') return null;
    
    if (value < minValue) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${minValue}`,
        type: 'range',
        value
      };
    }
    return null;
  }
};

export default {
  useFormWithErrors,
  FormField,
  FormErrorSummary,
  FormSuccessMessage,
  validationRules
};