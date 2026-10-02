"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PostView } from "@/lib/community";
import PostCard from "./PostCard";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";

export default function PostDetail({ id }: { id: string }) {
  const { ready, me } = useCommunity();
  const [post, setPost] = useState<PostView | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "gone">("loading");

  useEffect(() => {
    if (!ready) return;
    call(`/api/community/${id}`).then((r) => {
      if (r.ok) {
        setPost(r.data.post);
        setState("ok");
      } else setState("gone");
    });
  }, [id, ready, me?.username]);

  if (state === "loading") return <p className="py-10 text-center text-text-secondary">Loading…</p>;
  if (state === "gone" || !post)
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-white/15 p-10 text-center text-text-secondary">
        This post isn&apos;t available.{" "}
        <Link href="/community" className="text-psyche-teal underline">
          Back to the feed
        </Link>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-xl">
      <PostCard post={post} detail onChange={setPost} onRemove={() => setState("gone")} />
    </div>
  );
}
