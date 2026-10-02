"use client";

import Link from "next/link";
import FeedList from "./FeedList";

export default function TagFeed({ tag }: { tag: string }) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-md">
        <p className="text-4xl font-bold text-psyche-teal">#{tag}</p>
        <Link href="/community/search" className="mt-2 inline-block text-sm text-text-secondary hover:text-text-primary">
          ← Search more tags
        </Link>
      </div>
      <FeedList endpoint={`/api/community?tag=${tag}`} reloadKey={tag} empty={`No posts tagged #${tag} yet.`} />
    </div>
  );
}
