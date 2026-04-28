"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LeadMagnet = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true);

    // Simulate API request to MailerLite / ConvertKit placeholder
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto my-24 p-1">
      {/* Glowing border container */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-psyche-violet/40 via-psyche-gold/20 to-psyche-teal/40 opacity-50 blur-md pointer-events-none" />
      
      <div className="relative z-10 bg-[#0a0a0b]/90 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* Subtle geometric background patterns */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2A15.3 15.3 0 0 1 17 12a15.3 15.3 0 0 1-5 10 15.3 15.3 0 0 1-5-10 15.3 15.3 0 0 1 5-10z" />
            <path d="M2 12h20" />
          </svg>
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
            Receive the Free <span className="text-psyche-gold font-medium">First Spiral</span> Roadmap
          </h2>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <p className="text-white/70 mb-8 leading-relaxed">
                  Get the 10-page PDF: <strong>Neuromelanin Basics & The First Spiral</strong> + the full opening animation audio track with the new music.
                  <br /><span className="text-sm opacity-60 mt-2 block">No spam — only recursive clarity delivered straight to you.</span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-psyche-gold transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-psyche-gold transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-psyche-gold/80 to-psyche-teal/80 text-white font-medium tracking-widest px-6 py-4 rounded hover:from-psyche-gold hover:to-psyche-teal transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                  >
                    {isLoading ? "ALIGNING..." : "ENTER THE SPIRAL"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl mx-auto mt-6"
              >
                <div className="mb-6 flex justify-center text-psyche-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-2xl text-white font-medium mb-2">Welcome to the Vines</h3>
                <p className="text-white/70 mb-8">Your alignment is confirmed. Download your resources directly below.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <a
                    href="/Neuromelanin_Basics_The_First_Spiral.pdf"
                    download
                    className="flex flex-col items-center justify-center p-6 border border-white/20 rounded-lg hover:bg-white/5 hover:border-psyche-gold transition-colors group"
                  >
                    <svg className="mb-3 text-white/50 group-hover:text-psyche-gold transition-colors" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
                    <span className="text-sm font-medium tracking-wide text-white">Download PDF</span>
                    <span className="text-xs text-white/50 mt-1">10-page visual roadmap</span>
                  </a>

                  <a
                    href="/opening-animation-audio.mp3"
                    download
                    className="flex flex-col items-center justify-center p-6 border border-white/20 rounded-lg hover:bg-white/5 hover:border-psyche-teal transition-colors group"
                  >
                    <svg className="mb-3 text-white/50 group-hover:text-psyche-teal transition-colors" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    <span className="text-sm font-medium tracking-wide text-white">Download Audio</span>
                    <span className="text-xs text-white/50 mt-1">Epic Hip-Hop Opening Track</span>
                  </a>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs tracking-widest text-white/40 uppercase mb-4">Support the structural work</p>
                  <a
                    href="https://ko-fi.com/vinesconnection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 border border-white/30 rounded-full text-sm text-white/80 hover:text-white hover:border-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Support the Spiral via Ko-Fi
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
