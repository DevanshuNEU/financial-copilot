/**
 * SmartAIInput Component - AI WORKS BEHIND THE SCENES
 * 
 * Clean input field that uses AI invisibly:
 * 1. Simple regex for basic formats like "Coffee $5"
 * 2. AI processing in background for complex inputs
 * 3. NO CHAT INTERFACE - just intelligent processing
 */

import React, { useState, useCallback, useRef } from 'react';
import { Send } from 'lucide-react';
import { useAppData } from '../../../contexts/AppDataContext';
import { aiService } from '../../../services/aiService';

interface SmartAIInputProps {
  className?: string;
}

export const SmartAIInput: React.FC<SmartAIInputProps> = ({ className = '' }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addExpense } = useAppData();

  // Smart suggestions based on time and common student expenses
  const getSmartSuggestions = () => {
    const hour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());

    if (hour >= 7 && hour <= 10) {
      return [
        'Coffee at Starbucks $5.50',
        'Breakfast burrito $8.99',
        'Campus parking $3'
      ];
    } else if (hour >= 11 && hour <= 14) {
      return [
        'Lunch at campus cafe $12.50',
        'Grabbed sushi $15.99',
        'Quick sandwich $7.25'
      ];
    } else if (hour >= 17 && hour <= 21) {
      return [
        'Dinner with friends $18',
        'Pizza delivery $14.50',
        'Grocery shopping $32'
      ];
    } else if (isWeekend) {
      return [
        'Uber to downtown $12',
        'Movie tickets $16',
        'Brunch $22'
      ];
    }

    return [
      'Coffee $5',
      'Lunch $12',
      'Uber $8'
    ];
  };

  const suggestions = getSmartSuggestions();

  // Handle natural language input processing - PURE AI ONLY
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted! Input:', input, 'Processing:', isProcessing);
    
    if (!input.trim() || isProcessing) {
      console.log('Form submission blocked:', { inputTrimmed: input.trim(), isProcessing });
      return;
    }

    setIsProcessing(true);
    console.log('Starting AI processing...');

    try {
      // Use ONLY AI processing - no regex bullshit!
      console.log('Calling aiService with context:', conversationContext);
      
      let aiResponse;
      if (conversationContext) {
        // Continue existing conversation
        aiResponse = await aiService.handleFollowUp(input.trim(), conversationContext);
      } else {
        // Start new conversation
        aiResponse = await aiService.processExpenseConversation(input.trim());
      }
      
      console.log('AI Response received:', aiResponse);
      
      if (aiResponse.success && aiResponse.complete && aiResponse.expense && 
          aiResponse.expense.amount && aiResponse.expense.description) {
        console.log('AI got complete expense info:', aiResponse.expense);
        // AI got complete info - save it
        await addExpense({
          amount: aiResponse.expense.amount,
          description: aiResponse.expense.description,
          category: aiResponse.expense.category || 'Other',
          vendor: aiResponse.expense.vendor || undefined,
          date: aiResponse.expense.date || new Date().toISOString().split('T')[0],
          status: 'approved'
        });
        console.log('Expense saved successfully!');
        
        setInput('');
        setConversationContext(null); // Clear conversation
        
        // Success feedback and reset placeholder
        if (inputRef.current) {
          inputRef.current.style.borderColor = '#10b981';
          inputRef.current.placeholder = 'Expense saved! Add another one...';
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.style.borderColor = '';
              inputRef.current.placeholder = 'I spent $15 on coffee...';
            }
          }, 2000);
        }
      } else if (aiResponse.success && aiResponse.needsMoreInfo && aiResponse.followUpQuestion) {
        console.log('AI needs more info:', aiResponse.followUpQuestion);
        // AI needs more info - clear input and show question as placeholder
        setInput(''); // Clear the input so user can see the question
        
        // Store conversation context for next input
        setConversationContext({
          pendingExpense: aiResponse.expense,
          lastQuestion: aiResponse.followUpQuestion
        });
        
        if (inputRef.current) {
          inputRef.current.style.borderColor = '#3b82f6';
          inputRef.current.placeholder = aiResponse.followUpQuestion;
          inputRef.current.focus(); // Focus so user can type answer
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.style.borderColor = '';
              inputRef.current.placeholder = 'I spent $15 on coffee...';
            }
          }, 15000); // Longer timeout so user can see the question
        }
      } else {
        console.log('AI could not understand input:', aiResponse);
        // AI couldn't understand - clear conversation context
        setConversationContext(null);
        // AI couldn't understand
        if (inputRef.current) {
          inputRef.current.style.borderColor = '#f59e0b';
          inputRef.current.placeholder = 'Could you rephrase that? Try "coffee $5" or "lunch yesterday"';
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.style.borderColor = '';
              inputRef.current.placeholder = 'I spent $15 on coffee...';
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      // Show error feedback
      if (inputRef.current) {
        inputRef.current.style.borderColor = '#ef4444';
        inputRef.current.placeholder = 'AI is having trouble. Try again in a moment.';
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.borderColor = '';
            inputRef.current.placeholder = 'I spent $15 on coffee...';
          }
        }, 3000);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, addExpense]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Input Field - Clean & Minimal with INVISIBLE AI */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-green-300/50 transition-all duration-300">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I spent $15 on coffee..."
            className="flex-1 px-6 py-4 bg-transparent border-0 focus:outline-none text-gray-700 placeholder-gray-400"
            disabled={isProcessing}
          />
          
          <button
            type="submit"
            disabled={!input?.trim() || isProcessing}
            className="m-2 p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            onClick={(e) => {
              console.log('Button clicked! Input:', input, 'Trimmed:', input?.trim(), 'Processing:', isProcessing);
            }}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Smart Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};