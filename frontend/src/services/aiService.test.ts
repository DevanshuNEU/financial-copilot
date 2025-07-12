/**
 * Test Script for AI Service
 * Tests the AI service functionality with various inputs
 */

import { aiService } from './aiService';

// Test cases for AI expense processing
const testCases = [
  "I spent $15 on coffee at Starbucks",
  "Paid $25 for lunch at the cafeteria",
  "Bought textbooks for $120",
  "$8 Uber ride to campus",
  "Dinner with friends cost me $35",
  "Gas was $45 today",
  "Netflix subscription $12.99",
  "Just spent 20 dollars on pizza"
];

/**
 * Test AI Service functionality
 */
async function testAIService() {
  console.log('🤖 Testing AI Service...\n');
  
  // Test availability
  console.log('✅ AI Service Available:', aiService.isAvailable());
  
  // Test each case
  for (const testCase of testCases) {
    console.log(`\n📝 Testing: "${testCase}"`);
    
    try {
      const result = await aiService.processExpense(testCase);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log('   Amount:', result.expense?.amount);
        console.log('   Description:', result.expense?.description);
        console.log('   Category:', result.expense?.category);
        console.log('   Confidence:', result.confidence);
      } else {
        console.log('❌ Failed:', result.error);
      }
    } catch (error) {
      console.log('💥 Error:', error);
    }
  }
  
  // Test suggestions
  console.log('\n🔍 Testing Suggestions...');
  const suggestions = aiService.getSuggestions('coffee');
  console.log('Coffee suggestions:', suggestions);
  
  console.log('\n🎉 AI Service Test Complete!');
}

// Run the test
testAIService().catch(console.error);
