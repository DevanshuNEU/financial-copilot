/**
 * Security Components
 * UI components for security features
 */

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useSecurity } from '../../contexts/SecurityContext';
import { validatePassword } from '../../utils/security/validation';

// Security status indicator
interface SecurityStatusProps {
  className?: string;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({ className }) => {
  const { securityState } = useSecurity();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Shield className="w-4 h-4 text-green-600" />
      <Badge variant={securityState.isSecureMode ? "default" : "secondary"}>
        {securityState.isSecureMode ? "Secure" : "Standard"}
      </Badge>
      {securityState.csrfToken && (
        <Badge variant="outline" className="text-xs">
          Protected
        </Badge>
      )}
    </div>
  );
};

// Password strength indicator
interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  className 
}) => {
  const [strength, setStrength] = useState<{ score: number; feedback: string[]; isValid: boolean }>({ 
    score: 0, 
    feedback: [], 
    isValid: false 
  });

  useEffect(() => {
    const result = validatePassword(password);
    const score = result.isValid ? 4 : Math.max(1, 4 - result.errors.length);
    setStrength({
      score,
      feedback: [...result.errors, ...result.warnings],
      isValid: result.isValid
    });
  }, [password]);

  const getStrengthColor = () => {
    if (strength.score <= 2) return 'bg-red-500';
    if (strength.score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength.score <= 2) return 'Weak';
    if (strength.score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Password Strength:</span>
        <span className={`text-sm font-medium ${
          strength.score <= 2 ? 'text-red-600' : 
          strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-gray-500 list-disc list-inside">
          {strength.feedback.map((feedback, index) => (
            <li key={index}>Add {feedback}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Rate limit warning
interface RateLimitWarningProps {
  show: boolean;
  onRetry: () => void;
  resetTime?: number;
}

export const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ 
  show, 
  onRetry,
  resetTime 
}) => {
  if (!show) return null;

  const resetDate = resetTime ? new Date(resetTime) : null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-800 font-medium">Rate limit exceeded</p>
            {resetDate && (
              <p className="text-yellow-700 text-sm">
                Try again after {resetDate.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="text-yellow-700 border-yellow-300"
          >
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Security warning alert
interface SecurityAlertProps {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }>;
  onClose?: () => void;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({
  type,
  title,
  message,
  actions,
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertDescription>
        <div className="space-y-2">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm">{message}</p>
          </div>
          
          {actions && (
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'outline'}
                  size="sm"
                >
                  {action.label}
                </Button>
              ))}
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Secure input wrapper
interface SecureInputProps {
  children: React.ReactNode;
  onSecurityIssue?: (issue: string) => void;
  className?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  children,
  onSecurityIssue,
  className
}) => {
  const { validateUserInput } = useSecurity();
  const [hasIssue, setHasIssue] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValid = validateUserInput(value);
    
    if (!isValid) {
      setHasIssue(true);
      onSecurityIssue?.('Invalid input detected');
    } else {
      setHasIssue(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {React.cloneElement(children as React.ReactElement<any>, {
          onChange: handleChange,
          className: `${(children as React.ReactElement<any>).props.className} ${
            hasIssue ? 'border-red-500 focus:border-red-500' : ''
          }`
        })}
        {hasIssue && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {hasIssue && (
        <p className="mt-1 text-sm text-red-600">
          Invalid input detected. Please check your entry.
        </p>
      )}
    </div>
  );
};

// CSRF token display (for debugging)
export const CSRFTokenDisplay: React.FC = () => {
  const { securityState } = useSecurity();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="p-2 bg-gray-100 rounded text-xs font-mono">
      <div className="flex items-center space-x-2">
        <Lock className="w-3 h-3" />
        <span>CSRF: {securityState.csrfToken?.slice(0, 8)}...</span>
      </div>
    </div>
  );
};

export default {
  SecurityStatus,
  PasswordStrength,
  RateLimitWarning,
  SecurityAlert,
  SecureInput,
  CSRFTokenDisplay
};