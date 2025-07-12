/**
 * Secure Form Components
 * Enhanced form components with built-in security
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Shield, Check } from 'lucide-react';
import { validateExpense, validateAmount, validateProfile } from '../../utils/security/validation';
import { sanitizeAmount, sanitizeInput, sanitizeDescription } from '../../utils/security/inputSanitization';
import { CSRFManager } from '../../utils/security/csrfProtection';

// Secure expense form
interface SecureExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    description: string;
    category: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const SecureExpenseForm: React.FC<SecureExpenseFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9.-]/g, '');
    setFormData(prev => ({ ...prev, amount: sanitizedValue }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData(prev => ({ ...prev, description: sanitizedValue }));
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData(prev => ({ ...prev, category: sanitizedValue }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CSRF token
    const csrfToken = CSRFManager.getToken();
    if (!csrfToken) {
      setErrors(['Security token missing. Please refresh the page.']);
      return;
    }

    const amount = sanitizeAmount(formData.amount);
    const description = sanitizeDescription(formData.description);
    const category = sanitizeInput(formData.category);

    const validation = validateExpense({ amount, description, category });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      return;
    }

    setErrors([]);
    setWarnings(validation.warnings);
    setIsSubmitting(true);

    try {
      await onSubmit({ amount, description, category });
    } catch (error) {
      setErrors(['Failed to submit expense. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="text-sm text-gray-600">Secure Form</span>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <ul className="list-disc list-inside text-yellow-700">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="text"
          value={formData.amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          maxLength={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="What did you spend on?"
          maxLength={200}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          type="text"
          value={formData.category}
          onChange={handleCategoryChange}
          placeholder="e.g., Food, Transportation"
          maxLength={50}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

// Secure profile form
interface SecureProfileFormProps {
  initialData: {
    firstName?: string;
    lastName?: string;
    email: string;
    studentType?: 'domestic' | 'international';
  };
  onSubmit: (profile: any) => Promise<void>;
}

export const SecureProfileForm: React.FC<SecureProfileFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProfile(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors(['Failed to update profile. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="text-sm text-gray-600">Secure Profile Update</span>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName || ''}
            onChange={handleInputChange('firstName')}
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName || ''}
            onChange={handleInputChange('lastName')}
            maxLength={50}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
};

export default {
  SecureExpenseForm,
  SecureProfileForm
};