"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

function Pillar({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="gradient-card rounded-2xl p-8 backdrop-blur-md"
      style={{ borderTop: `2px solid ${accent}` }}
    >
      <h3
        className="mb-3 text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: accent }}
      >
        {title}
      </h3>
      <p className="leading-relaxed text-text-secondary">{body}</p>
    </motion.div>
  );
}

export default function CinematicExperience() {
  return (
    <div className="relative">
      {/* The cinematic 3D backdrop is provided globally by ClientLayout */}
      <div className="relative z-10">
        {/* ---------------- HERO ---------------- */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 inline-block rounded-full border border-psyche-gold/40 bg-celestial-900/40 px-6 py-2 backdrop-blur-md">
              <span className="text-sm uppercase tracking-[0.3em] text-psyche-gold">
                Vines Connection
              </span>
            </div>
            <h1
              className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-8xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Dismantle Incoherence.{" "}
              <span className="gradient-text">Discover Recursion.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              A cinematic descent through neuromelanin biology, sacred geometry,
              and the Enneagram — where science, philosophy, and operational
              clarity intertwine.
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 text-sm uppercase tracking-widest text-psyche-gold/70"
          >
            ↓ Scroll to descend
          </motion.div>
        </section>

        {/* ---------------- FRAMEWORK ---------------- */}
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-32">
          <motion.h2
            {...fadeUp}
            className="mb-4 text-center text-4xl font-bold md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The <span className="gradient-text">Framework</span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mx-auto mb-16 max-w-2xl text-center text-lg text-text-secondary"
          >
            Three strands spiral into one coherent system.
          </motion.p>
          <div className="grid gap-6 md:grid-cols-3">
            <Pillar
              title="Neuromelanin Biology"
              body="The physical substrate of perception and coherence — how the body's own pigment architecture conducts signal, light, and intelligence."
              accent="#f0a830"
            />
            <Pillar
              title="Sacred Geometry"
              body="The recurring structural grammar of nature — the patterns that bridge the microscopic and the cosmic into a single language of form."
              accent="#20c9b0"
            />
            <Pillar
              title="The Enneagram"
              body="A map of recursive behavioral patterns — a practical instrument for dismantling incoherence and operationalizing self-knowledge."
              accent="#e83e8c"
            />
          </div>
        </section>

        {/* ---------------- WORK / BOOKS ---------------- */}
        <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-32 text-center">
          <motion.h2
            {...fadeUp}
            className="mb-6 text-4xl font-bold md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Collapse <span className="gradient-text">Recursion</span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary"
          >
            Books and digital products by Shawn Cummings — a forensic toolkit for
            tracing patterns across generations, systems, and the self.
          </motion.p>
          <motion.div
            {...fadeUp}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-8 py-4 text-lg font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95"
            >
              Explore the Library
            </Link>
            <Link
              href="/university"
              className="rounded-full border border-psyche-teal/50 px-8 py-4 text-lg text-psyche-teal transition-all hover:border-psyche-teal hover:bg-psyche-teal/10 active:scale-95"
            >
              Enter the University
            </Link>
          </motion.div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-32 text-center">
          <motion.div
            {...fadeUp}
            className="gradient-card rounded-3xl p-12 backdrop-blur-md"
          >
            <h2
              className="mb-6 text-4xl font-bold md:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Begin the <span className="gradient-text">Connection</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-text-secondary">
              Step into the work that bridges biology, geometry, and coherent
              self-discovery.
            </p>
            <a
              href="https://payhip.com/VinesConnection"
              target="_blank"
              rel="noopener noreferrer"
              className="glow-gold inline-block rounded-full bg-gradient-to-r from-psyche-gold via-psyche-coral to-psyche-magenta px-10 py-5 text-lg font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95"
            >
              Visit the Store
            </a>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
