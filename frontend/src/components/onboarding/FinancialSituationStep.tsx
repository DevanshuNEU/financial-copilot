import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coffee, Users, GraduationCap } from 'lucide-react';

interface FinancialSituationStepProps {
  data: {
    monthlyBudget: number;
    currency: string;
    hasMealPlan: boolean;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const currencies = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
];

const budgetSuggestions = [
  { amount: 800, label: 'Tight Budget', icon: Coffee, description: 'Making every dollar count' },
  { amount: 1200, label: 'Comfortable', icon: Users, description: 'Good balance of needs and wants' },
  { amount: 1800, label: 'Flexible', icon: GraduationCap, description: 'Room for extras and savings' },
];

const FinancialSituationStep: React.FC<FinancialSituationStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const [monthlyBudget, setMonthlyBudget] = useState(data.monthlyBudget || '');
  const [currency, setCurrency] = useState(data.currency || 'USD');
  const [hasMealPlan, setHasMealPlan] = useState(data.hasMealPlan);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCurrency = currencies.find(c => c.code === currency);

  const handleBudgetSuggestion = (amount: number) => {
    setMonthlyBudget(amount.toString());
    setErrors(prev => ({ ...prev, monthlyBudget: '' }));
    
    // Immediately update the parent data when a suggestion is selected
    onUpdate({
      monthlyBudget: amount,
      currency,
      hasMealPlan
    });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    
    // Update parent data immediately when currency changes
    const budget = parseFloat(monthlyBudget.toString()) || 0;
    onUpdate({
      monthlyBudget: budget,
      currency: newCurrency,
      hasMealPlan
    });
  };

  const handleMealPlanChange = (newHasMealPlan: boolean) => {
    setHasMealPlan(newHasMealPlan);
    
    // Update parent data immediately when meal plan changes
    const budget = parseFloat(monthlyBudget.toString()) || 0;
    onUpdate({
      monthlyBudget: budget,
      currency,
      hasMealPlan: newHasMealPlan
    });
  };

  return (
    <div className="space-y-8">
      {/* Monthly Budget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Label className="text-xl font-bold text-gray-900">
          How much money do you have to work with each month?
        </Label>
        <p className="text-gray-600">
          Include everything: allowance, job income, family support - whatever you get regularly.
        </p>
        
        {/* Budget Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {budgetSuggestions.map((suggestion) => {
            const IconComponent = suggestion.icon;
            return (
              <motion.button
                key={suggestion.amount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBudgetSuggestion(suggestion.amount)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  monthlyBudget === suggestion.amount.toString()
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedCurrency?.symbol}{suggestion.amount}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {suggestion.label}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">{suggestion.description}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            {selectedCurrency?.symbol}
          </div>
          <Input
            type="number"
            placeholder="Enter custom amount..."
            value={monthlyBudget}
            onChange={(e) => {
              setMonthlyBudget(e.target.value);
              setErrors(prev => ({ ...prev, monthlyBudget: '' }));
            }}
            className={`pl-10 text-lg ${errors.monthlyBudget ? 'border-red-500' : ''}`}
            min="0"
            step="1"
          />
        </div>
        {errors.monthlyBudget && (
          <p className="text-sm text-red-600">{errors.monthlyBudget}</p>
        )}
      </motion.div>

      {/* Currency Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <Label className="text-xl font-bold text-gray-900">
          What currency do you use?
        </Label>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="text-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{curr.symbol}</span>
                  <span>{curr.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Meal Plan Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Label className="text-xl font-bold text-gray-900">
          Are you on a meal plan?
        </Label>
        <p className="text-gray-600">
          This helps us understand your food spending patterns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMealPlanChange(true)}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              hasMealPlan
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Yes, I have a meal plan</div>
                <div className="text-sm text-gray-600">Dining halls, campus food</div>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMealPlanChange(false)}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              !hasMealPlan
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Coffee className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">No, I buy my own food</div>
                <div className="text-sm text-gray-600">Groceries, restaurants, cooking</div>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Success Message */}
      {monthlyBudget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <p className="text-green-800 font-medium">
            Great! You'll have {selectedCurrency?.symbol}{monthlyBudget} to work with each month
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FinancialSituationStep;