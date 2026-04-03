import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
          {/* Brand badge */}
          <div className="mb-8 rounded-full border border-psyche-gold/30 bg-celestial-800/50 px-6 py-2 backdrop-blur-sm">
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

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            A systematic framework integrating neuromelanin biology, sacred
            geometry, and the Enneagram &mdash; bridging science, philosophy,
            and operational clarity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-8 py-4 text-lg font-semibold text-celestial-900 transition-transform hover:scale-105"
            >
              Explore Products
            </Link>
            <a
              href="https://payhip.com/VinesConnection"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-psyche-teal/50 px-8 py-4 text-lg text-psyche-teal transition-colors hover:bg-psyche-teal/10"
            >
              Visit Store
            </a>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </section>

      {/* Featured Book Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
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
            {/* Book cover */}
            <div className="flex justify-center">
              <div className="glow-purple relative overflow-hidden rounded-2xl">
                <Image
                  src="https://assets.lulu.com/cover_thumbs/g/j/gjpe5ee-front-shortedge-384.jpg"
                  alt="Collapse Recursion: The Logic of Coherence"
                  width={384}
                  height={500}
                  className="rounded-2xl"
                  priority
                />
              </div>
            </div>

            {/* Book details */}
            <div>
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

              <p className="mb-8 leading-relaxed text-text-secondary">
                Part research, part philosophy, part operational manual &mdash;
                it provides methodology rather than demanding belief. 482 pages
                of rigorous exploration across quantum mechanics, geometry,
                self-improvement, religion, philosophy, and science.
              </p>

              {/* Book details grid */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Pages", value: "482" },
                  { label: "Format", value: "Paperback" },
                  { label: "ISBN", value: "9798994854402" },
                  { label: "Category", value: "Personal Growth" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-celestial-800/40 p-4"
                  >
                    <p className="text-xs tracking-wider text-psyche-teal uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1 font-semibold text-text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-3xl font-bold text-psyche-gold">
                  $36.00
                </span>
                <a
                  href="https://www.barnesandnoble.com/w/collapse-recursion-shawn-cummings/1149520866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-6 py-3 font-semibold text-celestial-900 transition-transform hover:scale-105"
                >
                  Order Paperback
                </a>
                <a
                  href="https://payhip.com/VinesConnection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-psyche-teal/50 px-6 py-3 text-psyche-teal transition-colors hover:bg-psyche-teal/10"
                >
                  Digital Editions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics / Pillars Section */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm tracking-widest text-psyche-gold uppercase">
              Core Pillars
            </span>
          </div>
          <h2
            className="mb-16 text-center text-4xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What We Explore
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
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
              <div
                key={pillar.title}
                className={`gradient-card rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] ${pillar.glow}`}
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
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm tracking-widest text-psyche-teal uppercase">
              Peer-Reviewed Work
            </span>
          </div>
          <h2
            className="mb-16 text-center text-4xl font-bold text-text-primary md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Published Research
          </h2>

          <div className="mx-auto max-w-3xl">
            <div className="gradient-card glow-teal rounded-2xl p-8 md:p-10">
              <p className="mb-6 text-lg leading-relaxed text-text-secondary">
                Research spanning MC1R genetics, melanin biochemistry,
                neuromelanin function, and Collapse Recursion Theory &mdash;
                published and archived through CERN&apos;s Zenodo repository.
              </p>

              <div className="mb-8 flex items-center gap-3 rounded-xl bg-celestial-800/40 px-5 py-4">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/06/ORCID_iD.svg"
                  alt="ORCID"
                  width={24}
                  height={24}
                  unoptimized
                />
                <div>
                  <p className="text-xs tracking-wider text-psyche-teal uppercase">
                    ORCID
                  </p>
                  <p className="font-mono text-sm text-text-primary">
                    0009-0006-4312-526X
                  </p>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4">
                {[
                  "MC1R Genetics & Biological Classification",
                  "Melanin Biochemistry & Carbon Substrates",
                  "Neuromelanin & Neurological Coherence",
                  "Collapse Recursion Theory",
                ].map((area) => (
                  <div
                    key={area}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-psyche-gold" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://orcid.org/0009-0006-4312-526X"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-gold inline-flex rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-6 py-3 font-semibold text-celestial-900 transition-transform hover:scale-105"
              >
                View Research Papers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero relative overflow-hidden py-24">
        <div className="orb left-[20%] top-[10%] h-48 w-48 bg-psyche-gold/20" />
        <div
          className="orb right-[10%] bottom-[20%] h-56 w-56 bg-psyche-teal/15"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2
            className="mb-6 text-4xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Begin the Recursive Journey
          </h2>
          <p className="mb-10 text-lg text-text-secondary">
            Explore the full catalog of books, digital products, and frameworks
            designed to dismantle incoherence and unlock recursive intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://payhip.com/VinesConnection"
              target="_blank"
              rel="noopener noreferrer"
              className="glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-8 py-4 text-lg font-semibold text-celestial-900 transition-transform hover:scale-105"
            >
              Browse All Products
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-text-secondary/30 px-8 py-4 text-lg text-text-secondary transition-colors hover:border-psyche-gold hover:text-psyche-gold"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
