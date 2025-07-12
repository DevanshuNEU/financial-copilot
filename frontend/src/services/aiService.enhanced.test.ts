/**
 * Enhanced AI Service Test
 * Tests the improved AI processing with better descriptions and categorization
 */

import { aiService } from './aiService';

// Enhanced test cases with expected results
const enhancedTestCases = [
  {
    input: "I spent $15 on coffee at Starbucks",
    expected: { amount: 15, category: "Food & Dining", description: "Coffee at Starbucks", vendor: "Starbucks" }
  },
  {
    input: "i spent on food that was sushi $100",
    expected: { amount: 100, category: "Food & Dining", description: "Sushi", vendor: "Unknown" }
  },
  {
    input: "paid $25 for lunch at the cafeteria",
    expected: { amount: 25, category: "Food & Dining", description: "Lunch at cafeteria", vendor: "Cafeteria" }
  },
  {
    input: "bought textbooks for chemistry class $120",
    expected: { amount: 120, category: "Education", description: "Chemistry textbooks", vendor: "Unknown" }
  },
  {
    input: "uber to campus was $8",
    expected: { amount: 8, category: "Transportation", description: "Uber to campus", vendor: "Uber" }
  },
  {
    input: "dinner with friends cost me $35",
    expected: { amount: 35, category: "Food & Dining", description: "Dinner with friends", vendor: "Unknown" }
  },
  {
    input: "netflix subscription $12.99",
    expected: { amount: 12.99, category: "Entertainment", description: "Netflix subscription", vendor: "Netflix" }
  },
  {
    input: "gas for car $45",
    expected: { amount: 45, category: "Transportation", description: "Gas", vendor: "Unknown" }
  },
  {
    input: "went to movies spent $18",
    expected: { amount: 18, category: "Entertainment", description: "Movie tickets", vendor: "Unknown" }
  },
  {
    input: "20 dollars on pizza",
    expected: { amount: 20, category: "Food & Dining", description: "Pizza", vendor: "Unknown" }
  }
];

/**
 * Test enhanced AI service functionality
 */
async function testEnhancedAIService() {
  console.log('🚀 Testing Enhanced AI Service...\n');
  
  let passedTests = 0;
  let totalTests = enhancedTestCases.length;
  
  for (const testCase of enhancedTestCases) {
    console.log(`\n📝 Testing: "${testCase.input}"`);
    
    try {
      const result = await aiService.processExpense(testCase.input);
      
      if (result.success && result.expense) {
        console.log('✅ Processing successful!');
        console.log(`   Amount: $${result.expense.amount} (expected: $${testCase.expected.amount})`);
        console.log(`   Category: ${result.expense.category} (expected: ${testCase.expected.category})`);
        console.log(`   Description: "${result.expense.description}" (expected: "${testCase.expected.description}")`);
        console.log(`   Vendor: ${result.expense.vendor} (expected: ${testCase.expected.vendor})`);
        console.log(`   Confidence: ${Math.round(result.confidence * 100)}%`);
        
        // Check if results match expectations
        const amountMatch = Math.abs(result.expense.amount! - testCase.expected.amount) < 0.01;
        const categoryMatch = result.expense.category === testCase.expected.category;
        const descriptionSimilar = result.expense.description?.toLowerCase().includes(testCase.expected.description.toLowerCase().split(' ')[0]);
        
        if (amountMatch && categoryMatch) {
          console.log('🎯 Test PASSED!');
          passedTests++;
        } else {
          console.log('❌ Test FAILED - Results don\'t match expectations');
        }
      } else {
        console.log('❌ Processing failed:', result.error);
      }
    } catch (error) {
      console.log('💥 Error:', error);
    }
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  // Test suggestions
  console.log('\n🔍 Testing Smart Suggestions...');
  const suggestionTests = ['coffee', 'lunch', 'uber', 'textbook', 'movie'];
  
  for (const test of suggestionTests) {
    const suggestions = aiService.getSuggestions(test);
    console.log(`   "${test}" → ${suggestions.length} suggestions: ${suggestions.join(', ')}`);
  }
  
  console.log('\n🎉 Enhanced AI Service Test Complete!');
  console.log('\n🎯 Key Improvements:');
  console.log('• Better description cleaning and formatting');
  console.log('• Smarter vendor extraction');
  console.log('• Enhanced categorization with more patterns');
  console.log('• Improved fallback parsing');
  console.log('• Contextual smart suggestions');
  
  return { passedTests, totalTests, successRate: Math.round((passedTests / totalTests) * 100) };
}

// Export for use in other tests
export { testEnhancedAIService, enhancedTestCases };

// Run the test if executed directly
if (typeof window !== 'undefined') {
  testEnhancedAIService().catch(console.error);
}
