import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiService } from '../services/api';
import { Expense } from '../types';
import AddExpenseModal from '../components/dashboard/AddExpenseModal';
import { EditExpenseModal } from '../components/dashboard/EditExpenseModal';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { 
  Receipt, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    expense: Expense | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    expense: null,
    isLoading: false,
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getExpenses();
      setExpenses(response.expenses);
      setFilteredExpenses(response.expenses);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses.');
      console.error('Expenses fetch error:', err);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter expenses based on search and category
  useEffect(() => {
    let filtered = expenses;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, selectedCategory]);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDeleteClick = (expense: Expense) => {
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
      await apiService.deleteExpense(deleteDialog.expense.id);
      toast.success('Expense deleted successfully!');
      await fetchExpenses();
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

  // Get unique categories for filter
  const categories = Array.from(new Set(expenses.map(expense => expense.category)));

  // Calculate summary stats
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

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
            <CardTitle className="text-red-600">Error Loading Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchExpenses} className="w-full">
              Retry
            </Button>
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
          <AddExpenseModal onExpenseAdded={fetchExpenses} />
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
                ${totalSpent.toFixed(2)}
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
                ${averageExpense.toFixed(2)}
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
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExpenses
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((expense) => (
                    <div key={expense.id} className="group relative flex items-center justify-between p-4 border rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-white">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="font-medium text-gray-900 truncate">{expense.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {expense.vendor} • <span className="capitalize">{expense.category}</span> • {new Date(expense.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">${expense.amount.toFixed(2)}</div>
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
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Expense Modal */}
        <EditExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          expense={editingExpense}
          onExpenseUpdated={fetchExpenses}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Expense"
          description={
            deleteDialog.expense
              ? `Are you sure you want to delete "${deleteDialog.expense.description}" ($${deleteDialog.expense.amount.toFixed(2)})? This action cannot be undone.`
              : ''
          }
          isLoading={deleteDialog.isLoading}
        />
      </div>
    </div>
  );
};

export default ExpensesPage;