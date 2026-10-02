"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PostView, ProfileView as Profile } from "@/lib/community";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import PeopleModal from "./PeopleModal";
import RichText from "./RichText";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";

const TILE_GRADIENT: Record<string, string> = {
  spirit: "from-[#2b1055] to-[#20c9b0]",
  quantum: "from-[#0f2027] to-[#20c9b0]",
  consciousness: "from-[#41295a] to-[#e83e8c]",
  meditation: "from-[#134e5e] to-[#a8e06c]",
  science: "from-[#141e30] to-[#f0a830]",
  geometry: "from-[#1d2671] to-[#f0a830]",
};

export function PostGrid({ endpoint, empty }: { endpoint: string; empty: string }) {
  const { ready } = useCommunity();
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [next, setNext] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (before: number | null) => {
      setLoading(true);
      const sep = endpoint.includes("?") ? "&" : "?";
      const r = await call(`${endpoint}${before !== null ? `${sep}before=${before}` : ""}`);
      setLoading(false);
      const got: PostView[] = r.data.posts || [];
      setPosts((p) => (before !== null && p ? [...p, ...got] : got));
      setNext(r.data.next ?? null);
    },
    [endpoint]
  );

  useEffect(() => {
    if (!ready) return;
    setPosts(null);
    load(null);
  }, [ready, load]);

  if (posts === null) return <p className="py-10 text-center text-text-secondary">Loading…</p>;
  if (!posts.length) return <p className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-text-secondary">{empty}</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-2xl">
        {posts.map((p) => (
          <Link key={p.id} href={`/community/p/${p.id}`} className="relative aspect-square overflow-hidden bg-black/40">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : p.video?.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.video.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br p-2 text-center ${TILE_GRADIENT[p.topic] || TILE_GRADIENT.spirit}`}>
                <span className="line-clamp-4 text-[11px] font-medium leading-tight text-white">{p.video ? "🎬" : p.text}</span>
              </div>
            )}
            {p.video && <span className="absolute right-1.5 top-1.5 text-sm drop-shadow">🎬</span>}
            <span className="absolute bottom-1 left-1.5 text-[11px] font-semibold text-white drop-shadow">❤️ {p.likeCount}</span>
          </Link>
        ))}
      </div>
      {next !== null && (
        <button onClick={() => load(next)} disabled={loading} className="mx-auto mt-5 block rounded-full border border-white/20 px-6 py-2.5 text-sm text-text-primary hover:border-psyche-teal/60 disabled:opacity-60">
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}

export default function ProfileView({ username }: { username: string }) {
  const { me, ready } = useCommunity();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [missing, setMissing] = useState(false);
  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const [people, setPeople] = useState<null | "followers" | "following">(null);

  useEffect(() => {
    if (!ready) return;
    call(`/api/community/users/${username}`).then((r) => {
      if (r.ok) setProfile(r.data.profile);
      else setMissing(true);
    });
  }, [username, ready, me?.username]);

  if (missing)
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-white/15 p-10 text-center text-text-secondary">
        We couldn&apos;t find <b>@{username}</b>.{" "}
        <Link href="/community/search" className="text-psyche-teal underline">
          Search people
        </Link>
      </div>
    );
  if (!profile) return <p className="py-10 text-center text-text-secondary">Loading…</p>;

  const stat = (n: number, label: string, onClick?: () => void) => (
    <button onClick={onClick} disabled={!onClick} className="text-center disabled:cursor-default">
      <span className="block text-lg font-bold text-text-primary">{n}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-xl">
      <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <Avatar url={profile.avatar} name={profile.name} size={84} />
          <div className="grid flex-1 grid-cols-3 gap-2">
            {stat(profile.postCount, "posts")}
            {stat(profile.followerCount, "followers", () => setPeople("followers"))}
            {stat(profile.followingCount, "following", () => setPeople("following"))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg font-bold text-text-primary">{profile.name}</p>
          <p className="text-sm text-text-secondary">
            @{profile.username}
            {profile.followsMe && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">Follows you</span>}
          </p>
          {profile.bio && (
            <p className="mt-2 text-[15px] leading-relaxed text-text-primary">
              <RichText text={profile.bio} />
            </p>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          {profile.isMe ? (
            <Link href="/community/settings" className="flex-1 rounded-full border border-white/25 py-2 text-center text-sm font-semibold text-text-primary hover:border-psyche-teal/60">
              Edit profile
            </Link>
          ) : (
            <FollowButton
              key={profile.username + String(profile.following)}
              username={profile.username}
              following={profile.following}
              onChange={(f, c) => setProfile((p) => (p ? { ...p, following: f, ...c } : p))}
            />
          )}
        </div>
      </section>

      {profile.isMe && (
        <div className="mb-5 flex rounded-full border border-white/10 bg-white/[0.04] p-1">
          {(["posts", "saved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-white/15 text-text-primary" : "text-text-secondary"}`}
            >
              {t === "posts" ? "▦ Posts" : "🔖 Saved"}
            </button>
          ))}
        </div>
      )}

      {tab === "saved" && profile.isMe ? (
        <PostGrid endpoint="/api/community/saved" empty="Nothing saved yet — tap the tag on a post to keep it here." />
      ) : (
        <PostGrid endpoint={`/api/community/users/${profile.username}/posts`} empty={profile.isMe ? "You haven't posted yet." : "No posts yet."} />
      )}

      {people && <PeopleModal username={profile.username} kind={people} onClose={() => setPeople(null)} />}
    </div>
  );
}
