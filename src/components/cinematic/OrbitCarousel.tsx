"use client";

import { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export type Pillar = {
  title: string;
  description: string;
  color: string;
  glow: string;
};

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div
      className={`gradient-card rounded-2xl p-8 ${pillar.glow} h-full`}
    >
      <div
        className={`mb-4 h-1 w-16 rounded-full bg-gradient-to-r ${pillar.color}`}
      />
      <h3
        className="mb-3 text-xl font-bold text-text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {pillar.title}
      </h3>
      <p
        className="leading-relaxed text-text-secondary"
        dangerouslySetInnerHTML={{ __html: pillar.description }}
      />
    </div>
  );
}

export default function OrbitCarousel({ pillars }: { pillars: Pillar[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const paused = useRef(false);
  const elapsed = useRef(0);
  const last = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (last.current === null) last.current = time;
    const dt = time - last.current;
    last.current = time;
    if (!paused.current) elapsed.current += dt;

    const period = 26000; // ms per full revolution (slow)
    const base = (elapsed.current / period) * Math.PI * 2;
    const n = pillars.length || 1;

    refs.current.forEach((el, i) => {
      if (!el) return;
      const a = base + (i * Math.PI * 2) / n;
      const depth = Math.cos(a); // 1 = front, -1 = back
      const x = Math.sin(a) * 300; // horizontal orbit radius
      const y = -depth * 24; // gentle vertical arc
      const scale = 0.82 + ((depth + 1) / 2) * 0.34; // 0.82 .. 1.16
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.zIndex = String(Math.round((depth + 1) * 100));
      el.style.opacity = String(0.5 + ((depth + 1) / 2) * 0.5);
    });
  });

  return (
    <>
      {/* Mobile: clean readable stack (no orbit) */}
      <div className="grid gap-8 md:hidden">
        {pillars.map((p) => (
          <PillarCard key={p.title} pillar={p} />
        ))}
      </div>

      {/* Desktop: cards revolve around a shared center */}
      <div
        className="relative hidden h-[440px] md:block"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {pillars.map((p, i) => (
          <div
            key={p.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-[300px] cursor-default"
            style={{ willChange: "transform, opacity" }}
          >
            <PillarCard pillar={p} />
          </div>
        ))}
        <p className="absolute inset-x-0 -bottom-2 text-center text-xs uppercase tracking-widest text-text-secondary/60">
          Hover to pause
        </p>
      </div>
    </>
  );
}
