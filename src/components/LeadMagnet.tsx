"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// MailerLite group IDs (configured in the MailerLite account)
export const GROUPS = {
  roadmap: "187663310243497176",
  ebook: "187663346725553208",
} as const;

type LeadMagnetProps = {
  /** MailerLite group the subscriber is added to */
  groupId?: string;
  heading?: React.ReactNode;
  blurb?: React.ReactNode;
  cta?: string;
};

export const LeadMagnet = ({
  groupId = GROUPS.ebook,
  heading = (
    <>
      Receive the Free{" "}
      <span className="text-psyche-gold font-medium">Collapse Recursion</span>{" "}
      Ebook
    </>
  ),
  blurb = (
    <>
      Get <strong>The Collapse Recursion of Conversation</strong> delivered
      straight to your inbox, plus the weekly recursive-clarity letter.
      <br />
      <span className="text-sm opacity-60 mt-2 block">
        No spam — unsubscribe anytime.
      </span>
    </>
  ),
  cta = "SEND ME THE EBOOK",
}: LeadMagnetProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, groupId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Subscription failed. Please try again.");
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full max-w-3xl mx-auto my-24 p-1">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-psyche-violet/40 via-psyche-gold/20 to-psyche-teal/40 opacity-50 blur-md pointer-events-none" />

      <div className="relative z-10 bg-[#05070f]/85 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2A15.3 15.3 0 0 1 17 12a15.3 15.3 0 0 1-5 10 15.3 15.3 0 0 1-5-10 15.3 15.3 0 0 1 5-10z" />
            <path d="M2 12h20" />
          </svg>
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
            {heading}
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
                <p className="text-white/70 mb-8 leading-relaxed">{blurb}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
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
                  {error && (
                    <p className="text-sm text-psyche-coral text-left">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-psyche-gold/90 to-psyche-teal/90 text-celestial-900 font-semibold tracking-widest px-6 py-4 rounded hover:from-psyche-gold hover:to-psyche-teal transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                  >
                    {isLoading ? "ALIGNING..." : cta}
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
                <p className="text-white/70 mb-8">
                  You&apos;re in. Check your inbox &mdash; your ebook and welcome
                  letter are on their way. (Peek in spam/promotions if you don&apos;t
                  see it shortly.)
                </p>

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

export default LeadMagnet;
