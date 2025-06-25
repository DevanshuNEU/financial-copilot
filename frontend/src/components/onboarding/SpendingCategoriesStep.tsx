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
    icon: '🍕',
    description: 'Groceries, restaurants, coffee, snacks',
    defaultPercent: 30,
    color: 'bg-orange-500'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    description: 'Uber, gas, bus passes, flights home',
    defaultPercent: 15,
    color: 'bg-blue-500'
  },
  {
    id: 'textbooks',
    name: 'Textbooks & Supplies',
    icon: '📚',
    description: 'Course materials, stationery, software',
    defaultPercent: 10,
    color: 'bg-purple-500'
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Social',
    icon: '🎬',
    description: 'Movies, concerts, going out, dates',
    defaultPercent: 25,
    color: 'bg-pink-500'
  },
  {
    id: 'other',
    name: 'Everything Else',
    icon: '💰',
    description: 'Shopping, personal care, miscellaneous',
    defaultPercent: 20,
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

  const [categories, setCategories] = useState<Record<string, number>>(() => {
    // Initialize with smart defaults
    if (Object.keys(data.spendingCategories).length > 0) {
      return data.spendingCategories;
    }

    const initialCategories: Record<string, number> = {};
    defaultCategories.forEach(category => {
      let percent = category.defaultPercent;
      
      // Adjust for meal plan
      if (category.id === 'food' && data.hasMealPlan) {
        percent = 15; // Reduce food spending if they have meal plan
      }
      
      initialCategories[category.id] = Math.round((availableForSpending * percent) / 100);
    });

    return initialCategories;
  });

  const totalAllocated = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
  const remaining = availableForSpending - totalAllocated;

  const updateCategory = (categoryId: string, amount: string) => {
    const value = amount === '' ? 0 : Math.max(0, parseInt(amount) || 0);
    setCategories(prev => ({ ...prev, [categoryId]: value }));
  };

  const autoBalance = () => {
    const totalPercent = defaultCategories.reduce((sum, cat) => {
      let percent = cat.defaultPercent;
      if (cat.id === 'food' && data.hasMealPlan) {
        percent = 15;
      }
      return sum + percent;
    }, 0);

    const newCategories: Record<string, number> = {};
    defaultCategories.forEach(category => {
      let percent = category.defaultPercent;
      if (category.id === 'food' && data.hasMealPlan) {
        percent = 15;
      }
      newCategories[category.id] = Math.round((availableForSpending * percent) / totalPercent);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🎯 Let's organize your spending
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Based on your {currencySymbol}{data.monthlyBudget} monthly budget, here's what we suggest:
        </p>
        
        {/* Budget Overview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Total Budget</div>
              <div className="font-bold text-gray-900">{currencySymbol}{data.monthlyBudget}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Fixed Costs</div>
              <div className="font-bold text-red-600">{currencySymbol}{totalFixedCosts}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Available to Allocate</div>
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
                <span className="text-lg">{category.icon}</span>
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
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="text-sm text-gray-600 min-w-[80px]">
                {availableForSpending > 0 
                  ? `${Math.round((categories[category.id] / availableForSpending) * 100)}%`
                  : '0%'
                }
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Budget Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`p-4 rounded-lg border-2 ${
          remaining === 0 
            ? 'bg-green-50 border-green-200' 
            : remaining > 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="text-center">
          <div className="text-sm font-medium mb-2">
            {remaining === 0 && '🎯 Perfect! Your budget is fully allocated'}
            {remaining > 0 && `💰 You have ${currencySymbol}${remaining} left to allocate`}
            {remaining < 0 && `⚠️ You're over budget by ${currencySymbol}${Math.abs(remaining)}`}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                totalAllocated <= availableForSpending ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min((totalAllocated / availableForSpending) * 100, 100)}%` 
              }}
            />
          </div>
          
          <div className="text-xs text-gray-600">
            Allocated: {currencySymbol}{totalAllocated} / Available: {currencySymbol}{availableForSpending}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {Math.abs(remaining) > 0 && (
          <Button
            variant="outline"
            onClick={autoBalance}
            className="w-full"
          >
            ⚡ Auto-balance my budget
          </Button>
        )}
        
        <Button
          onClick={completeSetup}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
        >
          🎉 Complete Setup & See My Dashboard
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Don't worry, you can adjust these categories anytime in your dashboard!
          </p>
        </div>
      </motion.div>

      {/* Meal Plan Tip */}
      {data.hasMealPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="text-sm text-blue-800">
            💡 <strong>Meal Plan Tip:</strong> We've reduced your food budget since you have a meal plan. 
            You can always adjust this if you eat out frequently!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpendingCategoriesStep;