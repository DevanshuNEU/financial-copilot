import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Home, Wifi, Phone, Tv, Dumbbell, Car } from 'lucide-react';

interface FixedCost {
  name: string;
  amount: number;
  category: string;
}

interface FixedCostsStepProps {
  data: {
    fixedCosts: FixedCost[];
    currency: string;
    monthlyBudget: number;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const commonFixedCosts = [
  { name: 'Rent/Dorm', category: 'housing', icon: Home, color: 'bg-orange-500' },
  { name: 'Meal Plan', category: 'food', icon: Home, color: 'bg-green-500' },
  { name: 'Internet/WiFi', category: 'utilities', icon: Wifi, color: 'bg-blue-500' },
  { name: 'Phone Bill', category: 'utilities', icon: Phone, color: 'bg-purple-500' },
  { name: 'Netflix', category: 'subscriptions', icon: Tv, color: 'bg-red-500' },
  { name: 'Spotify', category: 'subscriptions', icon: Tv, color: 'bg-green-600' },
  { name: 'Gym Membership', category: 'health', icon: Dumbbell, color: 'bg-yellow-500' },
  { name: 'Car Insurance', category: 'transportation', icon: Car, color: 'bg-indigo-500' },
];

const FixedCostsStep: React.FC<FixedCostsStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(data.fixedCosts || []);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [quickExpenseInput, setQuickExpenseInput] = useState<{name: string, category: string} | null>(null);

  const currencies = {
    USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', INR: '₹'
  };
  const currencySymbol = currencies[data.currency as keyof typeof currencies] || '$';

  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const remainingBudget = data.monthlyBudget - totalFixedCosts;

  const addQuickCost = (quickCost: typeof commonFixedCosts[0]) => {
    // Show input for this specific expense
    setQuickExpenseInput({
      name: quickCost.name,
      category: quickCost.category
    });
    setCustomAmount('');
  };

  const confirmQuickCost = () => {
    if (quickExpenseInput && customAmount && parseFloat(customAmount) > 0) {
      const newCost: FixedCost = {
        name: quickExpenseInput.name,
        amount: parseFloat(customAmount),
        category: quickExpenseInput.category
      };
      setFixedCosts(prev => [...prev, newCost]);
      setQuickExpenseInput(null);
      setCustomAmount('');
    }
  };

  const cancelQuickCost = () => {
    setQuickExpenseInput(null);
    setCustomAmount('');
  };

  const removeCost = (index: number) => {
    setFixedCosts(prev => prev.filter((_, i) => i !== index));
  };

  const addCustomCost = () => {
    if (customName.trim() && customAmount && parseFloat(customAmount) > 0) {
      const newCost: FixedCost = {
        name: customName.trim(),
        amount: parseFloat(customAmount),
        category: 'other'
      };
      setFixedCosts(prev => [...prev, newCost]);
      setCustomName('');
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };

  const continueToNext = () => {
    onUpdate({ fixedCosts });
    onNext();
  };

  const isQuickCostAdded = (costName: string) => {
    return fixedCosts.some(cost => cost.name === costName);
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
          What do you pay for every month?
        </h3>
        <p className="text-gray-600">
          Tap the ones that apply to you. Don't worry, you can change these anytime.
        </p>
      </motion.div>

      {/* Quick Add Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {commonFixedCosts.map((cost, index) => {
          const IconComponent = cost.icon;
          const isAdded = isQuickCostAdded(cost.name);
          
          return (
            <motion.button
              key={cost.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isAdded && addQuickCost(cost)}
              disabled={isAdded}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                isAdded
                  ? 'border-green-500 bg-green-50 opacity-75'
                  : 'border-gray-200 hover:border-green-300 bg-white hover:bg-green-50'
              }`}
            >
              <div className={`w-8 h-8 ${cost.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {cost.name}
              </div>
              <div className="text-xs text-gray-600">
                Tap to add amount
              </div>
              {isAdded && (
                <Badge className="mt-1 bg-green-600 text-white text-xs">
                  ✓ Added
                </Badge>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Quick Expense Amount Input */}
      {quickExpenseInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-2 border-green-200 bg-green-50 rounded-lg space-y-3"
        >
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-1">
              How much do you pay for {quickExpenseInput.name}?
            </h4>
            <p className="text-sm text-gray-600">
              Enter the amount you typically pay per month
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                {currencySymbol}
              </span>
              <Input
                type="number"
                placeholder="0"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-8 text-center text-lg font-semibold w-32"
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={confirmQuickCost}
              disabled={!customAmount || parseFloat(customAmount) <= 0}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              Add {quickExpenseInput.name}
            </Button>
            <Button
              variant="outline"
              onClick={cancelQuickCost}
              className="px-4"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Custom Cost Input */}
      {!quickExpenseInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
        {!showCustomInput ? (
          <Button
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="w-full border-dashed border-2 border-gray-300 hover:border-green-400 py-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a custom expense
          </Button>
        ) : (
          <div className="p-4 border-2 border-gray-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Expense name (e.g., Textbooks)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addCustomCost}
                disabled={!customName.trim() || !customAmount || parseFloat(customAmount) <= 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Expense
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomName('');
                  setCustomAmount('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      )}

      {/* Current Fixed Costs List */}
      {fixedCosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h4 className="font-semibold text-gray-900">Your fixed monthly costs:</h4>
          <div className="space-y-2">
            {fixedCosts.map((cost, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {cost.category === 'housing' && '🏠'}
                    {cost.category === 'food' && '🍕'}
                    {cost.category === 'utilities' && '💡'}
                    {cost.category === 'subscriptions' && '📺'}
                    {cost.category === 'health' && '💪'}
                    {cost.category === 'transportation' && '🚗'}
                    {cost.category === 'other' && '📝'}
                  </span>
                  <span className="font-medium text-gray-900">{cost.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {currencySymbol}{cost.amount}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCost(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-4 bg-green-50 rounded-lg border border-green-200"
      >
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1 font-medium">After fixed costs:</div>
          <div className="text-2xl font-bold text-green-600">
            {currencySymbol}{remainingBudget.toFixed(2)} available
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Fixed costs: {currencySymbol}{totalFixedCosts.toFixed(2)} / Monthly budget: {currencySymbol}{data.monthlyBudget}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FixedCostsStep;