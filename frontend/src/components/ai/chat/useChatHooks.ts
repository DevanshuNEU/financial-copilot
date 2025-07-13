/**
 * Chat Hooks - Custom hooks for chat functionality
 * 
 * Professional separation of concerns and state management
 */

import { useState, useCallback } from 'react';
import { aiService } from '../../../services/aiService';
import type { SmartAIResponse, ConversationContext } from '../../../services/aiService';
import { AIChatMessage } from '../../../types';

export const useChatState = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! I'm here to help track your expenses. Just tell me what you spent money on and I'll take care of the rest!",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationContext, setConversationContext] = useState<ConversationContext | null>(null);
  
  const addMessage = useCallback((message: AIChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  const clearInput = useCallback(() => {
    setInput('');
    setSuggestions([]);
  }, []);
  
  const updateConversationContext = useCallback((context: ConversationContext | null) => {
    setConversationContext(context);
  }, []);
  
  return {
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
  };
};

export const useChatSuggestions = (
  conversationContext: ConversationContext | null,
  setSuggestions: (suggestions: string[]) => void
) => {
  const generateSuggestions = useCallback((input: string) => {
    if (conversationContext) {
      // Contextual suggestions for follow-ups
      if (conversationContext.lastQuestion?.toLowerCase().includes('amount') || 
          conversationContext.lastQuestion?.toLowerCase().includes('much')) {
        setSuggestions(['$4.50', '$12.99', '$25.00', '$50.00']);
      } else if (conversationContext.lastQuestion?.toLowerCase().includes('where') ||
                 conversationContext.lastQuestion?.toLowerCase().includes('vendor')) {
        setSuggestions(['Starbucks', 'Target', 'Amazon', 'Campus Store']);
      } else {
        setSuggestions([]);
      }
    } else if (input.length > 2) {
      // General expense suggestions
      setSuggestions([
        'I spent $15 on coffee at Starbucks',
        'Yesterday I bought groceries for $46.77',
        'Uber to campus cost me $12',
        'Bought textbooks for chemistry class'
      ]);
    } else {
      setSuggestions([]);
    }
  }, [conversationContext, setSuggestions]);
  
  return { generateSuggestions };
};

export const useChatProcessing = (
  addMessage: (message: AIChatMessage) => void,
  updateConversationContext: (context: ConversationContext | null) => void,
  onExpenseProcessed?: (expense: any) => void,
  addExpense?: (expense: any) => Promise<void>
) => {
  const processMessage = useCallback(async (
    userContent: string,
    conversationContext: ConversationContext | null
  ): Promise<void> => {
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    
    try {
      // Process with AI
      const result: SmartAIResponse = conversationContext 
        ? await aiService.handleFollowUp(userContent, conversationContext)
        : await aiService.processExpenseConversation(userContent);
      
      let assistantMessage: AIChatMessage;
      
      if (result.success && result.complete && result.expense && addExpense) {
        // Complete expense - save to database
        try {
          await addExpense({
            amount: result.expense.amount!,
            description: result.expense.description!,
            category: result.expense.category!,
            vendor: result.expense.vendor || 'Unknown',
            date: result.expense.date || new Date().toISOString().split('T')[0],
            status: 'approved' as const
          });
          
          const description = result.expense.description || 'expense';
          const successMessages = [
            `Cool, expense added! Anything else?`,
            `Got it! Added your ${description.toLowerCase()} expense. What's next?`,
            `Perfect! I've saved that for you. Need to add anything else?`,
            `Done! Your ${description.toLowerCase()} is logged. Anything else?`,
            `Nice! Added that expense. What else can I help with?`
          ];
          
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: successMessages[Math.floor(Math.random() * successMessages.length)],
            timestamp: new Date(),
            metadata: {
              expenseProcessed: true,
              confidence: result.confidence
            }
          };
          
          updateConversationContext(null);
          onExpenseProcessed?.(result.expense);
          
        } catch (saveError) {
          const errorMessages = [
            `Hmm, I couldn't save that expense. Mind trying again?`,
            `Oops, something went wrong saving that. Can you try once more?`,
            `Sorry, I had trouble saving that expense. Give it another shot?`
          ];
          
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: errorMessages[Math.floor(Math.random() * errorMessages.length)],
            timestamp: new Date(),
            metadata: {
              expenseProcessed: false,
              confidence: result.confidence
            }
          };
          updateConversationContext(null);
        }
        
      } else if (result.success && result.needsMoreInfo && result.followUpQuestion) {
        // Need more information - keep it natural
        const contextualResponses = [
          result.followUpQuestion,
          `Got it! ${result.followUpQuestion}`,
          `Almost there. ${result.followUpQuestion}`,
          `Just need one more thing - ${result.followUpQuestion.toLowerCase()}`
        ];
        
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: contextualResponses[Math.floor(Math.random() * contextualResponses.length)],
          timestamp: new Date(),
          metadata: {
            expenseProcessed: false,
            confidence: result.confidence
          }
        };
        
        updateConversationContext({
          pendingExpense: result.expense,
          lastQuestion: result.followUpQuestion
        });
        
      } else {
        // Error - keep it friendly and helpful
        const helpfulResponses = [
          `I didn't quite catch that. Try something like "I spent $15 on coffee" or "bought groceries for $30"`,
          `Hmm, I'm not sure about that one. Maybe try "I spent $12 on lunch at Subway"?`,
          `Could you rephrase that? Something like "yesterday I spent $20 on gas" works great!`,
          `I'm a bit confused. Try telling me like "I bought textbooks for $80" or "coffee cost me $5"`
        ];
        
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)],
          timestamp: new Date(),
          metadata: {
            expenseProcessed: false,
            confidence: 0
          }
        };
        
        updateConversationContext(null);
      }
      
      addMessage(assistantMessage);
      
    } catch (error) {
      console.error('Chat processing error:', error);
      
      const friendlyErrors = [
        "Oops, something went wrong on my end. Mind trying again?",
        "Sorry, I hit a snag there. Can you give it another shot?",
        "Hmm, technical difficulties. Try that again for me?"
      ];
      
      const errorMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: friendlyErrors[Math.floor(Math.random() * friendlyErrors.length)],
        timestamp: new Date(),
        metadata: {
          expenseProcessed: false,
          confidence: 0
        }
      };
      
      addMessage(errorMessage);
    }
  }, [addMessage, updateConversationContext, onExpenseProcessed, addExpense]);
  
  return { processMessage };
};