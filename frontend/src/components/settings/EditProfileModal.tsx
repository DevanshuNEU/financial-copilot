import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '../../contexts/AppDataContext';
import { User, Loader2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { appData, updateUserProfile } = useAppData();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: appData.user?.firstName || '',
    lastName: appData.user?.lastName || '',
    studentType: appData.user?.studentType || 'international',
    university: appData.user?.university || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update user profile
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentType: formData.studentType as 'domestic' | 'international',
        university: formData.university
      });
      
      // TODO: Update budget in onboarding data
      // For now, we'll just update the user profile
      
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: appData.user?.firstName || '',
      lastName: appData.user?.lastName || '',
      studentType: appData.user?.studentType || 'international',
      university: appData.user?.university || ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Student Type */}
          <div className="space-y-2">
            <Label>Student Type</Label>
            <Select
              value={formData.studentType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, studentType: value as 'domestic' | 'international' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="international">International Student</SelectItem>
                <SelectItem value="domestic">Domestic Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* University */}
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              type="text"
              value={formData.university}
              onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
              placeholder="Enter university name"
            />
          </div>

          {/* Budget Info (Read-only) */}
          <div className="space-y-2">
            <Label>Monthly Budget</Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Budget:</span>
                <span className="font-medium">${appData.onboardingData?.monthlyBudget || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Budget changes require recalculating all expenses and categories
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;