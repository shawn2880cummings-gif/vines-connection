import type { Metadata } from "next";
import BecomeArchitectButton from "@/components/BecomeArchitectButton";

export const metadata: Metadata = {
  title: "Architects of Reality | Vines Connection",
  description:
    "A private membership and inner circle: weekly live classes, a members-only podcast, a private Discord community, and early access to new work. $36/month.",
};

const included = [
  {
    title: "Weekly Live Classes",
    body: "A live class every week — Vine teaching the framework and answering your questions in real time. Recordings stay in the members area so you never miss one.",
    accent: "#ff6b6b",
  },
  {
    title: "The Members Podcast",
    body: "A new members-only episode every week — the research unpacked in audio you won't find anywhere else.",
    accent: "#f0a830",
  },
  {
    title: "Private Discord Community",
    body: "The inner circle. A members-only Discord to think alongside other Architects and reach Vine directly, between the classes.",
    accent: "#5a3cb8",
  },
  {
    title: "Architects First",
    body: "Early access to new books, decks, and tools before they go public — members see the work first.",
    accent: "#e83e8c",
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
            We&apos;ll email you your Discord invite and class schedule shortly.
          </p>
        </div>
      )}

      {/* Hero — the core offer in one breath */}
      <section className="mx-auto max-w-3xl text-center">
        <span className="section-index">// Membership</span>
        <h1
          className="mt-4 text-5xl font-bold leading-[1.05] text-text-primary md:text-7xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Architects of <span className="gradient-text">Reality</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
          A private inner circle for those building coherence from the ground
          up — weekly live classes, a members podcast, and a community studying
          the work together.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="text-4xl font-bold text-psyche-gold">
            $36
            <span className="text-lg font-normal text-text-secondary"> / month</span>
          </div>
          <BecomeArchitectButton />
          <p className="text-xs uppercase tracking-widest text-text-secondary/50">
            Cancel anytime
          </p>
        </div>
      </section>

      {/* What's included — now the whole offer */}
      <section className="mx-auto mt-28 max-w-5xl">
        <h2
          className="mb-14 text-center text-3xl font-bold text-text-primary md:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Included with your membership
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          {included.map((b) => (
            <div key={b.title}>
              <div
                className="mb-4 h-1 w-16 rounded-full"
                style={{ background: b.accent }}
              />
              <h3
                className="mb-3 text-2xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {b.title}
              </h3>
              <p className="leading-relaxed text-text-secondary">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Single, decisive close */}
      <section className="mx-auto mt-28 max-w-2xl text-center">
        <h2
          className="mb-3 text-3xl font-bold text-text-primary md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Become an <span className="gradient-text">Architect</span>
        </h2>
        <p className="mb-8 text-lg text-text-secondary">
          A weekly room, a private community, and the work first — for
          $36/month.
        </p>
        <BecomeArchitectButton />
        <p className="mt-3 text-xs uppercase tracking-widest text-text-secondary/50">
          Cancel anytime
        </p>
      </section>
    </div>
  );
}
