/**
 * Security Context and Hooks
 * Centralized security management for EXPENSESINK
 */

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { secureApiClient } from '../utils/security/secureApiService';
import { csrfProtection } from '../utils/security/csrfProtection';
import { validateSecurityRules } from '../utils/security/dataValidation';

interface SecurityState {
  csrfToken: string | null;
  isSecureMode: boolean;
  rateLimitWarning: boolean;
  lastSecurityCheck: number;
}

interface SecurityContextType {
  securityState: SecurityState;
  
  // Security actions
  refreshCSRFToken: () => string;
  validateUserInput: (input: any) => boolean;
  reportSecurityIssue: (issue: string, details?: any) => void;
  enableSecureMode: () => void;
  disableSecureMode: () => void;
  
  // API wrapper
  secureApi: typeof secureApiClient;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [securityState, setSecurityState] = useState<SecurityState>({
    csrfToken: null,
    isSecureMode: true,
    rateLimitWarning: false,
    lastSecurityCheck: Date.now()
  });

  // Initialize security on mount
  useEffect(() => {
    const token = csrfProtection.getToken();
    setSecurityState(prev => ({
      ...prev,
      csrfToken: token
    }));
  }, []);

  // Refresh CSRF token
  const refreshCSRFToken = useCallback(() => {
    const newToken = csrfProtection.generateToken();
    setSecurityState(prev => ({
      ...prev,
      csrfToken: newToken
    }));
    return newToken;
  }, []);

  // Validate user input
  const validateUserInput = useCallback((input: any): boolean => {
    const validation = validateSecurityRules(input);
    
    if (!validation.isValid) {
      reportSecurityIssue('Invalid input detected', {
        errors: validation.errors,
        input: typeof input === 'string' ? input.slice(0, 100) : 'non-string input'
      });
      return false;
    }

    if (validation.warnings.length > 0) {
      console.warn('Security warnings:', validation.warnings);
    }

    return true;
  }, []);

  // Report security issues
  const reportSecurityIssue = useCallback((issue: string, details?: any) => {
    console.error('Security Issue:', issue, details);
    
    // Store security issues for monitoring
    const securityLog = JSON.parse(localStorage.getItem('security_log') || '[]');
    securityLog.push({
      timestamp: new Date().toISOString(),
      issue,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Keep only last 100 security issues
    if (securityLog.length > 100) {
      securityLog.splice(0, securityLog.length - 100);
    }
    
    localStorage.setItem('security_log', JSON.stringify(securityLog));
    
    // Show user-friendly message
    toast.error('Security issue detected. Please refresh the page.');
  }, []);

  // Enable secure mode
  const enableSecureMode = useCallback(() => {
    setSecurityState(prev => ({
      ...prev,
      isSecureMode: true
    }));
    refreshCSRFToken();
    toast.success('Secure mode enabled');
  }, [refreshCSRFToken]);

  // Disable secure mode (for development)
  const disableSecureMode = useCallback(() => {
    setSecurityState(prev => ({
      ...prev,
      isSecureMode: false
    }));
    toast.error('Secure mode disabled');
  }, []);

  const value: SecurityContextType = {
    securityState,
    refreshCSRFToken,
    validateUserInput,
    reportSecurityIssue,
    enableSecureMode,
    disableSecureMode,
    secureApi: secureApiClient
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Security hook
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

// Secure form hook
export const useSecureForm = <T extends Record<string, any>>(initialData: T) => {
  const { validateUserInput, reportSecurityIssue } = useSecurity();
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = useCallback((field: keyof T, value: any) => {
    // Validate input before setting
    if (!validateUserInput(value)) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Invalid input detected'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error if it exists
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [validateUserInput, errors]);

  const validateForm = useCallback(() => {
    const validation = validateSecurityRules(formData);
    
    if (!validation.isValid) {
      reportSecurityIssue('Form validation failed', {
        errors: validation.errors,
        formData: Object.keys(formData)
      });
      return false;
    }

    return true;
  }, [formData, reportSecurityIssue]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    setField,
    validateForm,
    resetForm,
    hasErrors: Object.keys(errors).length > 0
  };
};

// Secure API hook
export const useSecureApi = () => {
  const { secureApi, securityState } = useSecurity();
  
  const makeSecureRequest = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ) => {
    if (!securityState.isSecureMode) {
      console.warn('Making API request in non-secure mode');
    }

    try {
      switch (method) {
        case 'GET':
          return await secureApi.get(endpoint);
        case 'POST':
          return await secureApi.post(endpoint, data);
        case 'PUT':
          return await secureApi.put(endpoint, data);
        case 'DELETE':
          return await secureApi.delete(endpoint);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (error) {
      console.error('Secure API request failed:', error);
      toast.error('Request failed. Please try again.');
      throw error;
    }
  }, [secureApi, securityState.isSecureMode]);

  return { makeSecureRequest };
};

export default {
  SecurityProvider,
  useSecurity,
  useSecureForm,
  useSecureApi
};