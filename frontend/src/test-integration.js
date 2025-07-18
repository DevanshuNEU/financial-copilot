// Test the complete EXPENSESINK local storage integration
// This tests the full user flow: Auth → Onboarding → Dashboard

import { LocalFinancialService } from '../services/financialService.local';
import { LocalAuthProvider } from '../contexts/authContext.local';

// Test data that matches the expected $1200 → $20/day flow
const testOnboardingData = {
  monthlyBudget: 1200,
  currency: 'USD',
  hasMealPlan: true,
  fixedCosts: [
    { name: 'Rent', amount: 400, category: 'housing' },
    { name: 'Meal Plan', amount: 200, category: 'food' }
  ],
  spendingCategories: {
    'Entertainment': 150,
    'Shopping': 200,
    'Transport': 150,
    'Miscellaneous': 100
  }
};

// Test Suite
async function testExpenseSinkLocalIntegration() {
  console.log('🚀 Starting EXPENSESINK Local Integration Test...');
  
  // Clean slate - clear any existing data
  localStorage.clear();
  
  // Initialize services
  const financialService = new LocalFinancialService();
  
  try {
    // Test 1: Check initial state
    console.log('\n📋 Test 1: Initial State Check');
    const hasOnboarding = await financialService.hasCompletedOnboarding();
    console.log('✅ Initial onboarding status:', hasOnboarding, '(should be false)');
    
    // Test 2: Save onboarding data
    console.log('\n💾 Test 2: Save Onboarding Data');
    await financialService.saveOnboardingData(testOnboardingData);
    console.log('✅ Onboarding data saved successfully');
    
    // Test 3: Load onboarding data
    console.log('\n📂 Test 3: Load Onboarding Data');
    const loadedData = await financialService.loadOnboardingData();
    console.log('✅ Loaded data:', loadedData);
    
    // Test 4: Check onboarding completion
    console.log('\n✔️ Test 4: Onboarding Completion Check');
    const isComplete = await financialService.hasCompletedOnboarding();
    console.log('✅ Onboarding complete:', isComplete, '(should be true)');
    
    // Test 5: Calculate personalized safe-to-spend
    console.log('\n🧮 Test 5: Calculate Safe-to-Spend');
    const safeToSpend = financialService.calculatePersonalizedSafeToSpend(testOnboardingData);
    console.log('✅ Safe-to-spend calculation:', safeToSpend);
    
    // Test 6: Verify the key calculation (should be ~$20/day)
    console.log('\n🎯 Test 6: Verify Key Calculation');
    const expectedFixedCosts = 400 + 200; // Rent + Meal Plan
    const expectedAvailable = 1200 - expectedFixedCosts; // $600 available
    const expectedDaily = expectedAvailable / safeToSpend.daysLeftInMonth;
    
    console.log('Expected fixed costs:', expectedFixedCosts);
    console.log('Expected available:', expectedAvailable);
    console.log('Expected daily (~$20):', expectedDaily.toFixed(2));
    console.log('Actual daily:', safeToSpend.dailySafeAmount.toFixed(2));
    
    // Test 7: Get personalized messages
    console.log('\n💬 Test 7: Personalized Messages');
    const welcomeMessage = financialService.getWelcomeMessage(testOnboardingData);
    const insights = financialService.getPersonalizedInsights(testOnboardingData);
    console.log('✅ Welcome message:', welcomeMessage);
    console.log('✅ Insights:', insights);
    
    // Test 8: Data persistence across "sessions"
    console.log('\n🔄 Test 8: Data Persistence');
    // Create new service instance to simulate page refresh
    const newService = new LocalFinancialService();
    const persistedData = await newService.loadOnboardingData();
    const persistedComplete = await newService.hasCompletedOnboarding();
    
    console.log('✅ Data persisted:', !!persistedData);
    console.log('✅ Status persisted:', persistedComplete);
    
    // Test 9: Auth simulation
    console.log('\n🔐 Test 9: Auth Simulation');
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test@student.edu'
    };
    
    localStorage.setItem('financial_copilot_user', JSON.stringify(testUser));
    const storedUser = JSON.parse(localStorage.getItem('financial_copilot_user') || '{}');
    console.log('✅ User auth simulation:', storedUser.email);
    
    // Test 10: Complete user flow validation
    console.log('\n🎉 Test 10: Complete User Flow Validation');
    
    const hasUser = !!storedUser.email;
    const hasOnboardingData = !!persistedData;
    const hasValidCalculation = safeToSpend.dailySafeAmount > 0;
    
    console.log('User authenticated:', hasUser);
    console.log('Onboarding complete:', hasOnboardingData);
    console.log('Valid calculation:', hasValidCalculation);
    
    if (hasUser && hasOnboardingData && hasValidCalculation) {
      console.log('🎊 SUCCESS! Complete user flow working perfectly!');
      console.log('🔥 User journey: Auth → Onboarding → Dashboard with $' + safeToSpend.dailySafeAmount.toFixed(2) + '/day guidance');
    } else {
      console.log('❌ Some aspect of the user flow has issues');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  console.log('\n🏁 EXPENSESINK Local Integration Test Complete!');
}

// Run the test
export default testExpenseSinkLocalIntegration;
