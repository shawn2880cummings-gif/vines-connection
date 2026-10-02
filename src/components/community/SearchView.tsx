"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PersonView } from "@/lib/community";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";

type Tag = { tag: string; count: number };

export default function SearchView() {
  const { ready, me } = useCommunity();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<PersonView[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(async () => {
      setLoading(true);
      const r = await call(`/api/community/search?q=${encodeURIComponent(q.trim())}`);
      setUsers(r.data.users || []);
      setTags(r.data.tags || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q, ready, me?.username]);

  const searching = q.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-xl">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
        autoCapitalize="none"
        placeholder="Search people or #tags"
        className="mb-6 w-full rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
      />

      {users.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">People</h2>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-1 backdrop-blur-md">
            {users.map((p) => (
              <div key={p.username} className="flex items-center gap-3 py-3">
                <Link href={`/community/u/${p.username}`}>
                  <Avatar url={p.avatar} name={p.name} size={44} />
                </Link>
                <Link href={`/community/u/${p.username}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{p.name}</p>
                  <p className="truncate text-xs text-text-secondary">@{p.username}{p.bio ? ` · ${p.bio}` : ""}</p>
                </Link>
                {!p.isMe && <FollowButton username={p.username} following={p.following} small />}
              </div>
            ))}
          </div>
        </section>
      )}

      {(tags.length > 0 || !searching) && (
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">{searching ? "Tags" : "Popular tags"}</h2>
          {tags.length === 0 ? (
            <p className="px-1 text-sm text-text-secondary">No tags yet — add #hashtags to your posts and they&apos;ll show up here.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link key={t.tag} href={`/community/tag/${t.tag}`} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-text-primary hover:border-psyche-teal/60">
                  <span className="text-psyche-teal">#{t.tag}</span> <span className="text-xs text-text-secondary">{t.count}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {searching && !loading && users.length === 0 && tags.length === 0 && (
        <p className="py-10 text-center text-text-secondary">Nothing found for “{q.trim()}”.</p>
      )}
    </div>
  );
}
