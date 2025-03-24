
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-gold/20' : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-2xl font-semibold text-gold-gradient">
            EmotionTunes
          </span>
        </motion.div>
        
        <nav className="hidden md:flex space-x-8">
          {['Home', 'Features', 'How It Works', 'About'].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-gold hover:text-gold-light transition duration-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Sign In Button */}
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              scrolled 
                ? 'text-gold border border-gold/50 hover:bg-gold/10' 
                : 'text-gold border border-gold/30 hover:bg-gold/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Sign In clicked')}
          >
            Sign In
          </motion.button>
          
          {/* Sign Up Button */}
          <motion.button
            className="px-4 py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-black text-sm font-medium transition-all hover:shadow-lg hover:shadow-gold/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Sign Up clicked')}
          >
            Sign Up
          </motion.button>
          
          {/* Get Started Button */}
          <motion.button 
            className="px-6 py-2 rounded-full bg-gold text-black text-sm font-medium transition-all hover:bg-gold-light hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Navbar;
