
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
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      <AnimatedBackground />
      
      <div className="container px-6 py-10 mx-auto flex flex-col lg:flex-row items-center">
        <motion.div 
          className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:pr-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="px-4 py-1.5 rounded-full text-xs bg-black-light text-gold font-semibold mb-6 border border-gold/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            REVOLUTIONARY AI MUSIC EXPERIENCE
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Music that adapts to your 
            <span className="text-gold-gradient"> emotions</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gold-muted mb-8 max-w-lg"
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
            <button className="px-8 py-3 rounded-full bg-gold text-black font-medium hover:bg-gold-dark transition-all hover:shadow-lg">
              Try Now
            </button>
            <button className="px-8 py-3 rounded-full border border-gold/50 text-gold hover:bg-black-light transition-all">
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
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full glass-card flex items-center justify-center relative overflow-hidden shadow-2xl border border-gold/30">
              {/* Album artwork */}
              <div className="w-60 h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark rotate-cover">
                <div className="w-full h-full rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-md border border-gold/50">
                    <div className="w-6 h-6 rounded-full bg-gold"></div>
                  </div>
                </div>
              </div>
              
              {/* Audio visualization */}
              <div ref={audioRef} className="absolute bottom-4 left-0 right-0 flex items-end justify-center h-10 px-8">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="wave-bars h-4 w-2 mx-0.5 rounded-sm bg-gold-light"></div>
                ))}
              </div>
            </div>
            
            {/* Floating emotion bubbles */}
            <motion.div 
              className="emotion-bubble w-14 h-14 absolute -top-4 -right-2 bg-gold/80"
              animate={{ 
                y: [-10, 0, -10],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xl">😊</span>
            </motion.div>
            
            <motion.div 
              className="emotion-bubble w-12 h-12 absolute top-20 -left-6 bg-gold-dark/80"
              animate={{ 
                y: [-8, 5, -8],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 3.5, delay: 0.5, repeat: Infinity }}
            >
              <span className="text-lg">😌</span>
            </motion.div>
            
            <motion.div 
              className="emotion-bubble w-10 h-10 absolute bottom-20 -left-4 bg-gold-light/80"
              animate={{ 
                y: [5, -5, 5],
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
            >
              <span className="text-base">😢</span>
            </motion.div>
            
            <motion.div 
              className="emotion-bubble w-11 h-11 absolute bottom-10 -right-2 bg-gold-muted"
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
          className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-gold rounded-full mt-2"
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
