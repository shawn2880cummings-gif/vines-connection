"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees */
  intensity?: number;
}

/**
 * Pointer-tracking 3D tilt with a travelling gold glare.
 * Wrap any card to make it feel like a physical object.
 */
export function TiltCard({ children, className = "", intensity = 9 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 180,
    damping: 20,
  });
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${glareX} ${glareY}, rgba(212,173,78,0.14), transparent 65%)`;

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  function onPointerMove(e: React.PointerEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      className={`group/tilt relative ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.25 } }}
    >
      {children}
      {/* Travelling gold glare */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ backgroundImage: glare }}
      />
    </motion.div>
  );
}
