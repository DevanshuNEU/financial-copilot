/**
 * AI Chat Test Page
 * Standalone test for the AI Chat component
 */

import React, { useState } from 'react';
import { AIChat } from './AIChat';

const AIChatTest: React.FC = () => {
  const [processedExpenses, setProcessedExpenses] = useState<any[]>([]);

  const handleExpenseProcessed = (expense: any) => {
    console.log('Expense processed:', expense);
    setProcessedExpenses(prev => [...prev, expense]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Chat Component Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Component */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Chat Interface</h2>
          <AIChat 
            onExpenseProcessed={handleExpenseProcessed}
            className="border-2 border-blue-200"
          />
        </div>
        
        {/* Processed Expenses */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Processed Expenses</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {processedExpenses.length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses processed yet.</p>
            ) : (
              processedExpenses.map((expense, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="font-medium">${expense.amount}</div>
                  <div className="text-sm text-gray-600">{expense.category}</div>
                  <div className="text-sm">{expense.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Test Cases to Try:</h3>
        <ul className="text-sm space-y-1">
          <li>• "I spent $15 on coffee at Starbucks"</li>
          <li>• "Paid $25 for lunch at the cafeteria"</li>
          <li>• "Bought textbooks for $120"</li>
          <li>• "$8 Uber ride to campus"</li>
          <li>• "Dinner with friends cost me $35"</li>
          <li>• "Gas was $45 today"</li>
          <li>• "Netflix subscription $12.99"</li>
          <li>• "Just spent 20 dollars on pizza"</li>
        </ul>
      </div>
    </div>
  );
};

export default AIChatTest;