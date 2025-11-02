/**
 * Centralized Category Definitions for EXPENSESINK
 * Single source of truth - use this everywhere!
 */

export const EXPENSE_CATEGORIES = [
  {
    id: 'food',
    value: 'food',
    label: 'Food & Dining',
    emoji: '🍽️',
    description: 'Groceries, restaurants, coffee, snacks',
    color: 'bg-orange-500'
  },
  {
    id: 'transportation',
    value: 'transportation',
    label: 'Transportation',
    emoji: '🚗',
    description: 'Uber, gas, public transit, parking',
    color: 'bg-blue-500'
  },
  {
    id: 'entertainment',
    value: 'entertainment',
    label: 'Entertainment',
    emoji: '🎬',
    description: 'Movies, concerts, games, hobbies',
    color: 'bg-purple-500'
  },
  {
    id: 'textbooks',
    value: 'textbooks',
    label: 'Textbooks & Supplies',
    emoji: '📚',
    description: 'Course materials, stationery',
    color: 'bg-indigo-500'
  },
  {
    id: 'healthcare',
    value: 'healthcare',
    label: 'Healthcare',
    emoji: '⚕️',
    description: 'Medicines, doctor visits, health items',
    color: 'bg-red-500'
  },
  {
    id: 'shopping',
    value: 'shopping',
    label: 'Shopping',
    emoji: '🛍️',
    description: 'Clothes, gadgets, personal items',
    color: 'bg-pink-500'
  },
  {
    id: 'other',
    value: 'other',
    label: 'Other',
    emoji: '📦',
    description: 'Miscellaneous expenses',
    color: 'bg-gray-500'
  }
] as const;

// Export simple list for dropdowns
export const CATEGORY_OPTIONS = EXPENSE_CATEGORIES.map(cat => ({
  value: cat.value,
  label: cat.label
}));

// Export for AI service
export const CATEGORY_NAMES = EXPENSE_CATEGORIES.map(cat => cat.label);

// Helper function
export const getCategoryByValue = (value: string) => {
  return EXPENSE_CATEGORIES.find(cat => cat.value === value);
};

export const getCategoryLabel = (value: string): string => {
  return getCategoryByValue(value)?.label || value;
};
