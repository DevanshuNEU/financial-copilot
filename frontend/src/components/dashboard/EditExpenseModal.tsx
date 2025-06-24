import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiService } from '../../services/api';
import { Expense } from '../../types';
import toast from 'react-hot-toast';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onExpenseUpdated: () => void;
}

const EXPENSE_CATEGORIES = [
  { value: 'meals', label: '🍽️ Meals' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'office', label: '📚 Office/Books' },
  { value: 'software', label: '💻 Software' },
  { value: 'utilities', label: '🔌 Utilities' },
  { value: 'marketing', label: '🎯 Entertainment' },
  { value: 'other', label: '📦 Other' },
];

const EXPENSE_STATUS = [
  { value: 'pending', label: '⏳ Pending' },
  { value: 'approved', label: '✅ Approved' },
  { value: 'rejected', label: '❌ Rejected' },
];

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onExpenseUpdated,
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    vendor: '',
    status: 'pending',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description || '',
        vendor: expense.vendor || '',
        status: expense.status,
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    setIsLoading(true);

    try {
      await apiService.updateExpense(expense.id, {
        amount: parseFloat(formData.amount),
        category: formData.category as any,
        description: formData.description,
        vendor: formData.vendor,
        status: formData.status as any,
      });

      toast.success('Expense updated successfully!');
      onExpenseUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Expense
          </DialogTitle>
          <DialogDescription>
            Update your expense details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What was this expense for?"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor/Store
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Where did you spend?"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.amount || !formData.category}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : (
                'Update Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};