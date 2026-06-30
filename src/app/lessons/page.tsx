import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lessons for Kids | Vines Connection",
  description:
    "Big science made for young explorers. Interactive quests through the research — collect crystals, learn, and play.",
};

const lessons = [
  {
    title: "Magnet Quest",
    emoji: "🧲",
    tagline: "Tiny Magnets in Your Brain!",
    description:
      "Your brain builds real working magnets — and the superpower started 3.5 billion years ago with tiny bacteria. Collect the crystals, beat the quiz, become a Magnet Master.",
    href: "/lessons/magnet-quest.html",
    level: "Ages 8+",
    accent: "#00f0ff",
  },
];

export default function LessonsPage() {
  return (
    <div className="min-h-screen px-6 pt-32 pb-28 [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]">
      <section className="mx-auto max-w-3xl text-center">
        <span className="section-index">// For Young Explorers</span>
        <h1
          className="mt-4 text-5xl font-bold leading-[1.05] text-text-primary md:text-7xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Lessons for <span className="gradient-text">Kids</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl">
          Big science, made for young explorers. Pick a quest, collect the
          crystals, and discover how amazing your body really is.
        </p>
      </section>

      <section className="mx-auto mt-20 max-w-4xl">
        <div className="grid gap-8 sm:grid-cols-2">
          {lessons.map((l) => (
            <a
              key={l.title}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-psyche-teal/50 hover:shadow-[0_0_50px_rgba(32,201,176,0.2)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-5xl">{l.emoji}</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-text-secondary">
                  {l.level}
                </span>
              </div>
              <h2
                className="text-2xl font-bold text-text-primary transition-colors group-hover:text-psyche-teal"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {l.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-psyche-gold">
                {l.tagline}
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                {l.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-6 py-3 font-semibold text-celestial-900 transition-transform group-hover:scale-105 [text-shadow:none]">
                Begin Quest →
              </span>
            </a>
          ))}

          {/* Placeholder for the next lesson */}
          <div className="flex items-center justify-center rounded-3xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm uppercase tracking-widest text-text-secondary/50">
              More quests coming soon ✦
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
