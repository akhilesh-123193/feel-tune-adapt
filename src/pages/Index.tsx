
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import EmotionDetector from '../components/EmotionDetector';
import AnimatedBackground from '../components/AnimatedBackground';
import FeedbackBox from '../components/FeedbackBox';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <AnimatedBackground />
      <Hero />
      <EmotionDetector />
      <FeedbackBox />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
