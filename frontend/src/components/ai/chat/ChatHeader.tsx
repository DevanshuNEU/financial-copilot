/**
 * ChatHeader Component
 * 
 * Professional header with AI status and branding
 */

import React from 'react';
import { Bot, Wifi, WifiOff } from 'lucide-react';

interface ChatHeaderProps {
  isAIAvailable: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({ isAIAvailable }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl p-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Financial Assistant</h3>
            <p className="text-green-100 text-sm">
              Tell me about your expenses naturally
            </p>
          </div>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2">
          {isAIAvailable ? (
            <>
              <Wifi className="w-4 h-4 text-green-200" />
              <span className="text-xs text-green-100">AI Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-300" />
              <span className="text-xs text-red-200">Offline Mode</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatHeader;