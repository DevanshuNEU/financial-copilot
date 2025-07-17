import { useEffect, useRef, useState } from 'react';

/**
 * Modern Scroll Animation Hook - 2024 Best Practices
 * Uses Intersection Observer for performance-optimized scroll triggers
 * TypeScript-safe implementation
 */
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after animation to prevent re-triggering
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '-50px 0px', // Trigger slightly before element enters viewport
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

/**
 * Professional Animation Variants - TypeScript Safe
 */
export const modernAnimationVariants = {
  // Elegant fade + slide combination
  fadeSlide: {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut"
      }
    }
  },

  // Subtle scale with fade
  scaleGently: {
    hidden: { 
      opacity: 0, 
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut"
      }
    }
  },

  // Professional stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Stagger child item
  staggerChild: {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut"
      }
    }
  }
};

/**
 * Professional Easing and Timing Constants
 */
export const modernEasing = {
  // Natural easing curves
  easeOut: "easeOut",
  easeIn: "easeIn", 
  easeInOut: "easeInOut",
  
  // Professional timings
  fast: 0.3,
  medium: 0.5,
  slow: 0.8,
  
  // Stagger timings
  staggerDelay: 0.1,
  staggerDelayLong: 0.2
} as const;
