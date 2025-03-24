
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  emotion: 'joy' | 'sadness' | 'anger' | 'calm' | 'neutral';
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  
  const songs: Song[] = [
    { 
      id: 1, 
      title: "Euphoria Waves", 
      artist: "Ambient Collective", 
      cover: "linear-gradient(to right, #FFD166, #FFB347)", 
      emotion: "joy" 
    },
    { 
      id: 2, 
      title: "Tranquil Mind", 
      artist: "Serenity", 
      cover: "linear-gradient(to right, #06D6A0, #1A936F)", 
      emotion: "calm" 
    },
    { 
      id: 3, 
      title: "Melancholy Echo", 
      artist: "Oceanic Pulse", 
      cover: "linear-gradient(to right, #118AB2, #073B4C)", 
      emotion: "sadness" 
    },
    { 
      id: 4, 
      title: "Tension Release", 
      artist: "Dynamic Flux", 
      cover: "linear-gradient(to right, #EF476F, #C70039)", 
      emotion: "anger" 
    },
  ];
  
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % songs.length);
  };
  
  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length);
  };
  
  const current = songs[currentTrack];
  
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Personalized Music Experience
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            EmotionTunes creates the perfect soundtrack to complement or transform your emotional state.
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <motion.div 
              className="md:w-1/2 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square w-full max-w-xs">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full rounded-2xl shadow-xl"
                    style={{ 
                      background: current.cover,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg ${isPlaying ? 'scale-90' : 'scale-100'} transition-all duration-300`}>
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                          <button onClick={handlePlayToggle} className="focus:outline-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {isPlaying ? (
                                <rect x="6" y="5" width="4" height="14" rx="1" fill="#333" />
                              ) : (
                                <path d="M8 5.14v13.72a.5.5 0 0 0 .75.43l11.52-6.86a.5.5 0 0 0 0-.86L8.75 4.71a.5.5 0 0 0-.75.43z" fill="#333" />
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gloss effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                    
                    {/* Emotion tag */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                      current.emotion === 'joy' ? 'bg-emotion-joy/80 text-black' : 
                      current.emotion === 'calm' ? 'bg-emotion-calm/80 text-black' :
                      current.emotion === 'sadness' ? 'bg-emotion-sadness/80 text-white' :
                      'bg-emotion-anger/80 text-white'
                    }`}>
                      {current.emotion.charAt(0).toUpperCase() + current.emotion.slice(1)}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Audio wave animation */}
                {isPlaying && (
                  <div className="absolute bottom-4 left-0 right-0 flex items-end justify-center h-8">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="wave-bars h-4"></div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold mb-2">{current.title}</h3>
                      <p className="text-muted-foreground mb-6">{current.artist}</p>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="mb-6">
                    <div className="relative">
                      <div className="h-1 bg-gray-200 rounded-full w-full">
                        <div className="h-1 bg-primary rounded-full" style={{ width: '35%' }}></div>
                        <div className="absolute w-3 h-3 bg-primary rounded-full -mt-1" style={{ left: '35%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>1:24</span>
                        <span>3:45</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-8 mb-8">
                    <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 20L9 12l10-8v16z" fill="currentColor" />
                        <rect x="5" y="4" width="2" height="16" fill="currentColor" />
                      </svg>
                    </button>
                    
                    <button onClick={handlePlayToggle} className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="8" y="6" width="3" height="12" rx="1" fill="currentColor" />
                          <rect x="14" y="6" width="3" height="12" rx="1" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5v14l11-7z" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                    
                    <button onClick={handleNext} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4l10 8-10 8V4z" fill="currentColor" />
                        <rect x="17" y="4" width="2" height="16" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Emotional Analysis</h4>
                  <div className="flex space-x-2 mb-4">
                    {['joy', 'calm', 'sadness', 'anger'].map((emotion) => (
                      <div 
                        key={emotion} 
                        className={`flex-1 h-1 rounded-full ${
                          emotion === 'joy' ? 'bg-emotion-joy' : 
                          emotion === 'calm' ? 'bg-emotion-calm' :
                          emotion === 'sadness' ? 'bg-emotion-sadness' :
                          'bg-emotion-anger'
                        } ${current.emotion === emotion ? 'opacity-100' : 'opacity-30'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {current.emotion === 'joy' 
                      ? 'This upbeat track matches your joyful mood, enhancing your positive energy.' 
                      : current.emotion === 'calm' 
                      ? 'A soothing melody to maintain your tranquil state and reduce stress.'
                      : current.emotion === 'sadness'
                      ? 'This reflective piece acknowledges your feelings while gently lifting your mood.'
                      : 'A focused rhythm to channel and transform tension into productive energy.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayer;
