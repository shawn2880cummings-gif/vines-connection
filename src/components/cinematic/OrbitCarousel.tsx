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
  const elapsed = useRef(0);
  const last = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (last.current === null) last.current = time;
    const dt = time - last.current;
    last.current = time;
    elapsed.current += dt; // always rotating, consistently

    const period = 18000; // ms per full revolution
    const base = (elapsed.current / period) * Math.PI * 2;
    const n = pillars.length || 1;

    refs.current.forEach((el, i) => {
      if (!el) return;
      const a = base + (i * Math.PI * 2) / n;
      const depth = Math.cos(a); // 1 = front, -1 = back
      const x = Math.sin(a) * 270; // horizontal orbit radius
      const y = -depth * 30; // vertical arc for depth
      const scale = 0.74 + ((depth + 1) / 2) * 0.46; // 0.74 .. 1.20
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.zIndex = String(Math.round((depth + 1) * 100));
      el.style.opacity = String(0.45 + ((depth + 1) / 2) * 0.55);
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

      {/* Desktop: cards continuously revolve around a shared center */}
      <div className="relative hidden h-[460px] md:block">
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
      </div>
    </>
  );
}
