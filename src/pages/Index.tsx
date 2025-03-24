import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import EmotionDetector from '../components/EmotionDetector';
import AnimatedBackground from '../components/AnimatedBackground';

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Hero />
      <EmotionDetector />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
