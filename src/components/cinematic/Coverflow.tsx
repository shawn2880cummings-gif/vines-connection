"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 3D coverflow slide viewer. The active slide is pushed forward and centered;
 * neighbouring slides curve off to the left and right into space, as if you
 * are standing inside a sphere with the deck wrapping around you. Advance with
 * the arrows, click a side slide, use the keyboard, or swipe.
 */
export default function Coverflow({ slides }: { slides: string[] }) {
  const [active, setActive] = useState(0);
  const n = slides.length;

  const clamp = useCallback((i: number) => Math.max(0, Math.min(n - 1, i)), [n]);
  const next = useCallback(() => setActive((a) => clamp(a + 1)), [clamp]);
  const prev = useCallback(() => setActive((a) => clamp(a - 1)), [clamp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -45) next();
    else if (dx > 45) prev();
    touchX.current = null;
  };

  const ANGLE = 42;

  return (
    <div className="relative w-full select-none">
      {/* Stage */}
      <div
        className="relative mx-auto h-[clamp(240px,56vw,640px)] w-full"
        style={{ perspective: "1900px" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {slides.map((src, i) => {
            const r = i - active;
            const abs = Math.abs(r);
            const hidden = abs > 3;

            const x = r * 54; // % of slide width
            const tz = r === 0 ? 240 : -abs * 200;
            const ry = r === 0 ? 0 : r < 0 ? ANGLE : -ANGLE;
            const scale = r === 0 ? 1 : Math.max(0.6, 0.86 - (abs - 1) * 0.08);
            const opacity = hidden ? 0 : r === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.5 : 0.22;
            const brightness = r === 0 ? 1 : Math.max(0.4, 0.75 - (abs - 1) * 0.15);

            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => (r === 0 ? null : setActive(i))}
                className="absolute left-1/2 top-1/2 aspect-video w-[80vw] max-w-[940px] overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                style={{
                  transform: `translate(-50%, -50%) translateX(${x}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  opacity,
                  filter: `brightness(${brightness})`,
                  zIndex: 100 - abs,
                  pointerEvents: hidden ? "none" : "auto",
                  cursor: r === 0 ? "default" : "pointer",
                  transition:
                    "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, filter 0.6s ease",
                  boxShadow:
                    r === 0
                      ? "0 0 60px rgba(32,201,176,0.25), 0 30px 60px rgba(0,0,0,0.6)"
                      : "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  draggable={false}
                  loading={abs <= 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          disabled={active === 0}
          aria-label="Previous slide"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-text-primary transition-all hover:border-psyche-teal hover:text-psyche-teal disabled:opacity-30"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>

        <span className="font-mono text-sm tracking-[0.3em] text-text-secondary">
          {String(active + 1).padStart(2, "0")}{" "}
          <span className="text-psyche-gold">/</span>{" "}
          {String(n).padStart(2, "0")}
        </span>

        <button
          onClick={next}
          disabled={active === n - 1}
          aria-label="Next slide"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-text-primary transition-all hover:border-psyche-teal hover:text-psyche-teal disabled:opacity-30"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      {/* Progress dots */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-6 bg-psyche-gold"
                : "w-1.5 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-text-secondary/50">
        ← → · click a slide · swipe
      </p>
    </div>
  );
}
