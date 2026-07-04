"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Scroll-driven underwater world. The page is a dive: sections carry
 * data-depth (meters) + data-zone, and as you scroll the water color,
 * light, and sea life change to match the depth between them.
 *
 * Pure 2D canvas — no WebGL required — so it stays fast on phones.
 */

type RGB = [number, number, number];

/** Water color ladder keyed by depth in meters (top / bottom of viewport). */
const LADDER: { d: number; t: RGB; b: RGB }[] = [
  { d: 0, t: [38, 130, 155], b: [16, 84, 110] }, // surface — sunlit water
  { d: 150, t: [22, 96, 124], b: [11, 60, 88] }, // sunlit
  { d: 500, t: [13, 64, 94], b: [7, 40, 66] }, // upper twilight
  { d: 1200, t: [6, 32, 54], b: [3, 19, 37] }, // midnight
  { d: 2800, t: [2, 12, 24], b: [1, 7, 15] }, // lower midnight
  { d: 4500, t: [1, 6, 12], b: [0, 3, 7] }, // abyss
  { d: 6000, t: [0, 4, 9], b: [0, 2, 5] }, // trench
];

function zoneName(d: number): string {
  if (d < 60) return "Surface";
  if (d < 300) return "Sunlit Zone";
  if (d < 1000) return "Twilight Zone";
  if (d < 2800) return "Midnight Zone";
  if (d < 5200) return "The Abyss";
  return "The Trench";
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRGB(c1: RGB, c2: RGB, t: number): string {
  return `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(
    lerp(c1[1], c2[1], t),
  )},${Math.round(lerp(c1[2], c2[2], t))})`;
}

function waterColors(d: number): [string, string] {
  if (d <= LADDER[0].d) return [mixRGB(LADDER[0].t, LADDER[0].t, 0), mixRGB(LADDER[0].b, LADDER[0].b, 0)];
  for (let i = 0; i < LADDER.length - 1; i++) {
    if (d >= LADDER[i].d && d < LADDER[i + 1].d) {
      const t = (d - LADDER[i].d) / (LADDER[i + 1].d - LADDER[i].d);
      return [mixRGB(LADDER[i].t, LADDER[i + 1].t, t), mixRGB(LADDER[i].b, LADDER[i + 1].b, t)];
    }
  }
  const last = LADDER[LADDER.length - 1];
  return [mixRGB(last.t, last.t, 0), mixRGB(last.b, last.b, 0)];
}

/** 0..1 bell curve centered on `mid`, reaching 0 at `mid ± span`. */
function bell(d: number, mid: number, span: number) {
  return Math.max(0, 1 - Math.abs(d - mid) / span);
}

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function OceanScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meterRef = useRef<HTMLElement>(null);
  const zoneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let anchors: { y: number; d: number }[] = [];

    const bubbles = Array.from({ length: 30 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: rnd(1.5, 5),
      s: rnd(0.35, 1.1),
      w: rnd(0, Math.PI * 2),
    }));
    const snow = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: rnd(0.6, 1.8),
      s: rnd(0.06, 0.22),
      w: rnd(0, Math.PI * 2),
    }));
    const fish = Array.from({ length: 11 }, () => ({
      x: Math.random(),
      y: rnd(0.15, 0.85),
      l: rnd(13, 24),
      s: rnd(0.0006, 0.0013) * (Math.random() < 0.5 ? -1 : 1),
      w: rnd(0, Math.PI * 2),
    }));
    const jellies = Array.from({ length: 3 }, () => ({
      x: rnd(0.12, 0.88),
      y: rnd(0.2, 0.75),
      r: rnd(16, 30),
      w: rnd(0, Math.PI * 2),
    }));
    const whale = { x: -0.3, y: 0.42, s: 0.00016 };

    function mapSections() {
      anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-depth]"),
      ).map((s) => {
        const r = s.getBoundingClientRect();
        return {
          y: r.top + window.scrollY + r.height / 2,
          d: parseFloat(s.dataset.depth || "0"),
        };
      });
      anchors.sort((a, b) => a.y - b.y);
    }

    function currentDepth(): number {
      const probe = window.scrollY + H * 0.55;
      if (!anchors.length) {
        const doc = document.documentElement;
        const p = window.scrollY / Math.max(1, doc.scrollHeight - H);
        return p * 2000;
      }
      if (probe <= anchors[0].y) return anchors[0].d;
      const last = anchors.length - 1;
      if (probe >= anchors[last].y) return anchors[last].d;
      for (let i = 0; i < last; i++) {
        if (probe >= anchors[i].y && probe < anchors[i + 1].y) {
          const t = (probe - anchors[i].y) / (anchors[i + 1].y - anchors[i].y);
          return lerp(anchors[i].d, anchors[i + 1].d, t);
        }
      }
      return anchors[last].d;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      mapSections();
    }

    function drawFish(x: number, y: number, l: number, dir: number, alpha: number) {
      const c = ctx!;
      c.save();
      c.translate(x, y);
      c.scale(dir, 1);
      c.fillStyle = `rgba(2,14,24,${alpha})`;
      c.beginPath();
      c.ellipse(0, 0, l, l * 0.34, 0, 0, Math.PI * 2);
      c.moveTo(-l * 0.85, 0);
      c.lineTo(-l * 1.45, -l * 0.42);
      c.lineTo(-l * 1.45, l * 0.42);
      c.closePath();
      c.fill();
      c.restore();
    }

    /** Smoothed depth so fast scrolls glide instead of jumping. */
    let smooth = 0;
    let t0 = 0;

    function frame(now: number) {
      const c = ctx!;
      const t = now / 1000;
      const dt = Math.min(t - t0, 0.05);
      t0 = t;

      const target = currentDepth();
      smooth += (target - smooth) * (reduced ? 1 : 0.08);
      const d = smooth;

      // water gradient
      const [top, bot] = waterColors(d);
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, top);
      g.addColorStop(1, bot);
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);

      // god rays — fade out by ~500 m
      const rayA = Math.max(0, 1 - d / 500);
      if (rayA > 0.01 && !reduced) {
        c.save();
        c.globalCompositeOperation = "lighter";
        for (let r = 0; r < 5; r++) {
          const cx = W * (0.12 + r * 0.19) + Math.sin(t * 0.22 + r * 1.7) * W * 0.03;
          const sway = Math.sin(t * 0.14 + r) * W * 0.06;
          const grd = c.createLinearGradient(cx, 0, cx + sway, H * 0.85);
          grd.addColorStop(0, `rgba(255,250,225,${0.13 * rayA})`);
          grd.addColorStop(1, "rgba(255,250,225,0)");
          c.fillStyle = grd;
          c.beginPath();
          c.moveTo(cx - W * 0.012, 0);
          c.lineTo(cx + W * 0.012, 0);
          c.lineTo(cx + sway + W * 0.075, H * 0.85);
          c.lineTo(cx + sway - W * 0.075, H * 0.85);
          c.closePath();
          c.fill();
        }
        c.restore();
      }

      if (!reduced) {
        // bubbles — thin out with depth
        const nB = Math.round(lerp(30, 6, Math.min(d / 3000, 1)));
        c.strokeStyle = "rgba(220,245,250,0.32)";
        for (let i = 0; i < nB; i++) {
          const bb = bubbles[i];
          bb.y -= bb.s * dt * 0.12;
          bb.w += dt * 1.6;
          if (bb.y < -0.02) {
            bb.y = 1.02;
            bb.x = Math.random();
          }
          c.beginPath();
          c.arc(bb.x * W + Math.sin(bb.w) * 6, bb.y * H, bb.r, 0, Math.PI * 2);
          c.stroke();
        }

        // marine snow — deep water only
        const snowA = Math.max(0, Math.min((d - 350) / 450, 1)) * 0.55;
        if (snowA > 0.01) {
          c.fillStyle = `rgba(215,232,238,${snowA})`;
          for (const sn of snow) {
            sn.y += sn.s * dt * 0.25;
            sn.w += dt * 0.7;
            if (sn.y > 1.02) {
              sn.y = -0.02;
              sn.x = Math.random();
            }
            c.fillRect(sn.x * W + Math.sin(sn.w) * 9, sn.y * H, sn.r, sn.r);
          }
        }

        // fish school + whale — mid-water band
        const fishA = bell(d, 600, 700) * 0.7;
        if (fishA > 0.02) {
          for (const f of fish) {
            f.x += f.s * dt * 60;
            if (f.x > 1.15) f.x = -0.15;
            if (f.x < -0.15) f.x = 1.15;
            drawFish(f.x * W, (f.y + Math.sin(t * 0.8 + f.w) * 0.012) * H, f.l, f.s > 0 ? -1 : 1, fishA);
          }
          whale.x += whale.s * dt * 60;
          if (whale.x > 1.4) whale.x = -0.45;
          const wl = Math.min(W * 0.34, 300);
          const wx = whale.x * W;
          const wy = (whale.y + Math.sin(t * 0.15) * 0.02) * H;
          c.fillStyle = `rgba(1,10,18,${fishA * 0.7})`;
          c.beginPath();
          c.ellipse(wx, wy, wl, wl * 0.24, 0, 0, Math.PI * 2);
          c.moveTo(wx - wl * 0.92, wy);
          c.lineTo(wx - wl * 1.3, wy - wl * 0.2);
          c.lineTo(wx - wl * 1.22, wy);
          c.lineTo(wx - wl * 1.3, wy + wl * 0.2);
          c.closePath();
          c.fill();
        }

        // jellyfish — midnight waters
        const jA = bell(d, 2600, 1400) * 0.8;
        if (jA > 0.02) {
          for (const jj of jellies) {
            const jx = jj.x * W;
            const jy = (jj.y + Math.sin(t * 0.35 + jj.w) * 0.03) * H;
            const jr = jj.r * (1 + Math.sin(t * 1.6 + jj.w) * 0.08);
            const jg = c.createRadialGradient(jx, jy, 1, jx, jy, jr * 2.2);
            jg.addColorStop(0, `rgba(111,231,210,${0.45 * jA})`);
            jg.addColorStop(1, "rgba(111,231,210,0)");
            c.fillStyle = jg;
            c.beginPath();
            c.arc(jx, jy, jr * 2.2, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = `rgba(180,245,232,${0.5 * jA})`;
            c.lineWidth = 1;
            for (let tt = -2; tt <= 2; tt++) {
              c.beginPath();
              c.moveTo(jx + tt * jr * 0.28, jy + jr * 0.3);
              c.quadraticCurveTo(
                jx + tt * jr * 0.5 + Math.sin(t * 1.2 + tt) * 5,
                jy + jr * 1.6,
                jx + tt * jr * 0.4 + Math.sin(t * 0.9 + tt) * 8,
                jy + jr * 2.6,
              );
              c.stroke();
            }
            c.beginPath();
            c.arc(jx, jy, jr, Math.PI, 0);
            c.closePath();
            c.fillStyle = `rgba(160,240,226,${0.32 * jA})`;
            c.fill();
          }
        }

        // anglerfish lure — the trench
        const aA = Math.max(0, Math.min((d - 4700) / 900, 1));
        if (aA > 0.02) {
          const ax = W * (0.5 + Math.sin(t * 0.21) * 0.16);
          const ay = H * (0.36 + Math.sin(t * 0.33) * 0.07);
          const ag = c.createRadialGradient(ax, ay, 0, ax, ay, 70);
          ag.addColorStop(0, `rgba(212,173,78,${0.5 * aA})`);
          ag.addColorStop(0.25, `rgba(212,173,78,${0.18 * aA})`);
          ag.addColorStop(1, "rgba(212,173,78,0)");
          c.fillStyle = ag;
          c.beginPath();
          c.arc(ax, ay, 70, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = `rgba(255,236,190,${0.85 * aA})`;
          c.beginPath();
          c.arc(ax, ay, 2.6, 0, Math.PI * 2);
          c.fill();
        }
      }

      // vignette deepens as you sink
      const vg = c.createRadialGradient(
        W / 2, H / 2, Math.min(W, H) * 0.35,
        W / 2, H / 2, Math.max(W, H) * 0.75,
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,3,7,${0.18 + 0.3 * Math.min(d / 5000, 1)})`);
      c.fillStyle = vg;
      c.fillRect(0, 0, W, H);

      // depth gauge
      if (meterRef.current && zoneRef.current) {
        const shown = Math.round(d);
        meterRef.current.textContent = shown <= 0 ? "0 m" : `−${shown.toLocaleString()} m`;
        zoneRef.current.textContent = zoneName(d);
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(() => mapSections());
    ro.observe(document.body);

    if (reduced) {
      const onScroll = () => frame(performance.now());
      window.addEventListener("scroll", onScroll, { passive: true });
      frame(performance.now());
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        ro.disconnect();
      };
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, []);

  // The gauge portals to <body> so the z-0 background container can't
  // stack it beneath the page content. This component is client-only.
  const gauge =
    typeof document !== "undefined"
      ? createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full border border-paan-cyan/25 bg-[rgba(2,12,20,0.6)] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-paan-cream/70 backdrop-blur-md"
          >
            <b
              ref={meterRef}
              className="min-w-[5.5ch] text-right font-semibold tracking-wider text-paan-cyan [font-variant-numeric:tabular-nums]"
            >
              0 m
            </b>
            <span ref={zoneRef}>Surface</span>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {gauge}
    </>
  );
}
