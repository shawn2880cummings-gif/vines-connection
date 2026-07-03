"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Cinematic scroll reveal: content rises out of depth (z + rotateX) and
 * settles into place as it enters the viewport.
 */
export function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48, rotateX: 10, scale: 0.97, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.9,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformPerspective: 1200, transformStyle: "preserve-3d", willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
