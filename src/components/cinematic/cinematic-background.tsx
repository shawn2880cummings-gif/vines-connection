"use client";

import dynamic from "next/dynamic";

const CosmicScene = dynamic(() => import("./cosmic-scene"), {
  ssr: false,
});

/**
 * Fixed, full-viewport 3D backdrop for the public pages.
 * Sits behind all content; pointer events pass through.
 */
export function CinematicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Deep base gradient — near-black with an emerald heart */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#122B1E_0%,#0A0F0B_45%,#050505_100%)]" />
      {/* Living 3D layer */}
      <div className="absolute inset-0">
        <CosmicScene />
      </div>
      {/* Vignette to keep long-form text readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.55)_100%)]" />
    </div>
  );
}
