
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const emotions = [
  { id: 'joy', name: 'Joy', color: 'bg-emotion-joy', textColor: 'text-black', emoji: '😊', percentage: 65 },
  { id: 'calm', name: 'Calm', color: 'bg-emotion-calm', textColor: 'text-black', emoji: '😌', percentage: 20 },
  { id: 'sadness', name: 'Sadness', color: 'bg-emotion-sadness', textColor: 'text-white', emoji: '😢', percentage: 10 },
  { id: 'anger', name: 'Anger', color: 'bg-emotion-anger', textColor: 'text-white', emoji: '😠', percentage: 5 },
];

const EmotionDetector = () => {
  const [activeEmotion, setActiveEmotion] = useState(emotions[0]);
  const [scanning, setScanning] = useState(false);
  
  // Simulate emotion scanning
  const handleScan = () => {
    setScanning(true);
    
    // Simulate the scanning process
    setTimeout(() => {
      setScanning(false);
      // Randomly select a new emotion
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setActiveEmotion(randomEmotion);
    }, 3000);
  };
  
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Emotional Intelligence Meets Music
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Our AI detects your emotional state through facial expressions, voice patterns, and wearable data to create the perfect soundtrack for your mood.
          </motion.p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-dashed border-gray-200 animate-rotate-slow opacity-30"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center ${scanning ? 'bg-gray-100' : activeEmotion.color} transition-colors duration-500`}>
                  {scanning ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-sm font-medium">Scanning emotions...</p>
                    </div>
                  ) : (
                    <span className="text-6xl md:text-7xl">{activeEmotion.emoji}</span>
                  )}
                </div>
              </div>
              
              {/* Emotion indicators */}
              {emotions.map((emotion, index) => {
                const isActive = activeEmotion.id === emotion.id;
                const angle = (index * 90) - 45;
                const radians = angle * (Math.PI / 180);
                const radius = 150;
                const x = radius * Math.cos(radians);
                const y = radius * Math.sin(radians);
                
                return (
                  <motion.div 
                    key={emotion.id}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center ${emotion.color} ${emotion.textColor} shadow-lg transition-all duration-300`}
                    style={{ 
                      left: `calc(50% + ${x}px - 2rem)`, 
                      top: `calc(50% + ${y}px - 2rem)`,
                      scale: isActive ? 1.2 : 1,
                      zIndex: isActive ? 10 : 5,
                    }}
                    animate={{ scale: isActive ? [1, 1.2, 1.1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl">{emotion.emoji}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="glass-card rounded-3xl p-8 max-w-lg mx-auto">
              <h3 className="text-2xl font-semibold mb-6">Emotion Analysis</h3>
              
              <div className="space-y-6 mb-8">
                {emotions.map((emotion) => {
                  const isActive = activeEmotion.id === emotion.id;
                  
                  return (
                    <div key={emotion.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                          {emotion.name}
                        </span>
                        <span className={`${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {emotion.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${emotion.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${emotion.percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col space-y-4">
                <h4 className="font-medium">Personalized Recommendation</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your current emotional state, we recommend {activeEmotion.id === 'joy' ? 'upbeat and energetic' : activeEmotion.id === 'calm' ? 'soothing and relaxing' : activeEmotion.id === 'sadness' ? 'comforting and uplifting' : 'focusing and stress-relieving'} music.
                </p>
                
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className={`w-full py-3 rounded-full ${scanning ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'} font-medium transition-all hover:bg-primary/90`}
                >
                  {scanning ? 'Scanning...' : 'Scan Emotions Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmotionDetector;
