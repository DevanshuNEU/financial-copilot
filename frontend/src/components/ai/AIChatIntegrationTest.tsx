/**
 * End-to-End Test for AI Chat Integration
 * 
 * This test verifies that:
 * 1. AI processes natural language input
 * 2. Expense is saved to the database
 * 3. UI updates correctly
 * 4. User gets proper feedback
 */

import React from 'react';
import { AIChat } from './AIChat';

const AIChatIntegrationTest: React.FC = () => {
  const [lastExpense, setLastExpense] = React.useState<any>(null);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 AI Chat Integration Test</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Test Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Type: "I spent $15 on coffee at Starbucks"</li>
          <li>Click send and watch the AI process it</li>
          <li>Verify the expense is saved (check console)</li>
          <li>Go to Expenses tab to confirm it appears there</li>
          <li>Try different expense formats</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Chat */}
        <div>
          <h2 className="text-lg font-semibold mb-3">AI Chat Interface</h2>
          <AIChat 
            onExpenseProcessed={(expense) => {
              console.log('✅ Expense processed and saved:', expense);
              setLastExpense(expense);
            }}
            className="border-2 border-blue-200"
          />
        </div>
        
        {/* Debug Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Debug Information</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Last Processed Expense:</h3>
              {lastExpense ? (
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(lastExpense, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 text-sm">No expense processed yet</p>
              )}
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">AI Service Status:</h3>
              <p className="text-sm">
                {typeof window !== 'undefined' && 'aiService' in window 
                  ? '✅ Available' 
                  : '❌ Not available (using fallback)'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2">Success Criteria:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ AI extracts amount, category, and description correctly</li>
          <li>✅ Expense is saved to your expense list</li>
          <li>✅ Success message appears in chat</li>
          <li>✅ Expense appears in Expenses tab</li>
          <li>✅ Dashboard data refreshes automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default AIChatIntegrationTest;