import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService } from "../../services/api";
import {
  DashboardData,
  Expense,
  WeeklyComparisonData,
  SafeToSpendResponse,
} from "../../types";
import AddExpenseModal from "./AddExpenseModal";
import { EditExpenseModal } from "./EditExpenseModal";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import SafeToSpendCard from "./SafeToSpendCard";
import SpendingDonutChart from "./SpendingDonutChart";
import FinancialHealthGauge from "./FinancialHealthGauge";
import WeeklyComparison from "./WeeklyComparison";
import { Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyComparisonData | null>(
    null
  );
  const [safeToSpendData, setSafeToSpendData] =
    useState<SafeToSpendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        dashboardResponse,
        expensesResponse,
        weeklyResponse,
        safeToSpendResponse,
      ] = await Promise.all([
        apiService.getDashboardData(),
        apiService.getExpenses(),
        apiService.getWeeklyComparison(),
        apiService.getSafeToSpend(),
      ]);

      setDashboardData(dashboardResponse);
      setExpenses(expensesResponse.expenses);
      setWeeklyData(weeklyResponse);
      setSafeToSpendData(safeToSpendResponse);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load data. Make sure the backend is running on port 5002."
      );
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      await apiService.deleteExpense(deleteDialog.expense.id);
      toast.success("Expense deleted successfully!");
      await fetchData(); // Refresh data
      setDeleteDialog({
        isOpen: false,
        expense: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Financial Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your expenses and insights
            </p>
          </div>
          <AddExpenseModal onExpenseAdded={fetchData} />
        </div>

        {/* Safe to Spend Calculator - Priority Feature */}
        <SafeToSpendCard data={safeToSpendData} />

        {/* Financial Health Gauge */}
        {safeToSpendData && <FinancialHealthGauge data={safeToSpendData} />}

        {/* Weekly Comparison */}
        {weeklyData && weeklyData.weeklyData && (
          <WeeklyComparison
            weeklyData={weeklyData.weeklyData}
            thisWeekTotal={weeklyData.thisWeekTotal}
            lastWeekTotal={weeklyData.lastWeekTotal}
            currentDayOfWeek={weeklyData.currentDayOfWeek}
          />
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Total Expenses</CardTitle>
              <CardDescription>All time spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${dashboardData?.overview.total_expenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Total Transactions</CardTitle>
              <CardDescription>Number of expenses recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {dashboardData?.overview.total_transactions}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Category Breakdown */}
        {dashboardData && safeToSpendData && (
          <SpendingDonutChart
            data={dashboardData.category_breakdown.map((cat) => ({
              ...cat,
              budget:
                safeToSpendData.budget_status.find(
                  (b) => b.category === cat.category
                )?.limit || 0,
              lastWeekTotal: 0, // TODO: Add last week data from backend
            }))}
            totalSpent={dashboardData.overview.total_expenses}
            totalBudget={safeToSpendData.safe_to_spend.total_budget}
          />
        )}
        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .slice(0, 5)
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="group relative flex items-center justify-between p-4 border rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-white">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-medium text-gray-900 truncate">
                        {expense.description}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {expense.vendor} •{" "}
                        <span className="capitalize">{expense.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </div>
                        <div className="text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              expense.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : expense.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
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
                            title="Edit expense">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(expense)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-150"
                            title="Delete expense">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Expense Modal */}
        <EditExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          expense={editingExpense}
          onExpenseUpdated={fetchData}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Expense"
          description={
            deleteDialog.expense
              ? `Are you sure you want to delete "${
                  deleteDialog.expense.description
                }" ($${deleteDialog.expense.amount.toFixed(
                  2
                )})? This action cannot be undone.`
              : ""
          }
          isLoading={deleteDialog.isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
