"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PostView } from "@/lib/community";
import PostCard from "./PostCard";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";

// A paginated list of posts. `endpoint` is the API path (with any fixed query);
// `fresh` are posts just created by the user, shown on top without a reload.
export default function FeedList({
  endpoint,
  empty,
  fresh = [],
  reloadKey = "",
}: {
  endpoint: string;
  empty: React.ReactNode;
  fresh?: PostView[];
  reloadKey?: string;
}) {
  const { ready, me } = useCommunity();
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [next, setNext] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const seq = useRef(0);

  const load = useCallback(
    async (before: number | null, append: boolean) => {
      const mine = ++seq.current;
      setLoading(true);
      const sep = endpoint.includes("?") ? "&" : "?";
      const r = await call(`${endpoint}${before !== null ? `${sep}before=${before}` : ""}`);
      if (mine !== seq.current) return;
      setLoading(false);
      if (!r.ok) {
        setFailed(true);
        setPosts((p) => p || []);
        return;
      }
      setFailed(false);
      setPosts((prev) => (append && prev ? [...prev, ...r.data.posts] : r.data.posts));
      setNext(r.data.next ?? null);
    },
    [endpoint]
  );

  useEffect(() => {
    if (!ready) return;
    setPosts(null);
    load(null, false);
  }, [ready, load, reloadKey, me?.username]);

  const onChange = useCallback((p: PostView) => setPosts((l) => (l ? l.map((x) => (x.id === p.id ? p : x)) : l)), []);
  const onRemove = useCallback((id: string) => setPosts((l) => (l ? l.filter((x) => x.id !== id) : l)), []);

  const shown = posts ? [...fresh.filter((f) => !posts.some((p) => p.id === f.id)), ...posts] : null;

  if (shown === null) return <p className="py-10 text-center text-text-secondary">Opening the feed…</p>;

  return (
    <div>
      {shown.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-text-secondary">
          {failed ? "Couldn't load the feed. Pull to refresh." : empty}
        </div>
      )}
      <div className="space-y-6">
        {shown.map((p) => (
          <PostCard key={p.id} post={p} onChange={onChange} onRemove={onRemove} />
        ))}
      </div>
      {next !== null && (
        <button
          onClick={() => load(next, true)}
          disabled={loading}
          className="mx-auto mt-6 block rounded-full border border-white/20 px-6 py-2.5 text-sm text-text-primary hover:border-psyche-teal/60 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
