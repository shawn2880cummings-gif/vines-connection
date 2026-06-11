import type { Metadata } from "next";
import Link from "next/link";
import { presentations } from "@/lib/presentations";

export const metadata: Metadata = {
  title: "Presentations | Vines Connection",
  description:
    "Explore presentations from Vines Connection in an immersive 3D slide experience.",
};

export default function PresentationsPage() {
  return (
    <div className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="section-index">// Presentations</span>
          <h1
            className="mt-4 text-4xl font-bold text-text-primary md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The <span className="gradient-text">Deck Room</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Step into each presentation — slides curve around you in 3D. Pick one
            to begin.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {presentations.map((p) => (
            <Link
              key={p.slug}
              href={`/presentations/${p.slug}`}
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-psyche-teal/50 group-hover:shadow-[0_0_50px_rgba(32,201,176,0.25)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${p.dir}/slide-01.jpg`}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-psyche-gold backdrop-blur-sm">
                  {p.slideCount} slides
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center gap-3">
                  <h2
                    className="text-xl font-bold text-text-primary transition-colors group-hover:text-psyche-gold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {p.title}
                  </h2>
                  {p.year && (
                    <span className="font-mono text-xs text-text-secondary/60">
                      {p.year}
                    </span>
                  )}
                </div>
                {p.subtitle && (
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {p.subtitle}
                  </p>
                )}
                {p.tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
