import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SpendingCategoriesStepProps {
  data: {
    monthlyBudget: number;
    currency: string;
    fixedCosts: Array<{ name: string; amount: number; category: string }>;
    spendingCategories: Record<string, number>;
    hasMealPlan: boolean;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const defaultCategories = [
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Groceries, restaurants, coffee, snacks',
    color: 'bg-orange-500'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Uber, gas, bus passes, flights home',
    color: 'bg-blue-500'
  },
  {
    id: 'textbooks',
    name: 'Textbooks & Supplies',
    description: 'Course materials, stationery, software',
    color: 'bg-purple-500'
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Social',
    description: 'Movies, concerts, going out, dates',
    color: 'bg-pink-500'
  },
  {
    id: 'other',
    name: 'Everything Else',
    description: 'Shopping, personal care, miscellaneous',
    color: 'bg-green-500'
  }
];

const SpendingCategoriesStep: React.FC<SpendingCategoriesStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const currencies = {
    USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', INR: '₹'
  };
  const currencySymbol = currencies[data.currency as keyof typeof currencies] || '$';

  const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const availableForSpending = data.monthlyBudget - totalFixedCosts;

  // Initialize with empty categories - let students choose their own amounts
  const [categories, setCategories] = useState<Record<string, number>>(() => {
    if (Object.keys(data.spendingCategories).length > 0) {
      return data.spendingCategories;
    }
    // Start with empty allocations
    return {};
  });

  const totalAllocated = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
  const remaining = availableForSpending - totalAllocated;
  const potentialSavings = Math.max(0, remaining); // Only show positive remaining as savings

  const updateCategory = (categoryId: string, amount: string) => {
    const value = amount === '' ? 0 : Math.max(0, parseInt(amount) || 0);
    if (value === 0) {
      // Remove category if set to 0
      const newCategories = { ...categories };
      delete newCategories[categoryId];
      setCategories(newCategories);
    } else {
      setCategories(prev => ({ ...prev, [categoryId]: value }));
    }
  };

  const autoBalance = () => {
    // If no categories have values yet, use all categories
    // If some have values, only redistribute among those
    const hasAnyCategories = Object.keys(categories).length > 0;
    const activeCategories = hasAnyCategories 
      ? defaultCategories.filter(cat => categories[cat.id] > 0)
      : defaultCategories;
    
    // If we still have no categories to work with, use all categories
    const categoriesToUse = activeCategories.length > 0 ? activeCategories : defaultCategories;

    const amountPerCategory = Math.floor(availableForSpending / categoriesToUse.length);
    const remainder = availableForSpending % categoriesToUse.length;
    const newCategories: Record<string, number> = {};
    
    categoriesToUse.forEach((category, index) => {
      // Give remainder to first few categories to ensure exact allocation
      newCategories[category.id] = amountPerCategory + (index < remainder ? 1 : 0);
    });

    setCategories(newCategories);
  };

  const completeSetup = () => {
    onUpdate({ spendingCategories: categories });
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          How do you want to spend your money?
        </h3>
        <p className="text-gray-600 mb-4">
          Choose the categories that matter to you. You can always adjust these later.
        </p>
        
        {/* Budget Overview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Monthly Budget</div>
              <div className="font-bold text-gray-900">{currencySymbol}{data.monthlyBudget}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Fixed Costs</div>
              <div className="font-bold text-red-600">{currencySymbol}{totalFixedCosts}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Your Spending Money</div>
              <div className="font-bold text-green-600">{currencySymbol}{availableForSpending}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {defaultCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {category.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-600">{category.description}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  value={categories[category.id] || ''}
                  onChange={(e) => updateCategory(category.id, e.target.value)}
                  className="pl-8"
                  placeholder="Enter amount (optional)"
                  min="0"
                />
              </div>
              <div className="text-sm text-gray-600 min-w-[80px]">
                {categories[category.id] && availableForSpending > 0 
                  ? `${Math.round((categories[category.id] / availableForSpending) * 100)}%`
                  : ''
                }
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Budget Status & Savings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        {/* Progress Bar */}
        <div className="p-4 border-2 border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Budget Allocation</span>
            <span className="text-sm text-gray-600">
              {currencySymbol}{totalAllocated} / {currencySymbol}{availableForSpending}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                totalAllocated <= availableForSpending ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min((totalAllocated / availableForSpending) * 100, 100)}%` 
              }}
            />
          </div>
          
          {remaining > 0 && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">
                Potential Monthly Savings
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {currencySymbol}{potentialSavings}
              </div>
              <div className="text-xs text-blue-600">
                That's {currencySymbol}{(potentialSavings * 12).toLocaleString()} per year
              </div>
            </div>
          )}
          
          {remaining === 0 && (
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">
                Perfect! Your budget is fully planned
              </div>
            </div>
          )}
          
          {remaining < 0 && (
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-sm font-medium text-red-800 mb-1">
                Over budget by {currencySymbol}{Math.abs(remaining)}
              </div>
              <div className="text-xs text-red-600">
                Try reducing some categories or use auto-balance
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        {/* Always show auto-allocate option */}
        <Button
          variant="outline"
          onClick={autoBalance}
          className="w-full border-2 border-green-300 hover:border-green-400 hover:bg-green-50"
        >
          Auto-Allocate Money
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Built by students, for students. You can customize everything in your dashboard.
          </p>
        </div>
      </motion.div>

      {/* Simple tip for meal plan users */}
      {data.hasMealPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-3 bg-green-50 border border-green-200 rounded-lg text-center"
        >
          <div className="text-sm text-green-800">
            <strong>Pro tip:</strong> Since you have a meal plan, you might spend less on food & dining.
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpendingCategoriesStep;