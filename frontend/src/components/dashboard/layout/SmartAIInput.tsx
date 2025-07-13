/**
 * SmartAIInput Component
 * 
 * Intelligent expense input field with zero interface design
 * Replaces traditional chat interface with seamless input experience
 */

import React, { useState, useRef } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface SmartAIInputProps {
  onExpenseProcessed?: (expense: any) => void;
}

export const SmartAIInput: React.FC<SmartAIInputProps> = ({ 
  onExpenseProcessed 
}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart suggestions based on input
  const generateSuggestions = (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const smartSuggestions = [
      'I spent $15 on coffee at Starbucks',
      'Yesterday I bought groceries for $46.77',
      'Uber to campus cost me $12',
      'Bought textbooks for chemistry class'
    ];

    setSuggestions(smartSuggestions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    generateSuggestions(value);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setSuggestions([]);

    try {
      // TODO: Integrate with AI service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
      
      // Simulate successful processing
      console.log('Processing expense:', input);
      setInput('');
      onExpenseProcessed?.({ 
        description: input, 
        amount: 15, 
        category: 'Food & Dining' 
      });
    } catch (error) {
      console.error('Error processing expense:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      {/* Smart Input Field */}
      <div className="relative">
        <div className="flex gap-3 p-2 bg-white/70 backdrop-blur-md rounded-2xl border border-green-200 shadow-lg focus-within:shadow-xl focus-within:border-green-400 transition-all duration-300">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your expense... (e.g., 'I spent $15 on coffee')"
            disabled={isProcessing}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-2 transition-all duration-200 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="absolute -bottom-8 left-0 flex items-center space-x-2 text-sm text-green-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>Processing your expense...</span>
          </div>
        )}
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && !isProcessing && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4" />
            <span>Quick suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 rounded-lg px-3 py-1"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAIInput;