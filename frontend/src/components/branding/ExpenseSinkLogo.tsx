/**
 * EXPENSESINK Custom Logo Component
 * Professional, modern logo design for the revolutionary student finance app
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface ExpenseSinkLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'minimal';
  animated?: boolean;
  className?: string;
}

const ExpenseSinkLogo: React.FC<ExpenseSinkLogoProps> = ({
  size = 'md',
  variant = 'default',
  animated = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const colors = {
    default: {
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      text: 'text-gray-900',
      accent: 'text-emerald-600'
    },
    white: {
      gradient: 'from-white via-gray-100 to-white',
      text: 'text-white',
      accent: 'text-emerald-200'
    },
    minimal: {
      gradient: 'from-gray-800 via-gray-700 to-gray-800',
      text: 'text-gray-900',
      accent: 'text-gray-600'
    }
  };

  const LogoIcon = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-gradient-to-br ${colors[variant].gradient} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}
      initial={animated ? { scale: 0, rotate: -180 } : undefined}
      animate={animated ? { scale: 1, rotate: 0 } : undefined}
      transition={animated ? { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 0.8
      } : undefined}
      whileHover={animated ? { 
        scale: 1.05, 
        rotate: 5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      } : undefined}
    >
      {/* Animated Background Particles */}
      {animated && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-l from-teal-400 to-emerald-400 opacity-10"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}
      
      {/* ES Letters with Modern Typography */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        initial={animated ? { opacity: 0, y: 10 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={animated ? { delay: 0.5, duration: 0.6 } : undefined}
      >
        <span className={`font-black ${textSizeClasses[size]} ${variant === 'white' ? 'text-white' : 'text-white'} tracking-tighter leading-none`}>
          ES
        </span>
      </motion.div>
      
      {/* Subtle Inner Glow */}
      <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );

  const LogoText = () => (
    <motion.div
      className="flex flex-col"
      initial={animated ? { opacity: 0, x: -20 } : undefined}
      animate={animated ? { opacity: 1, x: 0 } : undefined}
      transition={animated ? { delay: 0.7, duration: 0.6 } : undefined}
    >
      <motion.span
        className={`font-black ${textSizeClasses[size]} ${colors[variant].text} tracking-tight leading-none`}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        whileHover={animated ? { scale: 1.02 } : undefined}
      >
        EXPENSESINK
      </motion.span>
      {size !== 'sm' && (
        <motion.span
          className={`text-xs ${colors[variant].accent} font-medium tracking-wide uppercase mt-0.5`}
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={animated ? { delay: 1, duration: 0.4 } : undefined}
        >
          Student Finance
        </motion.span>
      )}
    </motion.div>
  );

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={animated ? { duration: 0.8 } : undefined}
    >
      <LogoIcon />
      <LogoText />
    </motion.div>
  );
};

export default ExpenseSinkLogo;