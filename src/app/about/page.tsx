import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Vines Connection",
  description:
    "Learn about Shawn Cummings and the Vines Connection mission — bridging biology, geometry, and recursive intelligence.",
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="gradient-hero relative overflow-hidden py-24">
        <div className="orb left-[15%] top-[10%] h-56 w-56 bg-psyche-teal/15" />
        <div
          className="orb right-[20%] bottom-[20%] h-48 w-48 bg-psyche-magenta/10"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-psyche-gold uppercase">
            The Mission
          </span>
          <h1
            className="mb-6 text-5xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About Vines Connection
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          {/* Author section */}
          <div className="gradient-card mb-12 rounded-2xl p-8 md:p-12">
            <div className="mb-2 h-1 w-16 rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal" />
            <h2
              className="mb-6 text-3xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shawn Cummings
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                Author, researcher, and independent thinker working at the
                intersection of neuromelanin biology, sacred geometry, the
                Enneagram, and systems philosophy.
              </p>
              <p>
                The work presented through Vines Connection represents years of
                cross-disciplinary study and synthesis — connecting threads that
                institutional frameworks have left fragmented. The goal is not
                to create new belief systems, but to provide operational
                methodology for coherent perception.
              </p>
              <p>
                &ldquo;Collapse Recursion: The Logic of Coherence&rdquo; is the
                flagship work — a 482-page framework that maps the architecture
                of incoherence and provides tools for dismantling it at the
                root.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="mb-12">
            <h2
              className="mb-6 text-3xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The Vision
            </h2>
            <div className="space-y-4 leading-relaxed text-text-secondary">
              <p>
                Vines Connection exists to bridge the gap between what we are
                told about ourselves and what we can verify through direct
                investigation. The name itself reflects the interconnected
                nature of knowledge — branches and roots that form a living
                network of coherence.
              </p>
              <p>
                Every product in this catalog serves one purpose: to provide
                frameworks and tools that help individuals identify distortions,
                remove incoherence, and unlock the recursive intelligence that
                is already present but obscured.
              </p>
            </div>
          </div>

          {/* Core Areas */}
          <div>
            <h2
              className="mb-8 text-3xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Areas of Focus
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Neuromelanin & Biology",
                  text: "Investigating melanin as a biological substrate for intelligence and recursive awareness.",
                },
                {
                  title: "Sacred Geometry",
                  text: "Mathematical patterns as the architecture of consciousness and coherent perception.",
                },
                {
                  title: "Enneagram Systems",
                  text: "Beyond personality typing — mapping ego structures to identify and resolve distortions.",
                },
                {
                  title: "Quantum Philosophy",
                  text: "Where quantum mechanics meets consciousness studies and operational self-knowledge.",
                },
              ].map((area) => (
                <div
                  key={area.title}
                  className="gradient-card rounded-xl p-6"
                >
                  <h3 className="mb-2 font-bold text-psyche-gold">
                    {area.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{area.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
