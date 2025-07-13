/**
 * ChatInput Component
 * 
 * Professional input component with suggestions and send functionality
 */

import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: string[];
  isProcessing: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = React.memo(({
  value,
  onChange,
  onSend,
  onSuggestionClick,
  suggestions,
  isProcessing,
  placeholder = "Tell me about your expense...",
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isProcessing]);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isProcessing) {
        onSend();
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-3">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2 animate-in slide-in-from-bottom-1 duration-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Sparkles className="w-3 h-3" />
            <span>Quick suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(suggestion)}
                className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="flex gap-2 p-1 bg-white rounded-xl border border-green-200 shadow-sm focus-within:shadow-md focus-within:border-green-400 transition-all duration-200">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || isProcessing}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-gray-500"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isProcessing}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
});

export default ChatInput;