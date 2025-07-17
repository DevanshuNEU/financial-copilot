/**
 * EXPENSESINK - ULTRA-SMOOTH ANIMATION SYSTEM
 * Research-based animation configurations for the most natural, smooth experience
 * Based on Material Design standards and motion psychology principles
 */

// ==========================================
// CORE EASING CURVES - RESEARCH BASED
// ==========================================

export const EASING_CURVES = {
  // Material Design Standard Curve - Most natural for general use
  ULTRA_SMOOTH: [0.4, 0.0, 0.2, 1] as const,
  
  // Gentle entrance for hero sections - softer start
  GENTLE_ENTRANCE: [0.25, 0.1, 0.25, 1] as const,
  
  // Smooth exit for leaving elements
  SMOOTH_EXIT: [0.4, 0.0, 1, 1] as const,
  
  // Spring-like for interactive elements
  SPRING: [0.25, 0.46, 0.45, 0.94] as const,
  
  // Ultra-gentle for subtle animations
  WHISPER: [0.16, 1, 0.3, 1] as const,
} as const;

// ==========================================
// ANIMATION PRESETS - CONTENT HIERARCHY
// ==========================================

export const ANIMATION_PRESETS = {
  // Hero section - deserves maximum attention and time
  HERO: {
    duration: 1.2,
    easing: EASING_CURVES.GENTLE_ENTRANCE,
    y: 12, // Minimal movement for smoothness
    stagger: 0.2, // Generous spacing for elegance
  },
  
  // Primary content - features, main sections
  PRIMARY: {
    duration: 1.0,
    easing: EASING_CURVES.ULTRA_SMOOTH,
    y: 16,
    stagger: 0.15,
  },
  
  // Secondary content - testimonials, trust indicators
  SECONDARY: {
    duration: 0.8,
    easing: EASING_CURVES.ULTRA_SMOOTH,
    y: 12,
    stagger: 0.1,
  },
  
  // Subtle elements - icons, badges, small UI
  SUBTLE: {
    duration: 0.6,
    easing: EASING_CURVES.WHISPER,
    y: 8,
    stagger: 0.08,
  },
  
  // Interactive elements - buttons, cards on hover
  INTERACTIVE: {
    duration: 0.3,
    easing: EASING_CURVES.SPRING,
    y: 4,
    stagger: 0.05,
  },
} as const;

// ==========================================
// FRAMER MOTION VARIANTS - READY TO USE
// ==========================================

export const createAnimationVariants = (preset: keyof typeof ANIMATION_PRESETS) => {
  const config = ANIMATION_PRESETS[preset];
  
  return {
    hidden: {
      opacity: 0,
      y: config.y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: config.easing,
      },
    },
  };
};

// Staggered container variants for multiple elements
export const createStaggeredVariants = (preset: keyof typeof ANIMATION_PRESETS) => {
  const config = ANIMATION_PRESETS[preset];
  
  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: 0.1,
      },
    },
  };
};

// Individual child variants for staggered animations
export const createChildVariants = (preset: keyof typeof ANIMATION_PRESETS) => {
  const config = ANIMATION_PRESETS[preset];
  
  return {
    hidden: {
      opacity: 0,
      y: config.y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: config.easing,
      },
    },
  };
};

// ==========================================
// VIEWPORT CONFIGURATION - PERFORMANCE
// ==========================================

export const VIEWPORT_CONFIG = {
  // Default viewport settings for scroll animations
  DEFAULT: {
    once: true, // Animate only once for performance
    amount: 0.1, // Trigger when 10% visible
    margin: "0px 0px -50px 0px", // Start slightly before entering viewport
  },
  
  // For elements that should animate early
  EAGER: {
    once: true,
    amount: 0.05,
    margin: "0px 0px -100px 0px",
  },
  
  // For elements that should wait until more visible
  PATIENT: {
    once: true,
    amount: 0.3,
    margin: "0px 0px 0px 0px",
  },
} as const;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Calculate staggered delay for manual animations
export const getStaggeredDelay = (
  index: number, 
  preset: keyof typeof ANIMATION_PRESETS,
  baseDelay: number = 0
): number => {
  return baseDelay + (index * ANIMATION_PRESETS[preset].stagger);
};

// Create transition object for manual animations
export const createTransition = (
  preset: keyof typeof ANIMATION_PRESETS,
  delay: number = 0
) => {
  const config = ANIMATION_PRESETS[preset];
  return {
    duration: config.duration,
    ease: config.easing,
    delay,
  };
};

// ==========================================
// ACCESSIBILITY & PERFORMANCE
// ==========================================

// Check if user prefers reduced motion
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Apply reduced motion fallback
export const getAccessibleVariants = (variants: any) => {
  if (shouldReduceMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.2 }
      },
    };
  }
  return variants;
};

// Performance optimization hints
export const PERFORMANCE_PROPS = {
  // GPU acceleration hint
  style: { willChange: 'transform, opacity' },
  
  // Layout optimization
  layout: false,
  
  // Reduce repaints
  layoutId: undefined,
} as const;