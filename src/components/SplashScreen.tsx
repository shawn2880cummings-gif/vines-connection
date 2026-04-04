"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if user has already entered in this session
  useEffect(() => {
    const hasEntered = sessionStorage.getItem("vines-entered");
    if (hasEntered === "true") {
      setIsVisible(false);
      // We still need to call onEnter if the music should play, 
      // but browsers might block it without a fresh gesture.
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("vines-entered", "true");
    setIsVisible(false);
    onEnter(); // This call will carry the user gesture to trigger audio
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0b] text-white"
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              filter: [
                "drop-shadow(0 0 10px rgba(255,215,0,0.2))",
                "drop-shadow(0 0 25px rgba(255,215,0,0.5))",
                "drop-shadow(0 0 10px rgba(255,215,0,0.2))"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative mb-12 h-48 w-48 md:h-64 md:w-64"
          >
            <div className="absolute inset-0 rounded-full bg-psyche-gold/10 blur-3xl opacity-50" />
            <Image
              src="/vines-logo.jpg"
              alt="VINE Logo"
              fill
              className="rounded-full object-cover shadow-2xl border border-white/10"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="mb-8 text-2xl font-light tracking-[0.3em] text-white/80 md:text-3xl">
              VINES CONNECTION
            </h1>
            
            <button
              onClick={handleEnter}
              className="group relative overflow-hidden rounded-full border border-white/20 bg-white/5 px-12 py-4 text-sm font-medium tracking-widest text-white transition-all hover:border-white/40 hover:bg-white/10 active:scale-95"
            >
              <span className="relative z-10">ENTER EXPERIENCE</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </motion.div>

          <footer className="absolute bottom-12 text-[10px] tracking-[0.2em] text-white/30 uppercase">
            Shawn Cummings &copy; {new Date().getFullYear()}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
