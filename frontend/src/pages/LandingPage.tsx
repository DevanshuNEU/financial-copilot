import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LiquidGlassSVG } from '@/components/ui/LiquidGlassSVG';
import { UnifiedFloatingNav } from '../components/navigation/UnifiedFloatingNav';
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Heart, 
  Smartphone, 
  TrendingUp,
  Users,
  Globe,
  Calculator,
  Sparkles,
  PieChart,
  BarChart3,
  Zap,
  Target,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Utensils
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Dashboard carousel state
  const [currentDashboard, setCurrentDashboard] = useState(0);
  
  // Auto-cycle through dashboard screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % 4);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  // Mock dashboard data
  const dashboardScreens = [
    {
      title: "Safe to Spend Today",
      mainValue: "$43.20",
      subtitle: "Based on your spending patterns",
      insight: "✨ You're 15% under budget this week!",
      chart: "spending",
      color: "green"
    },
    {
      title: "Monthly Overview",
      mainValue: "$1,247",
      subtitle: "Total spending this month",
      insight: "📊 Your best month yet - great job!",
      chart: "categories",
      color: "blue"
    },
    {
      title: "Smart Insights",
      mainValue: "23%",
      subtitle: "Money saved vs last month",
      insight: "🎯 You're building amazing habits!",
      chart: "trends",
      color: "purple"
    },
    {
      title: "Budget Health",
      mainValue: "Excellent",
      subtitle: "Overall financial wellness",
      insight: "🚀 You're on track to save $500 this month!",
      chart: "health",
      color: "emerald"
    }
  ];

  const categories = [
    { name: "Food", amount: 342, icon: Utensils, color: "bg-orange-500" },
    { name: "Transport", amount: 128, icon: Car, color: "bg-blue-500" },
    { name: "Coffee", amount: 89, icon: Coffee, color: "bg-amber-500" },
    { name: "Shopping", amount: 256, icon: ShoppingBag, color: "bg-purple-500" },
    { name: "Housing", amount: 680, icon: Home, color: "bg-green-500" },
  ];

  const features = [
    {
      icon: DollarSign,
      title: "Safe to Spend Calculator",
      description: "Know exactly how much you can spend today without going over budget"
    },
    {
      icon: Heart,
      title: "Guilt-Free Budgeting", 
      description: "Encouraging insights that empower, never restrict or shame"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Beautiful charts showing your financial progress and patterns"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Perfect for students who manage money on their phones"
    }
  ];

  const testimonials = [
    {
      quote: "Finally! A budgeting app that doesn't make me feel guilty about every purchase.",
      author: "Priya S.",
      role: "International Student, Boston University"
    },
    {
      quote: "The Safe to Spend feature changed everything. I actually know what I can afford now.",
      author: "Ahmed K.", 
      role: "Graduate Student, MIT"
    },
    {
      quote: "Clean design, encouraging messages. This feels like it was made for students like me.",
      author: "Sofia M.",
      role: "Exchange Student, Harvard"
    }
  ];

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

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center">
            {/* Removed international student badge - keeping it clean */}
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight"
            >
              Financial confidence
              <br />
              <span className="text-green-600">for every student</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Know exactly what you can spend today. Make every purchase with confidence, not guilt.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="glass-button-primary px-8 py-4 text-lg font-semibold rounded-lg liquid-transition hover:scale-105"
              >
                Start Your Financial Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="glass-button-secondary px-8 py-4 text-lg border-2 rounded-lg liquid-transition hover:scale-105"
              >
                Watch Demo
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
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
          </div>
        </div>
      </section>

      {/* Animated Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating Shapes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-white bg-opacity-10 rounded-full backdrop-blur-sm"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              Experience the future of
              <span className="text-green-600 block">student finance</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Watch how EXPENSESINK transforms anxiety into confidence with intelligent insights
            </motion.p>
          </div>
          
          {/* Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
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
                              {dashboardScreens[currentDashboard].title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {dashboardScreens[currentDashboard].subtitle}
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
                            {dashboardScreens[currentDashboard].mainValue}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block"
                          >
                            {dashboardScreens[currentDashboard].insight}
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
                              {categories.slice(0, 4).map((category, i) => (
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
              {dashboardScreens.map((_, index) => (
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-xl text-gray-600 mb-6">
                Transform your financial anxiety into confidence
              </p>
              <Button 
                onClick={handleGetStarted}
                className="glass-button-primary px-8 py-4 text-lg font-semibold rounded-lg liquid-transition hover:scale-105"
              >
                Get EXPENSESINK Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built specifically for students
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed with empathy for the international student experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 hover:border-green-200 transition-colors duration-200 hover:shadow-lg h-full">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by students worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of international students taking control of their finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join the financial awareness revolution. No guilt, no restrictions, just empowerment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="glass-button-primary px-8 py-4 text-lg font-semibold rounded-lg liquid-transition hover:scale-105"
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">Financial Copilot</span>
            </div>
            
            <div className="text-sm text-gray-500">
              💚 Made with love for international students
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
