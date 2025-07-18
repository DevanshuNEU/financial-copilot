import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button as BaseButton } from './button';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  rippleColor?: string;
  icon?: React.ReactNode;
  arrowAnimation?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  icon,
  arrowAnimation = false,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isHovered, setIsHovered] = useState(false);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    // Call original onClick
    if (onClick && !disabled && !loading) {
      onClick();
    }
  };

  return (
    <motion.div
      className="relative inline-block"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <BaseButton
        variant={variant}
        size={size}
        disabled={disabled || loading}
        className={`relative overflow-hidden transition-all duration-300 ${className}`}
        onClick={createRipple}
        {...props}
      >
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-inherit"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button Content */}
        <motion.div
          className="flex items-center gap-2 relative z-10"
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Icon with Animation */}
          {icon && (
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {icon}
            </motion.div>
          )}
          
          {children}
          
          {/* Arrow Animation */}
          {arrowAnimation && (
            <motion.div
              animate={isHovered ? { x: 3 } : { x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="ml-1"
            >
              →
            </motion.div>
          )}
        </motion.div>

        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: rippleColor,
              }}
              initial={{
                width: 0,
                height: 0,
                opacity: 1,
              }}
              animate={{
                width: 120,
                height: 120,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Success State Animation */}
        <AnimatePresence>
          {/* Add success state logic here if needed */}
        </AnimatePresence>
      </BaseButton>
    </motion.div>
  );
};