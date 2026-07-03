"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * The hero banner as a floating 3D object: cinematic entrance,
 * slow levitation, pointer-tracked tilt, and a golden aura.
 */
export function HeroBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [4.5, -4.5]), {
    stiffness: 120,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), {
    stiffness: 120,
    damping: 22,
  });

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

  const banner = (
    <Image
      src="/images/hero-banner.png"
      alt="PAAN Ministry Banner — Sovereignty of the Mind · Coherence · Divine Order"
      width={2070}
      height={1338}
      className="w-full h-auto object-contain mx-auto rounded-xl"
      priority
      quality={100}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
    />
  );

  if (reduceMotion) {
    return <div className="relative">{banner}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1400 }}
    >
      {/* Golden aura behind the banner */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-1/4 bottom-1/4 -z-10 rounded-full bg-paan-gold/15 blur-[120px] animate-aura"
      />
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-xl ring-1 ring-paan-gold/25 shadow-[0_24px_80px_-20px_rgba(197,151,44,0.35)]"
      >
        {banner}
        {/* Golden light sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-sheen bg-[linear-gradient(115deg,transparent_38%,rgba(212,173,78,0.16)_48%,rgba(245,240,232,0.10)_52%,transparent_62%)] bg-[length:250%_100%]"
        />
      </motion.div>
    </motion.div>
  );
}
