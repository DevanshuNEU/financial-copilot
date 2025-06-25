// Onboarding data management service
// Handles loading and managing user onboarding data for dashboard personalization

export interface OnboardingData {
  monthlyBudget: number;
  currency: string;
  hasMealPlan: boolean;
  fixedCosts: Array<{ name: string; amount: number; category: string }>;
  spendingCategories: Record<string, number>;
}

export interface PersonalizedSafeToSpend {
  totalBudget: number;
  totalFixedCosts: number;
  availableForSpending: number;
  dailySafeAmount: number;
  currency: string;
  daysLeftInMonth: number;
  isPersonalized: boolean;
}

class OnboardingService {
  private static readonly ONBOARDING_COMPLETE_KEY = 'financialCopilot_onboardingComplete';
  private static readonly USER_DATA_KEY = 'financialCopilot_userData';
  private static readonly ONBOARDING_SKIPPED_KEY = 'financialCopilot_onboardingSkipped';

  /**
   * Check if user has completed onboarding
   */
  hasCompletedOnboarding(): boolean {
    return localStorage.getItem(OnboardingService.ONBOARDING_COMPLETE_KEY) === 'true';
  }

  /**
   * Check if user has skipped onboarding
   */
  hasSkippedOnboarding(): boolean {
    return localStorage.getItem(OnboardingService.ONBOARDING_SKIPPED_KEY) === 'true';
  }

  /**
   * Get user's onboarding data
   */
  getOnboardingData(): OnboardingData | null {
    try {
      const dataString = localStorage.getItem(OnboardingService.USER_DATA_KEY);
      if (!dataString) return null;
      
      return JSON.parse(dataString) as OnboardingData;
    } catch (error) {
      console.error('Failed to parse onboarding data:', error);
      return null;
    }
  }

  /**
   * Calculate personalized safe to spend based on onboarding data
   */
  calculatePersonalizedSafeToSpend(data: OnboardingData): PersonalizedSafeToSpend {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate days left in current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysLeftInMonth = Math.max(1, lastDayOfMonth - currentDay + 1);

    // Calculate total fixed costs
    const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0);
    
    // Available for spending (after fixed costs)
    const availableForSpending = data.monthlyBudget - totalFixedCosts;
    
    // Daily safe amount based on remaining days
    const dailySafeAmount = Math.max(0, availableForSpending / daysLeftInMonth);

    return {
      totalBudget: data.monthlyBudget,
      totalFixedCosts,
      availableForSpending: Math.max(0, availableForSpending),
      dailySafeAmount,
      currency: data.currency,
      daysLeftInMonth,
      isPersonalized: true
    };
  }

  /**
   * Get currency symbol from currency code
   */
  getCurrencySymbol(currency: string): string {
    const currencyMap: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF ',
      'CNY': '¥',
      'INR': '₹'
    };

    return currencyMap[currency] || currency + ' ';
  }

  /**
   * Get personalized welcome message based on user's setup
   */
  getWelcomeMessage(data: OnboardingData): string {
    const currencySymbol = this.getCurrencySymbol(data.currency);
    const totalFixedCosts = data.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const availableForSpending = data.monthlyBudget - totalFixedCosts;
    
    if (data.hasMealPlan) {
      return `Welcome back! Your ${currencySymbol}${data.monthlyBudget} budget with meal plan gives you ${currencySymbol}${availableForSpending.toFixed(0)} for fun stuff! 🎓`;
    } else {
      return `Welcome back! You've got ${currencySymbol}${availableForSpending.toFixed(0)} available from your ${currencySymbol}${data.monthlyBudget} monthly budget! 🚀`;
    }
  }

  /**
   * Get personalized insights based on user's choices
   */
  getPersonalizedInsights(data: OnboardingData): string[] {
    const insights: string[] = [];
    const currencySymbol = this.getCurrencySymbol(data.currency);
    
    // Meal plan insight
    if (data.hasMealPlan) {
      const mealPlanCost = data.fixedCosts.find(cost => 
        cost.name.toLowerCase().includes('meal') || cost.category === 'food'
      );
      if (mealPlanCost) {
        insights.push(`🍕 Your ${currencySymbol}${mealPlanCost.amount} meal plan is saving you money on food!`);
      } else {
        insights.push(`🍕 Your meal plan helps keep food costs predictable!`);
      }
    }

    // Budget level insight
    if (data.monthlyBudget <= 1000) {
      insights.push(`💪 Managing on a tight budget? You're building great financial habits!`);
    } else if (data.monthlyBudget >= 1500) {
      insights.push(`💎 With your flexible budget, you have room for both needs and wants!`);
    } else {
      insights.push(`✨ Your balanced budget gives you comfort and flexibility!`);
    }

    // Spending category insights
    const categories = data.spendingCategories;
    const entertainmentBudget = categories['Entertainment'] || categories['entertainment'] || 0;
    if (entertainmentBudget > 0) {
      insights.push(`🎉 ${currencySymbol}${entertainmentBudget} for entertainment - perfect for student life!`);
    }

    const transportBudget = categories['Transportation'] || categories['transport'] || 0;
    if (transportBudget > 0) {
      insights.push(`🚗 ${currencySymbol}${transportBudget} allocated for getting around campus and beyond!`);
    }

    return insights.slice(0, 3); // Return max 3 insights
  }

  /**
   * Clear all onboarding data (for testing/reset)
   */
  clearOnboardingData(): void {
    localStorage.removeItem(OnboardingService.ONBOARDING_COMPLETE_KEY);
    localStorage.removeItem(OnboardingService.USER_DATA_KEY);
    localStorage.removeItem(OnboardingService.ONBOARDING_SKIPPED_KEY);
  }
}

export const onboardingService = new OnboardingService();
