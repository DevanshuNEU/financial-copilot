import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, ArrowDown, MousePointer2 } from 'lucide-react';

interface FloatingHint {
  id: string;
  content: string;
  position: { x: number; y: number };
  trigger: 'scroll' | 'hover' | 'time';
  delay?: number;
  duration?: number;
}

const defaultHints: FloatingHint[] = [
  {
    id: 'demo-interaction',
    content: 'Click the phone to explore features!',
    position: { x: 50, y: 40 },
    trigger: 'time',
    delay: 3000,
    duration: 5000
  },
  {
    id: 'scroll-cta',
    content: 'Scroll down to see how EXPENSESINK works',
    position: { x: 50, y: 85 },
    trigger: 'time',
    delay: 5000,
    duration: 4000
  },
  {
    id: 'feature-hover',
    content: 'Hover over cards for interactive demos',
    position: { x: 50, y: 60 },
    trigger: 'scroll',
    delay: 1000,
    duration: 4000
  }
];

export const FloatingActionHints: React.FC = () => {
  const [activeHints, setActiveHints] = useState<string[]>([]);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Time-based hints
    defaultHints
      .filter(hint => hint.trigger === 'time')
      .forEach(hint => {
        setTimeout(() => {
          if (!dismissedHints.includes(hint.id)) {
            setActiveHints(prev => [...prev, hint.id]);
            
            // Auto-dismiss after duration
            if (hint.duration) {
              setTimeout(() => {
                setActiveHints(prev => prev.filter(id => id !== hint.id));
              }, hint.duration);
            }
          }
        }, hint.delay || 0);
      });
  }, [dismissedHints]);

  useEffect(() => {
    // Scroll-based hints
    const scrollHints = defaultHints.filter(hint => hint.trigger === 'scroll');
    
    scrollHints.forEach(hint => {
      if (scrollProgress > 20 && scrollProgress < 80 && !dismissedHints.includes(hint.id)) {
        setTimeout(() => {
          setActiveHints(prev => [...prev, hint.id]);
          
          if (hint.duration) {
            setTimeout(() => {
              setActiveHints(prev => prev.filter(id => id !== hint.id));
            }, hint.duration);
          }
        }, hint.delay || 0);
      }
    });
  }, [scrollProgress, dismissedHints]);

  const dismissHint = (hintId: string) => {
    setActiveHints(prev => prev.filter(id => id !== hintId));
    setDismissedHints(prev => [...prev, hintId]);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {defaultHints
          .filter(hint => activeHints.includes(hint.id))
          .map(hint => (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute pointer-events-auto"
              style={{
                left: `${hint.position.x}%`,
                top: `${hint.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl max-w-xs relative">
                {/* Animated Icons */}
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {hint.id === 'demo-interaction' && <MousePointer2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                    {hint.id === 'scroll-cta' && <ArrowDown className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                    {hint.id === 'feature-hover' && <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />}
                  </motion.div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed">
                      {hint.content}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => dismissHint(hint.id)}
                    className="text-gray-400 hover:text-white transition-colors p-0.5 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Animated Pointer */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-900"></div>
                </div>

                {/* Pulse Effect */}
                <motion.div
                  className="absolute inset-0 bg-emerald-500/20 rounded-xl"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ))
        }
      </AnimatePresence>
    </div>
  );
};