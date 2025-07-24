// Expenses Page - Real user data from AppDataContext
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '../contexts/AppDataContext';
import type { UserExpense } from '../contexts/AppDataContext';
import { 
  Receipt, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar,
  DollarSign,
  Tag,
  AlertCircle,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const ExpensesPage: React.FC = () => {
  const { appData, addExpense, updateExpense, deleteExpense } = useAppData();
  const { loading, error, expenses, onboardingData } = appData;
  
  const [filteredExpenses, setFilteredExpenses] = useState<UserExpense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Modal states
  const [editingExpense, setEditingExpense] = useState<UserExpense | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    expense: UserExpense | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    expense: null,
    isLoading: false,
  });

  // Filter expenses based on search and category
  useEffect(() => {
    let filtered = expenses;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.vendor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, selectedCategory]);

  const handleAddExpense = async (expenseData: Omit<UserExpense, 'id' | 'createdAt'>) => {
    try {
      await addExpense(expenseData);
      setShowAddModal(false);
      toast.success('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
    }
  };

  const handleEditExpense = (expense: UserExpense) => {
    setEditingExpense(expense);
  };

  const handleUpdateExpense = async (updates: Partial<UserExpense>) => {
    if (!editingExpense) return;

    try {
      await updateExpense(editingExpense.id, updates);
      setEditingExpense(null);
      toast.success('Expense updated successfully!');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense. Please try again.');
    }
  };

  const handleDeleteClick = (expense: UserExpense) => {
    setDeleteDialog({
      isOpen: true,
      expense,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.expense) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      await deleteExpense(deleteDialog.expense.id);
      toast.success('Expense deleted successfully!');
      setDeleteDialog({
        isOpen: false,
        expense: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense. Please try again.');
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteDialog.isLoading) {
      setDeleteDialog({
        isOpen: false,
        expense: null,
        isLoading: false,
      });
    }
  };

  // Get unique categories for filter (from both onboarding and actual expenses)
  const onboardingCategories = onboardingData ? Object.keys(onboardingData.spendingCategories) : [];
  const expenseCategories = Array.from(new Set(expenses.map(expense => expense.category)));
  const categories = Array.from(new Set([...onboardingCategories, ...expenseCategories]));

  // Calculate summary stats
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;
  const currencySymbol = onboardingData?.currency === 'USD' ? '$' : (onboardingData?.currency || '$');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please ensure you've completed the onboarding process and try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-yellow-600">Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Complete your financial setup to start tracking expenses.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Receipt className="h-8 w-8 text-green-600" />
              Expense Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track, edit, and organize all your spending
            </p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Showing</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {currencySymbol}{totalSpent.toFixed(2)}
              </div>
              <p className="text-xs text-green-600 mt-1">
                {filteredExpenses.length} expenses
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Average Amount</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {currencySymbol}{averageExpense.toFixed(2)}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                per transaction
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Categories</CardTitle>
              <Tag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {categories.length}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                different areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses, vendors, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredExpenses.length === expenses.length 
                ? `All Expenses (${expenses.length})`
                : `Filtered Expenses (${filteredExpenses.length} of ${expenses.length})`
              }
            </CardTitle>
            <CardDescription>
              Click on any expense to edit or delete it
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {expenses.length === 0 
                    ? "No expenses recorded yet. Add your first expense above!"
                    : "No expenses match your current filters."
                  }
                </p>
                {expenses.length === 0 && (
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Expense
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExpenses
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((expense) => (
                    <div key={expense.id} className="group relative flex items-center justify-between p-4 border rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-white">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="font-medium text-gray-900 truncate">{expense.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {expense.vendor || 'No vendor'} • <span className="capitalize">{expense.category}</span> • {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">{currencySymbol}{expense.amount.toFixed(2)}</div>
                          <div className="text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                              expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {expense.status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-200">
                          {String(expense.id).startsWith('fixed_cost_') ? (
                            // Fixed cost expenses - show as system expenses
                            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg border">
                              Monthly Fixed Cost
                            </div>
                          ) : (
                            // User expenses - allow edit/delete
                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditExpense(expense)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-150"
                                title="Edit expense"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(expense)}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-150"
                                title="Delete expense"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Expense Modal */}
        {showAddModal && (
          <SimpleAddExpenseModal 
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onExpenseAdded={handleAddExpense}
            availableCategories={categories}
          />
        )}

        {/* Edit Expense Modal */}
        {editingExpense && (
          <EditExpenseModal
            isOpen={!!editingExpense}
            onClose={() => setEditingExpense(null)}
            expense={editingExpense}
            onExpenseUpdated={handleUpdateExpense}
            availableCategories={categories}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {deleteDialog.isOpen && deleteDialog.expense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Expense</CardTitle>
                <CardDescription>
                  Are you sure you want to delete "{deleteDialog.expense.description}" ({currencySymbol}{deleteDialog.expense.amount.toFixed(2)})? 
                  This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleDeleteCancel}
                    disabled={deleteDialog.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteConfirm}
                    disabled={deleteDialog.isLoading}
                  >
                    {deleteDialog.isLoading ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Add Expense Modal Component (inline for now)
const SimpleAddExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: (expenseData: Omit<UserExpense, 'id' | 'createdAt'>) => void;
  availableCategories: string[];
}> = ({ isOpen, onClose, onExpenseAdded, availableCategories }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: availableCategories[0] || '',
    vendor: '',
    status: 'pending' as const,
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    onExpenseAdded({
      description: formData.description.trim(),
      amount,
      category: formData.category,
      vendor: formData.vendor.trim(),
      status: formData.status,
      date: formData.date
    });

    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: availableCategories[0] || '',
      vendor: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>
            Record a new expense to track your spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What did you spend on?"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                {availableCategories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Vendor (Optional)</label>
              <Input
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                placeholder="Where did you spend?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Simple Edit Expense Modal Component (inline for now)
const EditExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  expense: UserExpense;
  onExpenseUpdated: (updates: Partial<UserExpense>) => void;
  availableCategories: string[];
}> = ({ isOpen, onClose, expense, onExpenseUpdated, availableCategories }) => {
  const [formData, setFormData] = useState({
    description: expense.description,
    amount: expense.amount.toString(),
    category: expense.category,
    vendor: expense.vendor || '',
    status: expense.status
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onExpenseUpdated({
      description: formData.description,
      amount,
      category: formData.category,
      vendor: formData.vendor,
      status: formData.status as 'pending' | 'approved' | 'rejected'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                {availableCategories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Vendor (Optional)</label>
              <Input
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;