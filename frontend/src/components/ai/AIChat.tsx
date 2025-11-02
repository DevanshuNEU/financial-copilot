/**
 * Professional AI Chat Component
 * 
 * Clean, modular, and beautiful interface for expense processing
 * Green/white theme with professional UX
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useAppData } from '../../contexts/AppDataContext';

// Modular components
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';

// Custom hooks
import { 
  useChatState, 
  useChatSuggestions, 
  useChatProcessing 
} from './chat/useChatHooks';

interface AIChatProps {
  onExpenseProcessed?: (expense: any) => void;
  className?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  onExpenseProcessed,
  className = ''
}) => {
  // ✅ Get app data context including budget info
  const { addExpense, appData } = useAppData();
  
  // Chat state management
  const {
    messages,
    input,
    setInput,
    isProcessing,
    setIsProcessing,
    suggestions,
    setSuggestions,
    conversationContext,
    addMessage,
    clearInput,
    updateConversationContext
  } = useChatState();
  
  // Suggestions management
  const { generateSuggestions } = useChatSuggestions(
    conversationContext, 
    setSuggestions
  );
  
  // ✅ Message processing with budget context
  const { processMessage } = useChatProcessing(
    addMessage,
    updateConversationContext,
    onExpenseProcessed,
    addExpense,
    appData  // ✅ Pass budget context to AI!
  );
  
  // Input handlers
  const handleInputChange = (value: string) => {
    setInput(value);
    generateSuggestions(value);
  };
  
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userContent = input.trim();
    clearInput();
    setIsProcessing(true);
    
    try {
      await processMessage(userContent, conversationContext);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };
  
  // Generate placeholder based on context
  const getPlaceholder = () => {
    if (conversationContext?.lastQuestion) {
      return conversationContext.lastQuestion;
    }
    return "Tell me about your expense... (e.g., 'I spent $15 on coffee')";
  };
  
  return (
    <Card className={`flex flex-col h-96 shadow-lg border-green-200 ${className}`}>
      {/* Header */}
      <ChatHeader isAIAvailable={aiService.isAvailable()} />
      
      {/* Messages */}
      <ChatMessages 
        messages={messages} 
        isProcessing={isProcessing} 
      />
      
      {/* Input */}
      <CardContent className="p-4 bg-white border-t border-green-100">
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSend={handleSend}
          onSuggestionClick={handleSuggestionClick}
          suggestions={suggestions}
          isProcessing={isProcessing}
          placeholder={getPlaceholder()}
          disabled={isProcessing}
        />
        
        {/* AI Status Alert */}
        {!aiService.isAvailable() && (
          <Alert className="mt-3 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              AI service is not available. Using fallback processing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AIChat;