
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EmotionDetector from '../components/EmotionDetector';
import MusicPlayer from '../components/MusicPlayer';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Preload images if needed
  useEffect(() => {
    // This would be where you preload assets
    window.history.scrollRestoration = 'manual';
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      <Hero />
      <EmotionDetector />
      <MusicPlayer />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
