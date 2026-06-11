"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { updateScrollProgress } from "./scrollStore";

// WebGL canvas is client-only. Mounted once here so it persists across
// route changes (no re-init flash when navigating between pages).
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function CinematicBackground() {
  useEffect(() => {
    updateScrollProgress();
    const onScroll = () => updateScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Page content height changes on client navigation — recompute periodically
    const poll = window.setInterval(updateScrollProgress, 500);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(poll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Cinematic 3D scene */}
      <div className="absolute inset-0">
        <Scene3D />
      </div>
      {/* Contrast veil keeps page text readable over the bright scene */}
      <div className="absolute inset-0 bg-bg-primary/35" />
    </div>
  );
}
