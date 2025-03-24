
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Emotion Detection',
    description: 'Our AI analyzes facial expressions, voice patterns, and biometric data from wearables to determine your emotional state.',
    color: 'bg-emotion-joy'
  },
  {
    number: '02',
    title: 'Music Analysis',
    description: 'EmotionTunes maps detected emotions to musical attributes like tempo, key, and instrumentation.',
    color: 'bg-emotion-calm'
  },
  {
    number: '03',
    title: 'Playlist Generation',
    description: 'Based on your current emotional state, we create a personalized playlist from your favorite music services.',
    color: 'bg-emotion-sadness'
  },
  {
    number: '04',
    title: 'Continuous Learning',
    description: 'The system learns from your preferences over time, making increasingly accurate recommendations.',
    color: 'bg-emotion-anger'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            className="px-4 py-1.5 rounded-full text-xs bg-blue-50 text-primary font-semibold mb-4 inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            THE PROCESS
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How EmotionTunes Works
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A seamless process that transforms your emotional state into the perfect soundtrack.
          </motion.p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-0 bottom-0 left-[28px] md:left-1/2 md:-ml-0.5 w-1 bg-gray-100 z-0"></div>
          
          {/* Steps */}
          <div className="relative z-10 space-y-12">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row items-start gap-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`relative flex-shrink-0 ${index % 2 === 0 ? 'md:order-1' : 'md:order-1'}`}>
                  <div className={`w-14 h-14 rounded-full ${step.color} shadow-lg flex items-center justify-center text-white font-bold z-10`}>
                    {step.number}
                  </div>
                </div>
                
                <div className={`glass-card rounded-2xl p-6 md:p-8 md:w-[calc(50%-3rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
