"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero relative min-h-[90vh] overflow-hidden">
        {/* Floating orbs */}
        <div className="orb left-[10%] top-[20%] h-64 w-64 bg-psyche-teal/20" />
        <div
          className="orb right-[15%] top-[30%] h-80 w-80 bg-psyche-magenta/15"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="orb bottom-[10%] left-[40%] h-72 w-72 bg-psyche-gold/20"
          style={{ animationDelay: "5s" }}
        />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
          {/* Logo with floating and glowing animation */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              filter: [
                "drop-shadow(0 0 8px rgba(255,215,0,0.2))",
                "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
                "drop-shadow(0 0 8px rgba(255,215,0,0.2))"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="mb-8"
          >
            <div className="relative h-24 w-24 md:h-32 md:w-32">
              <div className="absolute inset-0 rounded-full bg-psyche-gold/10 blur-2xl" />
              <Image
                src="/vines-logo.jpg"
                alt="Vines Connection"
                fill
                className="rounded-full object-cover border border-psyche-gold/30"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Brand badge */}
            <div className="mb-8 inline-block rounded-full border border-psyche-gold/30 bg-celestial-800/50 px-6 py-2 backdrop-blur-sm">
              <span className="text-sm tracking-widest text-psyche-gold uppercase">
                Vines Connection
              </span>
            </div>

            <h1
              className="mb-6 max-w-4xl text-5xl leading-tight font-bold md:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Dismantle Incoherence.{" "}
              <span className="gradient-text">Discover Recursion.</span>
            </h1>

            <p className="mb-10 mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              A systematic framework integrating neuromelanin biology, sacred
              geometry, and the Enneagram &mdash; bridging science, philosophy,
              and operational clarity.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-8 py-4 text-lg font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-psyche-gold/10"
              >
                Explore Products
              </Link>
              <a
                href="https://payhip.com/VinesConnection"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-psyche-teal/50 px-8 py-4 text-lg text-psyche-teal transition-all hover:bg-psyche-teal/10 hover:border-psyche-teal active:scale-95"
              >
                Visit Store
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </section>

      {/* Featured Book Section */}
      <section className="relative py-24 overflow-hidden">
        <motion.div 
          {...fadeInUp}
          className="mx-auto max-w-7xl px-6"
        >
          <div className="mb-4 text-center">
            <span className="text-sm tracking-widest text-psyche-teal uppercase">
              Featured Release
            </span>
          </div>
          <h2
            className="mb-16 text-center text-4xl font-bold text-text-primary md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Collapse Recursion
          </h2>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Book cover with shimmer and glow */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex justify-center"
            >
              <div className="glow-purple relative overflow-hidden rounded-2xl group cursor-pointer shadow-2xl shadow-psyche-violet/20">
                <Image
                  src="https://assets.lulu.com/cover_thumbs/g/j/gjpe5ee-front-shortedge-384.jpg"
                  alt="Collapse Recursion: The Logic of Coherence"
                  width={384}
                  height={500}
                  className="rounded-2xl transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>

            {/* Book details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3
                className="mb-2 text-3xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The Logic of Coherence
              </h3>
              <p className="mb-6 text-text-accent">by Shawn Cummings</p>

              <p className="mb-6 text-lg leading-relaxed text-text-secondary">
                A systematic framework for identifying and dismantling
                incoherence at its root. This work integrates neuromelanin
                biology, sacred geometry, and the Enneagram to reveal how
                recursive intelligence emerges through removing distortions
                imposed by flawed institutional systems.
              </p>

              <div className="mb-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Pages", value: "482" },
                  { label: "Format", value: "Paperback" },
                  { label: "ISBN", value: "9798994854402" },
                  { label: "Category", value: "Personal Growth" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="rounded-xl bg-celestial-800/40 p-4 border border-white/5"
                  >
                    <p className="text-xs tracking-wider text-psyche-teal uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1 font-semibold text-text-primary">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <span className="text-3xl font-bold text-psyche-gold">
                  $36.00
                </span>
                <a
                  href="https://www.barnesandnoble.com/w/collapse-recursion-shawn-cummings/1149520866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-8 py-3 font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-psyche-gold/10"
                >
                  Order Paperback
                </a>
                <a
                  href="https://payhip.com/VinesConnection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-psyche-teal/50 px-8 py-3 text-psyche-teal transition-all hover:bg-psyche-teal/10 active:scale-95"
                >
                  Digital Editions
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Topics / Pillars Section */}
      <section className="border-t border-border py-24 bg-celestial-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="mb-4 text-center">
            <span className="text-sm tracking-widest text-psyche-gold uppercase">
              Core Pillars
            </span>
            <h2
              className="mt-4 mb-16 text-4xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What We Explore
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              {
                title: "Neuromelanin Biology",
                description:
                  "Understanding human melanin as an instrument of intelligence &mdash; the biological substrate of recursive awareness and coherent perception.",
                color: "from-psyche-teal to-celestial-400",
                glow: "glow-teal",
              },
              {
                title: "Sacred Geometry",
                description:
                  "The mathematical language of creation. Geometric patterns as the architecture of consciousness, from Platonic solids to fractal recursion.",
                color: "from-psyche-gold to-psyche-coral",
                glow: "glow-gold",
              },
              {
                title: "The Enneagram",
                description:
                  "Mapping personality structures to identify distortions and unlock recursive self-knowledge. Beyond typology &mdash; a tool for coherence.",
                color: "from-psyche-violet to-psyche-magenta",
                glow: "glow-purple",
              },
            ].map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`gradient-card rounded-2xl p-8 transition-shadow duration-300 ${pillar.glow} cursor-default`}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="border-t border-border py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center">
            <span className="text-sm tracking-widest text-psyche-teal uppercase">
              Peer-Reviewed Work
            </span>
            <h2
              className="mt-4 mb-16 text-4xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Published Research
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-3xl"
          >
            <div className="gradient-card glow-teal rounded-2xl p-8 md:p-10 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-psyche-teal/5 blur-3xl animate-pulse" />
              
              <p className="relative z-10 mb-8 text-lg leading-relaxed text-text-secondary">
                Research spanning MC1R genetics, melanin biochemistry,
                neuromelanin function, and Collapse Recursion Theory &mdash;
                published and archived through CERN&apos;s Zenodo repository.
              </p>

              <div className="mb-8 flex items-center gap-4 rounded-xl bg-celestial-800/40 px-6 py-5 border border-white/5">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/06/ORCID_iD.svg"
                  alt="ORCID"
                  width={32}
                  height={32}
                  unoptimized
                />
                <div>
                  <p className="text-xs tracking-wider text-psyche-teal uppercase font-semibold">
                    ORCID Profile
                  </p>
                  <p className="font-mono text-sm text-text-primary mt-1">
                    0009-0006-4312-526X
                  </p>
                </div>
              </div>

              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                {[
                  "MC1R Genetics & Classification",
                  "Melanin Biochemistry",
                  "Neuromelanin & Coherence",
                  "Collapse Recursion Theory",
                ].map((area, idx) => (
                  <motion.div
                    key={area}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-center gap-3 text-sm text-text-secondary"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-psyche-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                    <span>{area}</span>
                  </motion.div>
                ))}
              </div>

              <a
                href="https://orcid.org/0009-0006-4312-526X"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-gold inline-flex rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-10 py-4 font-semibold text-celestial-900 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                View Full Repository
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Etheric University Section */}
      <section id="university" className="border-t border-border py-24 bg-celestial-900/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center">
            <span className="text-sm tracking-widest text-psyche-violet uppercase">
              Learning Platform
            </span>
            <h2
              className="mt-4 mb-16 text-4xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Etheric University
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl"
          >
            <div className="gradient-card glow-purple rounded-3xl p-10 md:p-12 text-center border border-white/5">
              <p className="mb-10 text-xl leading-relaxed text-text-secondary">
                A learning platform built on a new paradigm. Explore history,
                mathematics, and science through a lens that expands knowledge
                infinitely &mdash; no ceilings, no boundaries, just recursive
                understanding.
              </p>

              <a
                href="https://collapse-recursion.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-gold inline-flex rounded-full bg-gradient-to-r from-psyche-violet to-psyche-teal px-12 py-5 text-xl font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-2xl"
              >
                Enter University
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero relative overflow-hidden py-32 border-t border-white/5">
        <div className="orb left-[20%] top-[10%] h-48 w-48 bg-psyche-gold/20" />
        <div
          className="orb right-[10%] bottom-[20%] h-56 w-56 bg-psyche-teal/15"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2
              className="mb-8 text-4xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Begin the Recursive Journey
            </h2>
            <p className="mb-12 text-xl text-text-secondary max-w-2xl mx-auto">
              Explore the full catalog of books, digital products, and frameworks
              designed to dismantle incoherence and unlock recursive intelligence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="https://payhip.com/VinesConnection"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-10 py-4 text-xl font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-2xl"
              >
                Browse All Products
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 bg-white/5 px-10 py-4 text-xl text-white transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
