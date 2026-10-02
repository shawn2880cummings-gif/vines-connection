import type { Metadata } from "next";
import CommunityFeed from "@/components/CommunityFeed";

export const metadata: Metadata = {
  title: "Community | Vines Connection",
  description:
    "A space to share insights on spirituality, consciousness, and quantum mechanics — photos, thoughts, and conversation.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen px-4 pt-32 pb-28 [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]">
      <section className="mx-auto mb-10 max-w-2xl text-center">
        <span className="section-index">// The Circle</span>
        <h1
          className="mt-4 text-5xl font-bold leading-[1.05] text-text-primary md:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Share the <span className="gradient-text">Awakening</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-text-secondary">
          Spirituality meets quantum mechanics. Post a thought, a photo, a question — and see what
          others are discovering.
        </p>
      </section>
      <CommunityFeed />
    </div>
  );
}
