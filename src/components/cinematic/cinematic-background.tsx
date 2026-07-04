"use client";

import dynamic from "next/dynamic";

const OceanScene = dynamic(
  () => import("./ocean-scene").then((m) => m.OceanScene),
  { ssr: false },
);

/**
 * Fixed, full-viewport backdrop for the public pages: the living ocean.
 * The page is a dive — scrolling descends from sunlit water to the trench.
 * Sits behind all content; pointer events pass through.
 */
export function CinematicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Static deep-water base shown until the scene hydrates */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#26829B_0%,#10546E_100%)]" />
      {/* Living scroll-depth ocean */}
      <div className="absolute inset-0">
        <OceanScene />
      </div>
    </div>
  );
}
