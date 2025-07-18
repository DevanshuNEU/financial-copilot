/**
 * SYNCHRONIZED ANIMATION SYSTEM
 * Ensures all animations (opacity, transform, etc.) happen in perfect sync
 */

// Synchronized animation constants
export const syncedAnimation = {
  duration: 0.6,
  easing: [0.4, 0, 0.2, 1], // ease-out cubic-bezier
  stagger: 0.1,
  
  // Common animation variants
  fadeSlideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  
  fadeSlideUpStagger: (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }
  }),
  
  // For cards and containers
  cardReveal: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

// Scroll animation variants - perfectly synchronized
export const scrollAnimationVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Staggered container variant
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Individual item variant
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};
