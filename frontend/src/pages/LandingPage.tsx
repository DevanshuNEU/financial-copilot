import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LiquidGlassSVG } from '@/components/ui/LiquidGlassSVG';
import { UnifiedFloatingNav } from '../components/navigation/UnifiedFloatingNav';
import ExpenseSinkLogo from '../components/branding/ExpenseSinkLogo';
import AnimationErrorBoundary from '../components/ui/AnimationErrorBoundary';
import { 
  ArrowRight, 
  CheckCircle, 
  Users,
  Sparkles,
  Lightbulb
} from 'lucide-react';

// Import our LEGENDARY animation system
import { 
  createAnimationVariants,
  createStaggeredVariants,
  createChildVariants,
  createTransition,
  getStaggeredDelay,
  VIEWPORT_CONFIG,
  PERFORMANCE_PROPS,
  getAccessibleVariants,
} from '../lib/animations';

// Import clean data
import { 
  featuresData, 
  testimonialsData, 
  trustIndicatorsData,
  dashboardScreensData, 
  categoriesData 
} from '../data';

// Create animation variants for different sections
const heroVariants = getAccessibleVariants(createAnimationVariants('HERO'));
const primaryVariants = getAccessibleVariants(createAnimationVariants('PRIMARY'));
const secondaryVariants = getAccessibleVariants(createAnimationVariants('SECONDARY'));
const subtleVariants = getAccessibleVariants(createAnimationVariants('SUBTLE'));

// Staggered variants for grid layouts
const staggeredPrimary = getAccessibleVariants(createStaggeredVariants('PRIMARY'));
const staggeredSecondary = getAccessibleVariants(createStaggeredVariants('SECONDARY'));
const childPrimary = getAccessibleVariants(createChildVariants('PRIMARY'));
const childSecondary = getAccessibleVariants(createChildVariants('SECONDARY'));

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Dashboard carousel state
  const [currentDashboard, setCurrentDashboard] = useState(0);
  
  // Auto-cycle through dashboard screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % dashboardScreensData.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* SVG Filters for Liquid Glass Effects */}
      <LiquidGlassSVG />
      
      {/* Unified Floating Navigation */}
      <UnifiedFloatingNav 
        mode="public" 
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
      />

      {/* Hero Section - Keep as is, user loves it */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center">
            {/* Removed international student badge - keeping it clean */}
            
            <AnimationErrorBoundary>
              <motion.h1 
                initial="hidden"
                animate="visible"
                variants={heroVariants}
                transition={createTransition('HERO', 0.1)}
                {...PERFORMANCE_PROPS}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight font-heading"
              >
                Financial confidence
                <br />
                <span className="text-green-600">for every student</span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={heroVariants}
                transition={createTransition('HERO', 0.3)}
                {...PERFORMANCE_PROPS}
                className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light font-body"
              >
                Know exactly what you can spend today. Make every purchase with confidence, not guilt.
              </motion.p>

              <motion.div 
                initial="hidden"
                animate="visible"
                variants={heroVariants}
                transition={createTransition('HERO', 0.5)}
                {...PERFORMANCE_PROPS}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              >
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="glass-button-primary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  Start Your Financial Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass-button-secondary px-8 py-4 text-lg border-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Watch Demo
              </Button>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={subtleVariants}
              transition={createTransition('SUBTLE', 0.7)}
              {...PERFORMANCE_PROPS}
              className="flex items-center justify-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Always Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">2-Minute Setup</span>
              </div>
            </motion.div>
            </AnimationErrorBoundary>
          </div>
        </div>
      </section>

      {/* Animated Demo Section - Professional & Elegant */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Sophisticated Background - Subtle and Professional */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
          {/* Removed excessive animated background - keeping it elegant */}
          <div className="absolute inset-0 opacity-[0.01]" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)
            `,
          }} />
          
          {/* Subtle Geometric Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(180deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              variants={primaryVariants}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-heading"
            >
              Experience the future of
              <span className="text-green-600 block">student finance</span>
            </motion.h2>
            <motion.p 
              initial="hidden"
              whileInView="visible"
              variants={primaryVariants}
              transition={createTransition('PRIMARY', 0.15)}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-body"
            >
              Watch how EXPENSESINK transforms anxiety into confidence with intelligent insights
            </motion.p>
          </div>
          
          {/* Dashboard Mockup */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={primaryVariants}
            transition={createTransition('PRIMARY', 0.3)}
            viewport={VIEWPORT_CONFIG.DEFAULT}
            {...PERFORMANCE_PROPS}
            className="relative max-w-4xl mx-auto"
          >
            {/* Phone Frame */}
            <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="bg-black rounded-[2.5rem] p-1">
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner">
                  {/* Status Bar */}
                  <div className="bg-gray-50 px-6 py-2 flex justify-between items-center text-sm">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      <div className="w-6 h-3 border border-gray-400 rounded-sm">
                        <div className="w-4 h-full bg-green-500 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 h-[500px] bg-gradient-to-br from-gray-50 to-white">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDashboard}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                      >
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {dashboardScreensData[currentDashboard].title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {dashboardScreensData[currentDashboard].subtitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            <span className="text-xs text-gray-500">AI</span>
                          </div>
                        </div>
                        
                        {/* Main Value */}
                        <div className="text-center mb-6">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl font-bold text-gray-900 mb-2"
                          >
                            {dashboardScreensData[currentDashboard].mainValue}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block"
                          >
                            {dashboardScreensData[currentDashboard].insight}
                          </motion.div>
                        </div>
                        
                        {/* Animated Chart Area */}
                        <div className="space-y-4">
                          {currentDashboard === 0 && (
                            // Safe to Spend Chart
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Daily Budget</span>
                                <motion.div
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"
                                >
                                  <motion.div
                                    className="h-full bg-green-500"
                                    animate={{ width: ["0%", "73%"] }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                  />
                                </motion.div>
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {[...Array(7)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: Math.random() * 40 + 20 }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="bg-green-200 rounded-t-sm"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {currentDashboard === 1 && (
                            // Categories Chart
                            <div className="space-y-3">
                              {categoriesData.slice(0, 4).map((category, i) => (
                                <motion.div
                                  key={category.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                                      <category.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        className={`h-full ${category.color}`}
                                        animate={{ width: ["0%", `${(category.amount / 8) * 10}%`] }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                      />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">${category.amount}</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          
                          {currentDashboard === 2 && (
                            // Trends Chart
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    className="h-full bg-purple-500"
                                    animate={{ width: ["0%", "76%"] }}
                                    transition={{ duration: 1.5, delay: 0.3 }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Savings Goal</span>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="bg-purple-100 rounded-lg p-3 text-center"
                                  >
                                    <div className="text-lg font-bold text-purple-700">
                                      ${(Math.random() * 100 + 50).toFixed(0)}
                                    </div>
                                    <div className="text-xs text-purple-600">Week {i + 1}</div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {currentDashboard === 3 && (
                            // Health Score
                            <div className="text-center space-y-4">
                              <div className="relative w-32 h-32 mx-auto">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="rgb(229, 231, 235)"
                                    strokeWidth="8"
                                    fill="none"
                                  />
                                  <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="rgb(16, 185, 129)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0 251" }}
                                    animate={{ strokeDasharray: "201 251" }}
                                    transition={{ duration: 2, delay: 0.5 }}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">85%</div>
                                    <div className="text-xs text-gray-600">Health</div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-lg p-3">
                                  <div className="text-sm font-medium text-green-800">Budget</div>
                                  <div className="text-lg font-bold text-green-600">92%</div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <div className="text-sm font-medium text-blue-800">Savings</div>
                                  <div className="text-lg font-bold text-blue-600">78%</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {dashboardScreensData.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                    index === currentDashboard ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentDashboard(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            
            {/* CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={subtleVariants}
              transition={createTransition('SUBTLE', 0.8)}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="text-center mt-12"
            >
              <p className="text-xl text-gray-600 mb-6">
                Transform your financial anxiety into confidence
              </p>
              {/* Removed "Get EXPENSESINK Free" button - felt out of place */}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Features Section - Tesla/Apple Level */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50/50 to-green-50/30 relative overflow-hidden">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.4) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 40%),
                radial-gradient(circle at 40% 60%, rgba(34, 197, 94, 0.2) 0%, transparent 40%)
              `,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={subtleVariants}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="mb-4"
            >
              {/* Removed "Revolutionary Features" badge - felt odd */}
            </motion.div>
            
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              variants={primaryVariants}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading leading-tight"
            >
              Built for students,
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                loved by thousands
              </span>
            </motion.h2>
            
            <motion.p
              initial="hidden"
              whileInView="visible"
              variants={primaryVariants}
              transition={createTransition('PRIMARY', 0.15)}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-body"
            >
              Every feature designed with empathy for your student journey. Transform financial stress into confidence.
            </motion.p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggeredPrimary}
            viewport={VIEWPORT_CONFIG.DEFAULT}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
          >
            {featuresData.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={childPrimary}
                  {...PERFORMANCE_PROPS}
                  className="group"
                >
                  <Card className={`border-2 border-gray-200 ${feature.hoverColor} transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 h-full group-hover:scale-[1.02] bg-white/90 backdrop-blur-sm`}>
                    <CardContent className="p-6">
                      {/* Animated Icon with Spring Physics */}
                      <motion.div 
                        className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto mb-6 shadow-lg`}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 2,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 17,
                          mass: 0.8
                        }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      {/* Feature Content */}
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading group-hover:text-emerald-700 transition-colors">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-600 text-base leading-relaxed mb-4 font-body">
                          {feature.description}
                        </p>
                        
                        {/* Benefit Highlight */}
                        <motion.div
                          className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100"
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={createTransition('SUBTLE', index * 0.05 + 0.3)}
                          viewport={VIEWPORT_CONFIG.DEFAULT}
                        >
                          <div className="flex items-center justify-center gap-2 text-emerald-700">
                            <Lightbulb className="w-4 h-4" />
                            <span className="text-sm font-semibold">{feature.benefit}</span>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Hover Effect Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        initial={false}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Call-to-Action */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={primaryVariants}
            viewport={VIEWPORT_CONFIG.DEFAULT}
            {...PERFORMANCE_PROPS}
            className="text-center mt-16"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="glass-button-primary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              Experience EXPENSESINK Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Social Proof Section - More Compact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Trust Indicators */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={primaryVariants}
            viewport={VIEWPORT_CONFIG.DEFAULT}
            {...PERFORMANCE_PROPS}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-8 font-heading">
              Trusted by students
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
            
            {/* Professional Trust Indicators - Classy Layout */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={staggeredSecondary}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {trustIndicatorsData.map((indicator, index) => {
                const IconComponent = indicator.icon;
                return (
                  <motion.div
                    key={indicator.id}
                    variants={childSecondary}
                    {...PERFORMANCE_PROPS}
                    className="group"
                  >
                    <Card className="border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 bg-white/90 backdrop-blur-sm hover-lift">
                      <CardContent className="p-8 text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl mx-auto mb-6 shadow-lg">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        
                        <div className="text-3xl font-bold text-gray-900 mb-2 font-heading">
                          {indicator.value}
                        </div>
                        
                        <div className="text-lg font-semibold text-emerald-600 mb-3 font-body">
                          {indicator.label}
                        </div>
                        
                        <div className="text-sm text-gray-600 leading-relaxed font-body">
                          {indicator.description}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Enhanced Testimonials */}
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={subtleVariants}
              viewport={VIEWPORT_CONFIG.DEFAULT}
              {...PERFORMANCE_PROPS}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold tracking-wide uppercase">
                <Users className="w-4 h-4 mr-2" />
                Student Stories
              </span>
            </motion.div>
            
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-heading">
              Real students, real results
            </h3>
            <p className="text-xl text-gray-600 font-body">
              Join thousands of students who transformed their financial anxiety into confidence
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggeredSecondary}
            viewport={VIEWPORT_CONFIG.DEFAULT}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonialsData.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={childSecondary}
                {...PERFORMANCE_PROPS}
                className="group"
              >
                <Card className="border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 h-full bg-white/90 backdrop-blur-sm group-hover:scale-[1.02]">
                  <CardContent className="p-6">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={createTransition('SUBTLE', index * 0.05 + i * 0.02)}
                          viewport={VIEWPORT_CONFIG.DEFAULT}
                        />
                      ))}
                      {testimonial.verified && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={createTransition('SUBTLE', index * 0.05 + 0.3)}
                          viewport={VIEWPORT_CONFIG.DEFAULT}
                          className="ml-2 flex items-center text-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Verified</span>
                        </motion.div>
                      )}
                    </div>
                    
                    <blockquote className="text-gray-900 mb-4 italic font-body leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="font-semibold text-gray-900 font-heading">{testimonial.author}</div>
                      <div className="text-sm text-gray-600 font-body">{testimonial.role}</div>
                      {testimonial.university && (
                        <div className="text-xs text-emerald-600 font-semibold mt-1">
                          {testimonial.university}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-heading">
              Loved by students worldwide
            </h2>
            <p className="text-xl text-gray-600 font-body">
              Join thousands of international students taking control of their finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-gray-100 hover:border-green-200 transition-colors duration-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="w-4 h-4 bg-green-400 rounded-full"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                          viewport={{ once: true }}
                        ></motion.div>
                      ))}
                    </div>
                    <blockquote className="text-gray-900 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      {testimonial.university && (
                        <div className="text-xs text-emerald-600 font-medium">{testimonial.university}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 font-heading">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed font-body">
            Join the financial awareness revolution. No guilt, no restrictions, just empowerment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="glass-button-primary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-green-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>1,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <ExpenseSinkLogo variant="white" size="md" animated={false} />
            
            <div className="text-sm text-gray-400 font-body">
              💚 Made with love for students worldwide
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
