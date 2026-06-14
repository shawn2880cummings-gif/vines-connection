import type { Metadata } from "next";
import BecomeArchitectButton from "@/components/BecomeArchitectButton";

export const metadata: Metadata = {
  title: "Architects of Reality | Vines Connection",
  description:
    "A private membership: a research AI grounded only in Shawn Cummings' books and papers, weekly live classes, and a private Discord community. $36/month.",
};

const benefits = [
  {
    title: "The Private Research AI",
    body: "A grounded intelligence trained only on Shawn Cummings' books and research papers. Ask anything across the corpus — every answer is cited and stays strictly inside the work.",
    accent: "#20c9b0",
  },
  {
    title: "Voice & Text Study",
    body: "Speak or type. Explore the framework hands-free — a dialogue with the body of work itself.",
    accent: "#f0a830",
  },
  {
    title: "The Whole Corpus, Connected",
    body: "Dozens of books and research papers, cross-referenced — answers draw the threads between them, never from the outside.",
    accent: "#9b59b6",
  },
  {
    title: "Weekly Live Classes",
    body: "Go deeper every week. Live sessions with Shawn — teaching, Q&A, and working through the framework together in real time.",
    accent: "#ff6b6b",
  },
  {
    title: "Private Discord Community",
    body: "A members-only Discord — the inner circle. Connect with fellow Architects and with Shawn directly, between the classes.",
    accent: "#5a3cb8",
  },
  {
    title: "Architects First",
    body: "New work, decks, and tools reach members before anyone else.",
    accent: "#e83e8c",
  },
];

const faqs = [
  {
    q: "What can the AI answer?",
    a: "Only what is in Shawn's documented research. If something isn't covered in the work, it tells you plainly — it never invents or pulls from the outside.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Your membership is month-to-month and you can cancel whenever you like.",
  },
  {
    q: "Is my access private?",
    a: "Yes — the research AI is members-only, reserved for Architects.",
  },
];

export default async function ArchitectsPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const { subscribed } = await searchParams;

  return (
    <div className="min-h-screen px-6 pt-32 pb-28 [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]">
      {subscribed && (
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-psyche-teal/40 bg-psyche-teal/10 px-6 py-5 text-center">
          <p className="font-semibold text-psyche-teal">
            Welcome, Architect. Your membership is active.
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Your private research AI access is being set up — we&apos;ll email
            you shortly.
          </p>
        </div>
      )}

      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <span className="section-index">// Membership</span>
        <h1
          className="mt-4 text-5xl font-bold leading-[1.05] text-text-primary md:text-7xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Architects of <span className="gradient-text">Reality</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl">
          A private chamber for those building coherence from the ground up —
          and a research intelligence that lives entirely inside the work.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="text-4xl font-bold text-psyche-gold">
            $36
            <span className="text-lg font-normal text-text-secondary">
              {" "}
              / month
            </span>
          </div>
          <BecomeArchitectButton />
          <p className="text-xs uppercase tracking-widest text-text-secondary/50">
            Cancel anytime
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto mt-28 max-w-5xl">
        <div className="grid gap-10 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title}>
              <div
                className="mb-4 h-1 w-16 rounded-full"
                style={{ background: b.accent }}
              />
              <h2
                className="mb-3 text-2xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {b.title}
              </h2>
              <p className="leading-relaxed text-text-secondary">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-28 max-w-2xl">
        <h2
          className="mb-10 text-center text-3xl font-bold text-text-primary md:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="mb-2 text-lg font-semibold text-psyche-teal">
                {f.q}
              </h3>
              <p className="leading-relaxed text-text-secondary">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-28 max-w-2xl text-center">
        <h2
          className="mb-6 text-3xl font-bold text-text-primary md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Build with <span className="gradient-text">conviction</span>.
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-lg text-text-secondary">
          Step inside the work and study it directly — in your own words, in
          your own voice.
        </p>
        <BecomeArchitectButton />
      </section>
    </div>
  );
}
