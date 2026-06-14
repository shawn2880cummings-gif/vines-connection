"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import OrbitCarousel, { type Pillar } from "@/components/cinematic/OrbitCarousel";
import LeadMagnet, { GROUPS } from "@/components/LeadMagnet";

const pillars: Pillar[] = [
  {
    title: "The PAIN Network",
    description:
      "Pain, Personality &amp; Identity &mdash; a neurobiological model where every behavior is the output of a six-stage recursive cycle, and the &ldquo;Observer gap&rdquo; is the one place you can consciously intervene.",
    color: "from-psyche-coral to-psyche-magenta",
    glow: "glow-purple",
  },
  {
    title: "The Melanin Circuit",
    description:
      "Human melanin as an instrument of intelligence &mdash; the biological substrate of recursive awareness, coherence, and the electromagnetic architecture of perception.",
    color: "from-psyche-teal to-celestial-400",
    glow: "glow-teal",
  },
  {
    title: "Collapse Recursion",
    description:
      "The logic of coherence &mdash; a systematic method for tracing and dismantling distortion across systems, generations, and the self to reveal recursive intelligence.",
    color: "from-psyche-gold to-psyche-coral",
    glow: "glow-gold",
  },
];

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 44, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as any }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
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
              className="mb-8 max-w-5xl text-6xl leading-[1.05] font-bold md:text-8xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Dismantle Incoherence.{" "}
              <span className="gradient-text">Discover Recursion.</span>
            </h1>

            <p className="mb-10 mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              A systematic framework integrating the PAIN Network, the Melanin
              Circuit, and Collapse Recursion &mdash; bridging science,
              philosophy, and operational clarity.
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
      </section>

      {/* Featured Book Section */}
      <section className="relative py-32 overflow-hidden">
        <motion.div 
          {...fadeInUp}
          className="mx-auto max-w-7xl px-6"
        >
          <div className="mb-4 text-center">
            <span className="section-index">// 01 &mdash; The Work</span>
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

      {/* Email capture — free ebook (under the book, above What We Explore) */}
      <LeadMagnet groupId={GROUPS.ebook} />

      {/* Topics / Pillars Section */}
      <section className="border-t border-border py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="mb-16 text-center">
            <span className="section-index">// 02 &mdash; The Framework</span>
            <h2
              className="mt-4 text-4xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What We Explore
            </h2>
          </motion.div>

          <OrbitCarousel pillars={pillars} />
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="border-t border-border py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center">
            <span className="section-index">// 03 &mdash; The Research</span>
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
            <div className="gradient-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-psyche-teal/5 blur-3xl animate-pulse" />
              
              <p className="relative z-10 mb-8 text-lg leading-relaxed text-text-secondary">
                Research spanning MC1R genetics, melanin biochemistry,
                neuromelanin function, and Collapse Recursion Theory &mdash;
                published and archived through CERN&apos;s Zenodo repository.
              </p>

              <div className="mb-8 flex items-center gap-4">
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
                  <a
                    href="https://orcid.org/0009-0006-4312-526X"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block break-all font-mono text-sm text-psyche-teal underline decoration-dotted underline-offset-4 transition-colors hover:text-psyche-gold"
                  >
                    https://orcid.org/0009-0006-4312-526X
                  </a>
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
      <section id="university" className="border-t border-border py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center">
            <span className="section-index">// 04 &mdash; The University</span>
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
            <div className="gradient-card rounded-3xl p-10 md:p-12 text-center">
              <p className="mb-10 text-xl leading-relaxed text-text-secondary">
                A learning platform built on a new paradigm. Explore history,
                mathematics, and science through a lens that expands knowledge
                infinitely &mdash; no ceilings, no boundaries, just recursive
                understanding.
              </p>

              <Link
                href="/university"
                className="glow-gold inline-flex rounded-full bg-gradient-to-r from-psyche-violet to-psyche-teal px-12 py-5 text-xl font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-2xl [text-shadow:none]"
              >
                Begin Your Spiral
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Presentations Section */}
      <section className="border-t border-border py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="section-index">// 05 &mdash; The Deck Room</span>
            <h2
              className="mt-4 mb-8 text-4xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="gradient-text">Presentations</span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-text-secondary">
              Step inside the research. Full visual presentations &mdash; like{" "}
              <em>The Eumelanin Standard</em> &mdash; rendered as immersive 3D
              decks.
            </p>
            <Link
              href="/presentations"
              className="glow-teal inline-flex rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-12 py-5 text-xl font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-2xl [text-shadow:none]"
            >
              Enter the Deck Room
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Architects of Reality (Membership) Section */}
      <section className="border-t border-border py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="section-index">// 06 &mdash; Membership</span>
            <h2
              className="mt-4 mb-8 text-4xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Architects of <span className="gradient-text">Reality</span>
            </h2>
            <p className="mx-auto mb-4 max-w-2xl text-xl leading-relaxed text-text-secondary">
              A private membership with a research AI that lives entirely inside
              Shawn&apos;s work &mdash; cited, grounded, members-only.
            </p>
            <p className="mb-10 text-2xl font-bold text-psyche-gold">
              $36 <span className="text-base font-normal text-text-secondary">/ month</span>
            </p>
            <Link
              href="/architects"
              className="glow-gold inline-flex rounded-full bg-gradient-to-r from-psyche-gold to-psyche-magenta px-12 py-5 text-xl font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-2xl [text-shadow:none]"
            >
              Become an Architect
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
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
                className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-10 py-4 text-xl font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 shadow-2xl [text-shadow:none]"
              >
                Browse All Products
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative px-6 py-32 text-center [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
      >
        <motion.div
          {...fadeInUp}
          className="mx-auto max-w-2xl"
        >
          <span className="section-index">// Contact</span>
          <h2
            className="mt-4 mb-6 text-4xl font-bold text-text-primary md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="mb-8 text-lg text-text-secondary">
            Questions, collaborations, or media inquiries &mdash; reach out
            directly.
          </p>
          <a
            href="mailto:wisdom@vinesconnection.info"
            className="glow-gold inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-8 py-4 text-lg font-semibold text-celestial-900 transition-all hover:scale-105 active:scale-95 [text-shadow:none]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            wisdom@vinesconnection.info
          </a>
        </motion.div>
      </section>
    </>
  );
}
