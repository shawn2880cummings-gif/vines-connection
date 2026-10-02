import type { Metadata } from "next";
import HomeFeed from "@/components/community/HomeFeed";

export const metadata: Metadata = {
  title: "Community | Vines Connection",
  description:
    "A space to share insights on spirituality, consciousness, and quantum mechanics — photos, videos, stories, and conversation.",
};

export default function CommunityPage() {
  return (
    <>
      <section className="mx-auto mb-8 max-w-2xl text-center">
        <span className="section-index">// The Circle</span>
        <h1
          className="mt-4 text-5xl font-bold leading-[1.05] text-text-primary md:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Share the <span className="gradient-text">Awakening</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-text-secondary">
          Spirituality meets quantum mechanics. Share a thought, a photo, a video, or a 24-hour
          story — follow people, and see what others are discovering.
        </p>
      </section>
      <HomeFeed />
    </>
  );
}
