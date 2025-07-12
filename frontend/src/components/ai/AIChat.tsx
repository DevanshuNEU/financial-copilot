/**
 * AI Chat Component for Financial Copilot
 * 
 * This component provides a conversational interface for users to:
 * - Input expenses in natural language
 * - Receive AI-powered responses
 * - Save expenses automatically
 * - Get smart suggestions
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { aiService } from '../../services/aiService';
import { AIChatMessage } from '../../types';

interface AIChatProps {
  onExpenseProcessed?: (expense: any) => void;
  className?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  onExpenseProcessed,
  className = ''
}) => {
  // State management
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI financial assistant. Just tell me about your expenses in natural language, like 'I spent $15 on coffee' or 'Paid $25 for lunch'.",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle input changes and show suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Show suggestions based on input
    if (value.length > 2) {
      const newSuggestions = aiService.getSuggestions(value);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSuggestions([]);
    setIsProcessing(true);
    
    try {
      // Process expense with AI
      const result = await aiService.processExpense(userMessage.content);
      
      let assistantMessage: AIChatMessage;
      
      if (result.success && result.expense) {
        // Success - expense processed
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Perfect! I've recorded your expense:\n\n💰 **Amount:** $${result.expense.amount}\n🏷️ **Category:** ${result.expense.category}\n📝 **Description:** ${result.expense.description}\n\nConfidence: ${Math.round(result.confidence * 100)}%`,
          timestamp: new Date(),
          metadata: {
            expenseProcessed: true,
            confidence: result.confidence
          }
        };
        
        // Notify parent component
        onExpenseProcessed?.(result.expense);
        
      } else {
        // Error - couldn't process
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I had trouble processing that expense. ${result.error || 'Please try rephrasing.'}\n\nTry something like:\n• "I spent $15 on coffee"\n• "Paid $25 for lunch at the cafeteria"\n• "Bought textbooks for $120"`,
          timestamp: new Date(),
          metadata: {
            expenseProcessed: false,
            confidence: 0
          }
        };
      }
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
        metadata: {
          expenseProcessed: false,
          confidence: 0
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };
  
  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <Card className={`flex flex-col h-80 ${className}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Financial Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 p-2 border rounded-lg bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <Bot className="w-6 h-6 text-blue-600 mt-1" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                  <span>{formatTime(message.timestamp)}</span>
                  {message.metadata?.expenseProcessed && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                  {message.metadata?.confidence && (
                    <span>
                      {Math.round(message.metadata.confidence * 100)}%
                    </span>
                  )}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600 mt-1" />
                </div>
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-6 h-6 text-blue-600 mt-1" />
              <div className="bg-white border rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing your expense...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your expense... (e.g., 'I spent $15 on coffee')"
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            size="sm"
            className="px-3"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Status */}
        {!aiService.isAvailable() && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              AI service is not available. Using fallback parsing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AIChat;