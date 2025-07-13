/**
 * ChatMessages Component
 * 
 * Scrollable messages container with loading states
 */

import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { AIChatMessage } from '../../../types';

interface ChatMessagesProps {
  messages: AIChatMessage[];
  isProcessing: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = React.memo(({ 
  messages, 
  isProcessing 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white border border-green-100 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Processing your expense...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

export default ChatMessages;