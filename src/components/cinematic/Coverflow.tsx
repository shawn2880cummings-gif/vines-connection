"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const clampNum = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// A subdivided plane displaced into a concave "scoop" (center pushed back,
// edges toward the viewer) — this is the curved bend.
function useCurvedGeometry(w: number, h: number, depth: number) {
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(w, h, 48, 28);
    const pos = geo.attributes.position;
    const halfW = w / 2;
    const halfH = h / 2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const cx = (x / halfW) ** 2;
      const cy = (y / halfH) ** 2;
      // concave: 0 at edges, -depth at centre
      pos.setZ(i, -depth * (1 - cx) * (1 - cy * 0.4));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [w, h, depth]);
}

type SlidesProps = {
  slides: string[];
  targetRef: React.MutableRefObject<number>;
  onPick: (i: number) => void;
};

function Slides({ slides, targetRef, onPick }: SlidesProps) {
  const textures = useLoader(THREE.TextureLoader, slides);
  useMemo(() => {
    textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  }, [textures]);

  const W = 3.5;
  const H = (W * 9) / 16;
  const geometry = useCurvedGeometry(W, H, 0.45);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const current = useRef(0);

  useFrame(({ viewport }) => {
    current.current += (targetRef.current - current.current) * 0.12;
    const cur = current.current;
    // Scale the whole arrangement so the active slide fills most of the view
    const fit = Math.min(viewport.width / (W * 1.18), viewport.height / (H * 1.25));
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const d = i - cur;
      const ad = Math.abs(d);
      const visible = ad < 3.6;
      m.visible = visible;
      if (!visible) return;
      m.position.x = d * W * 0.88 * fit;
      m.position.y = 0;
      m.position.z = d === 0 ? 0 : -ad * 1.0;
      m.rotation.y = clampNum(-d, -1.5, 1.5) * 0.45;
      const s = fit / (1 + ad * 0.3);
      m.scale.setScalar(s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = ad < 2.4 ? 1 - ad * 0.14 : Math.max(0, (3.6 - ad) / 1.2);
    });
  });

  return (
    <group>
      {slides.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          geometry={geometry}
          onClick={(e) => {
            e.stopPropagation();
            onPick(i);
          }}
        >
          <meshBasicMaterial
            map={textures[i]}
            transparent
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Coverflow({ slides }: { slides: string[] }) {
  const n = slides.length;
  const targetRef = useRef(0);
  const [active, setActive] = useState(0);

  const go = useCallback(
    (i: number) => {
      const c = clampNum(Math.round(i), 0, n - 1);
      targetRef.current = c;
      setActive(c);
    },
    [n]
  );
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // drag + wheel
  const dragging = useRef(false);
  const startX = useRef(0);
  const startTarget = useRef(0);
  const wheelLock = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startTarget.current = targetRef.current;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    targetRef.current = clampNum(
      startTarget.current - dx / 220,
      0,
      n - 1
    );
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    go(targetRef.current);
  };
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now < wheelLock.current) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 8) return;
    wheelLock.current = now + 320;
    if (d > 0) next();
    else prev();
  };

  return (
    <div className="relative w-full select-none">
      <div
        className="relative mx-auto h-[clamp(300px,62vh,720px)] w-full cursor-grab touch-pan-y active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onWheel={onWheel}
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 48 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.75]}
        >
          <Slides slides={slides} targetRef={targetRef} onPick={go} />
        </Canvas>
      </div>

      {/* Controls (always in view) */}
      <div className="mt-6 flex items-center justify-center gap-6">
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

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-psyche-gold" : "w-1.5 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <p className="mt-5 text-center text-xs uppercase tracking-[0.3em] text-text-secondary/50">
        drag · scroll · ← → · click a slide
      </p>
    </div>
  );
}
