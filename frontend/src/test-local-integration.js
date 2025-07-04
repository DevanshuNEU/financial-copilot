// Quick test to verify local storage integration works
// Run this in browser console: node test-local-integration.js

// Test 1: Check if database config is set to local
const databaseConfig = require('./config/database');
console.log('🗄️ Database mode:', databaseConfig.databaseConfig.mode);

// Test 2: Check if localStorage is accessible
if (typeof window !== 'undefined' && window.localStorage) {
  console.log('✅ LocalStorage is available');
  
  // Test 3: Test saving and loading data
  const testData = {
    monthlyBudget: 1200,
    currency: 'USD',
    hasMealPlan: true,
    fixedCosts: [
      { name: 'Rent', amount: 500, category: 'housing' },
      { name: 'Meal Plan', amount: 100, category: 'food' }
    ],
    spendingCategories: {
      'Entertainment': 150,
      'Shopping': 200,
      'Transport': 50
    }
  };
  
  // Save test data
  localStorage.setItem('financial_copilot_onboarding', JSON.stringify({
    ...testData,
    completed_at: new Date().toISOString(),
    is_complete: true
  }));
  
  // Load test data
  const stored = localStorage.getItem('financial_copilot_onboarding');
  if (stored) {
    const parsed = JSON.parse(stored);
    console.log('✅ Data save/load test passed');
    console.log('📊 Test data:', parsed);
  } else {
    console.log('❌ Data save/load test failed');
  }
} else {
  console.log('❌ LocalStorage is not available');
}

console.log('🚀 Local integration test complete!');
