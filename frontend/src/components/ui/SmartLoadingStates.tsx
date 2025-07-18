import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface SmartLoadingStatesProps {
  state: 'idle' | 'loading' | 'success' | 'error';
  loadingText?: string;
  successText?: string;
  errorText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SmartLoadingStates: React.FC<SmartLoadingStatesProps> = ({
  state,
  loadingText = 'Processing...',
  successText = 'Success!',
  errorText = 'Something went wrong',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${sizeClasses[size]} ${className}`}>
      <AnimatePresence mode="wait">
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className={`${iconSizes[size]} text-emerald-600`} />
            </motion.div>
            
            <motion.span
              className="text-gray-700 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {loadingText}
            </motion.span>

            {/* Loading Dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-emerald-600 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.2 
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            >
              <CheckCircle className={`${iconSizes[size]} text-green-600`} />
              
              {/* Success sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${20 + i * 20}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 10],
                    y: [0, (i - 1) * -5]
                  }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut" 
                  }}
                >
                  <Sparkles className="w-2 h-2 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.span
              className="text-green-700 font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {successText}
            </motion.span>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ x: [-2, 2, -2, 2, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AlertCircle className={`${iconSizes[size]} text-red-600`} />
            </motion.div>
            
            <motion.span
              className="text-red-700 font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {errorText}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};