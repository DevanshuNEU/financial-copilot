import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { Expense } from '../../types';

interface AddExpenseModalProps {
  onExpenseAdded: () => void;
}

interface FormData {
  amount: string;
  category: string;
  description: string;
  vendor: string;
}

interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
}

const CATEGORIES = [
  { value: 'meals', label: 'Meals' },
  { value: 'travel', label: 'Travel' },
  { value: 'office', label: 'Office' },
  { value: 'software', label: 'Software' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onExpenseAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    category: '',
    description: '',
    vendor: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (amount > 999999) {
      newErrors.amount = 'Amount must be less than $999,999';
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      vendor: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const expenseData: Omit<Expense, 'id' | 'created_at'> = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        vendor: formData.vendor.trim() || '',
        status: 'pending',
      };

      await apiService.createExpense(expenseData);
      
      // Success! Close modal and refresh data
      setOpen(false);
      resetForm();
      onExpenseAdded();
    } catch (error) {
      console.error('Failed to create expense:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      resetForm();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4 max-w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details for your new expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max="999999"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`pl-6 ${errors.amount ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={loading}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter expense description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">
              Vendor
            </Label>
            <Input
              id="vendor"
              placeholder="Enter vendor name (optional)"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              disabled={loading}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Expense'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;