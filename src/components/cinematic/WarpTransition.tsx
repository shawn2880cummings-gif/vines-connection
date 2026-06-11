"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Listens for a "vines-warp" event and plays a spiral/light-speed
 * transition before navigating, so entering the University feels like
 * being pulled into it rather than an instant jump.
 *
 * Trigger from anywhere:
 *   window.dispatchEvent(new CustomEvent("vines-warp", { detail: { href: "/university" } }))
 */
export default function WarpTransition() {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onWarp = (e: Event) => {
      const href = (e as CustomEvent).detail?.href as string | undefined;
      setActive(true);
      // Navigate partway through, while the screen is covered
      window.setTimeout(() => href && router.push(href), 650);
      // Reveal the destination
      window.setTimeout(() => setActive(false), 1350);
    };
    window.addEventListener("vines-warp", onWarp as EventListener);
    return () =>
      window.removeEventListener("vines-warp", onWarp as EventListener);
  }, [router]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="warp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-bg-primary"
        >
          {/* Spinning spiral arms rushing toward the viewer */}
          <motion.div
            initial={{ scale: 0.15, rotate: 0, opacity: 0.3 }}
            animate={{ scale: 11, rotate: 600, opacity: 1 }}
            transition={{ duration: 1.25, ease: "easeIn" }}
            className="h-[42vmin] w-[42vmin] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(32,201,176,0) 0deg, rgba(240,168,48,0.7) 90deg, rgba(32,201,176,0) 180deg, rgba(155,89,182,0.7) 270deg, rgba(32,201,176,0) 360deg)",
              filter: "blur(6px)",
            }}
          />
          {/* Expanding core flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 14], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.25, ease: "easeIn", times: [0, 0.55, 1] }}
            className="absolute h-[20vmin] w-[20vmin] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(32,201,176,0.6) 40%, rgba(32,201,176,0) 70%)",
            }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.25, 0.65, 1] }}
            className="absolute text-sm uppercase tracking-[0.45em] text-psyche-gold"
            style={{ textShadow: "0 0 16px rgba(240,168,48,0.7)" }}
          >
            Entering the University
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
