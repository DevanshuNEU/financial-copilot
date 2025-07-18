import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Lightbulb, Play, ChevronRight, Sparkles } from 'lucide-react';

interface InteractiveFeatureCardProps {
  feature: {
    title: string;
    description: string;
    benefit: string;
    icon: React.ComponentType<any>;
    color: string;
    hoverColor: string;
    demoContent?: {
      title: string;
      description: string;
      visual: React.ReactNode;
    };
  };
  index: number;
}

export const InteractiveFeatureCard: React.FC<InteractiveFeatureCardProps> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const IconComponent = feature.icon;

  const handleShowDemo = () => {
    setShowDemo(true);
    // Auto-hide demo after 5 seconds
    setTimeout(() => setShowDemo(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`border-2 border-gray-200 ${feature.hoverColor} transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 h-full bg-white/95 backdrop-blur-sm overflow-hidden`}>
        <CardContent className="p-6 relative">
          {/* Animated Background Particles */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                    initial={{ 
                      opacity: 0, 
                      scale: 0,
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%'
                    }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0],
                      y: [Math.random() * 100 + '%', Math.random() * 50 + '%']
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Icon with Advanced Animations */}
          <motion.div 
            className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto mb-6 shadow-lg relative overflow-hidden`}
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, -5, 5, 0],
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 17,
              mass: 0.8
            }}
          >
            {/* Sparkle Effect on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-1 right-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              )}
            </AnimatePresence>

            <IconComponent className="h-8 w-8 text-white relative z-10" />

            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 bg-white rounded-2xl"
              initial={{ scale: 0, opacity: 0.3 }}
              animate={isHovered ? { scale: 1.2, opacity: 0 } : { scale: 0, opacity: 0.3 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
          
          {/* Feature Content with Enhanced Typography */}
          <div className="text-center relative z-10">
            <motion.h3 
              className="text-2xl font-bold text-gray-900 mb-3 font-heading group-hover:text-emerald-700 transition-colors duration-300"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {feature.title}
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 text-base leading-relaxed mb-6 font-body"
              animate={isHovered ? { y: -2 } : { y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {feature.description}
            </motion.p>
            
            {/* Enhanced Benefit Highlight */}
            <motion.div
              className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-semibold">{feature.benefit}</span>
              </div>
            </motion.div>

            {/* Interactive Demo Button */}
            {feature.demoContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
                viewport={{ once: true }}
              >
                <Button
                  onClick={handleShowDemo}
                  variant="outline"
                  size="sm"
                  className="group/btn bg-white/80 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                >
                  <Play className="w-3 h-3 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Quick Demo
                  <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </CardContent>
      </Card>

      {/* Demo Overlay */}
      <AnimatePresence>
        {showDemo && feature.demoContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-lg border-2 border-emerald-200 shadow-2xl flex items-center justify-center p-6"
          >
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.demoContent.title}</h4>
              <p className="text-gray-600 mb-4">{feature.demoContent.description}</p>
              {feature.demoContent.visual}
              
              <Button
                onClick={() => setShowDemo(false)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Close Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};