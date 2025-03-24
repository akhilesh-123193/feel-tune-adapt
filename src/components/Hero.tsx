
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

const Hero = () => {
  const audioRef = useRef<HTMLDivElement>(null);

  // Animate audio waves
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        const bars = audioRef.current.querySelectorAll('.wave-bars');
        bars.forEach(bar => {
          const height = Math.floor(Math.random() * 30) + 5;
          (bar as HTMLElement).style.height = `${height}px`;
        });
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <AnimatedBackground />
      
      <div className="container px-6 py-10 mx-auto flex flex-col lg:flex-row items-center">
        <motion.div 
          className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:pr-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="px-4 py-1.5 rounded-full text-xs bg-blue-50 text-primary font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            REVOLUTIONARY AI MUSIC EXPERIENCE
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Music that adapts to your 
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> emotions</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            EmotionTunes uses AI to detect your emotional state and curate music that resonates with how you feel, creating a deeply personalized listening experience.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <button className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
              Try Now
            </button>
            <button className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-all">
              Learn More
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="lg:w-1/2 mt-16 lg:mt-0 z-10 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="relative">
            {/* Circular music player mockup */}
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full glass-card flex items-center justify-center relative overflow-hidden shadow-2xl">
              {/* Album artwork */}
              <div className="w-60 h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-emotion-joy via-emotion-calm to-emotion-sadness rotate-cover">
                <div className="w-full h-full rounded-full flex items-center justify-center bg-black/10 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
              
              {/* Audio visualization */}
              <div ref={audioRef} className="absolute bottom-4 left-0 right-0 flex items-end justify-center h-10 px-8">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="wave-bars h-4"></div>
                ))}
              </div>
            </div>
            
            {/* Floating emotion bubbles */}
            <motion.div 
              className="emotion-bubble w-14 h-14 absolute -top-4 -right-2 bg-emotion-joy"
              animate={{ 
                y: [-10, 0, -10],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xl">😊</span>
            </motion.div>
            
            <motion.div 
              className="emotion-bubble w-12 h-12 absolute top-20 -left-6 bg-emotion-calm"
              animate={{ 
                y: [-8, 5, -8],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 3.5, delay: 0.5, repeat: Infinity }}
            >
              <span className="text-lg">😌</span>
            </motion.div>
            
            <motion.div 
              className="emotion-bubble w-10 h-10 absolute bottom-20 -left-4 bg-emotion-sadness"
              animate={{ 
                y: [5, -5, 5],
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
            >
              <span className="text-base">😢</span>
            </motion.div>
            
            <motion.div 
              className="emotion-bubble w-11 h-11 absolute bottom-10 -right-2 bg-emotion-anger"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.04, 1],
              }}
              transition={{ duration: 3.2, delay: 1.5, repeat: Infinity }}
            >
              <span className="text-lg">😠</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-gray-300 rounded-full mt-2"
            animate={{ 
              height: [8, 16, 8],
              y: [0, 10, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
