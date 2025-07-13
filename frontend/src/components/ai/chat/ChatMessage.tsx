/**
 * ChatMessage Component
 * 
 * Individual message component with professional styling
 * Supports user/assistant messages with proper formatting
 */

import React from 'react';
import { Bot, User, CheckCircle, Clock } from 'lucide-react';
import { AIChatMessage } from '../../../types';

interface ChatMessageProps {
  message: AIChatMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div
      className={`flex gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      } animate-in slide-in-from-bottom-2 duration-300`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      {/* Message Content */}
      <div
        className={`max-w-[75%] ${
          isUser
            ? 'bg-green-600 text-white rounded-2xl rounded-br-md'
            : 'bg-white border border-green-100 rounded-2xl rounded-bl-md shadow-sm'
        } px-4 py-3 group hover:shadow-md transition-all duration-200`}
      >
        {/* Message Text */}
        <div className={`text-sm leading-relaxed ${
          isUser ? 'text-white' : 'text-gray-800'
        }`}>
          {message.content.split('\n').map((line, index) => (
            <div key={index} className={index > 0 ? 'mt-2' : ''}>
              {line.trim() === '' ? <br /> : line}
            </div>
          ))}
        </div>
        
        {/* Message Footer */}
        <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
          isUser 
            ? 'border-green-500 border-opacity-30' 
            : 'border-gray-100'
        }`}>
          <div className={`flex items-center gap-2 text-xs ${
            isUser ? 'text-green-100' : 'text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(message.timestamp)}</span>
          </div>
          
          {/* Success Indicators */}
          <div className="flex items-center gap-2">
            {message.metadata?.expenseProcessed && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Saved</span>
              </div>
            )}
            {message.metadata?.confidence && (
              <span className={`text-xs font-medium ${
                isUser ? 'text-green-200' : 'text-gray-600'
              }`}>
                {Math.round(message.metadata.confidence * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatMessage;