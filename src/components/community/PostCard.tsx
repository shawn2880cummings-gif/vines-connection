"use client";

import Link from "next/link";
import { useState } from "react";
import { TOPICS, type PostView } from "@/lib/community";
import Avatar from "./Avatar";
import RichText from "./RichText";
import { call, timeAgo } from "./api";
import { useCommunity } from "./CommunityProvider";

const TOPIC_GRADIENT: Record<string, string> = {
  spirit: "from-[#2b1055] via-[#7597de] to-[#20c9b0]",
  quantum: "from-[#0f2027] via-[#2c5364] to-[#20c9b0]",
  consciousness: "from-[#41295a] via-[#2f0743] to-[#e83e8c]",
  meditation: "from-[#134e5e] via-[#2c7a6b] to-[#a8e06c]",
  science: "from-[#141e30] via-[#243b55] to-[#f0a830]",
  geometry: "from-[#1d2671] via-[#c33764] to-[#f0a830]",
};

export function topicOf(id: string) {
  return TOPICS.find((t) => t.id === id) || TOPICS[0];
}

export default function PostCard({
  post,
  detail = false,
  onChange,
  onRemove,
}: {
  post: PostView;
  detail?: boolean;
  onChange: (p: PostView) => void;
  onRemove: (id: string) => void;
}) {
  const { me, requireLogin } = useCommunity();
  const [menu, setMenu] = useState(false);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [showAll, setShowAll] = useState(false);
  const t = topicOf(post.topic);

  async function act(body: Record<string, unknown>) {
    const r = await call(`/api/community/${post.id}`, "POST", body);
    if (r.status === 401) requireLogin("login");
    if (!r.ok) setMsg(r.data.error || "Something went wrong.");
    else {
      setMsg("");
      if (r.data.hidden) onRemove(post.id);
      else if (r.data.post) onChange(r.data.post);
    }
    return r;
  }

  async function like() {
    if (!requireLogin()) return;
    onChange({ ...post, liked: !post.liked, likeCount: post.likeCount + (post.liked ? -1 : 1) });
    const r = await act({ action: "like" });
    if (!r.ok) onChange(post);
  }

  async function save() {
    if (!requireLogin()) return;
    onChange({ ...post, saved: !post.saved });
    const r = await act({ action: post.saved ? "unsave" : "save" });
    if (!r.ok) onChange(post);
  }

  async function comment() {
    if (!requireLogin()) return;
    const text = draft.trim();
    if (!text) return;
    const r = await act({ action: "comment", text });
    if (r.ok) {
      setDraft("");
      setShowAll(true);
    }
  }

  async function share() {
    const url = `${window.location.origin}/community/p/${post.id}`;
    try {
      if (navigator.share) await navigator.share({ title: `${post.name} on Vines Connection`, url });
      else {
        await navigator.clipboard.writeText(url);
        setMsg("Link copied!");
      }
    } catch {}
  }

  async function report() {
    setMenu(false);
    if (!requireLogin()) return;
    if (!confirm("Report this post as inappropriate?")) return;
    const r = await act({ action: "report" });
    if (r.ok) setMsg("Thanks — we'll take a look.");
  }

  async function remove() {
    setMenu(false);
    if (!confirm("Delete your post?")) return;
    const r = await call(`/api/community/${post.id}`, "DELETE");
    if (r.ok) onRemove(post.id);
  }

  async function saveEdit() {
    const r = await call(`/api/community/${post.id}`, "PATCH", { text: editText });
    if (r.ok && r.data.post) {
      onChange(r.data.post);
      setEditing(false);
      setMsg("");
    } else setMsg(r.data.error || "Could not save.");
  }

  const comments = detail || showAll ? post.comments : post.comments.slice(-2);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
      <header className="flex items-center gap-3 px-4 py-3">
        <Link href={`/community/u/${post.author}`}>
          <Avatar url={post.avatar} name={post.name} size={40} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/community/u/${post.author}`} className="block truncate text-sm font-semibold text-text-primary hover:underline">
            {post.name} <span className="font-normal text-text-secondary">@{post.author}</span>
          </Link>
          <p className="text-xs text-text-secondary">
            <Link href={`/community/p/${post.id}`} className="hover:underline">
              {t.emoji} {t.label} · {timeAgo(post.ts)}
            </Link>
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setMenu((v) => !v)} aria-label="More" className="px-2 text-xl leading-none text-text-secondary">
            ⋯
          </button>
          {menu && (
            <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-2xl border border-white/15 bg-[#0d0f1c] text-sm shadow-2xl">
              {post.mine ? (
                <>
                  <button
                    onClick={() => {
                      setMenu(false);
                      setEditing(true);
                      setEditText(post.text);
                    }}
                    className="block w-full px-4 py-3 text-left text-text-primary hover:bg-white/5"
                  >
                    Edit caption
                  </button>
                  <button onClick={remove} className="block w-full px-4 py-3 text-left text-psyche-coral hover:bg-white/5">
                    Delete
                  </button>
                </>
              ) : (
                <button onClick={report} className="block w-full px-4 py-3 text-left text-psyche-coral hover:bg-white/5">
                  Report
                </button>
              )}
              <button onClick={() => setMenu(false)} className="block w-full border-t border-white/10 px-4 py-3 text-left text-text-secondary hover:bg-white/5">
                Cancel
              </button>
            </div>
          )}
        </div>
      </header>

      {post.video ? (
        <video
          src={post.video.url}
          poster={post.video.poster}
          controls
          playsInline
          preload={post.video.poster ? "none" : "metadata"}
          className="max-h-[560px] w-full bg-black"
        />
      ) : post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image} alt="" loading="lazy" className="max-h-[560px] w-full object-cover" onDoubleClick={() => !post.liked && like()} />
      ) : (
        <div
          onDoubleClick={() => !post.liked && like()}
          className={`flex min-h-64 items-center justify-center bg-gradient-to-br px-8 py-12 text-center ${TOPIC_GRADIENT[post.topic] || TOPIC_GRADIENT.spirit}`}
        >
          <p className="text-xl font-medium leading-snug text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
            <RichText text={post.text} className="[&_a]:text-white [&_a]:underline" />
          </p>
        </div>
      )}

      <div className="px-4 pb-4 pt-3">
        <div className="flex items-center gap-5">
          <button onClick={like} aria-label={post.liked ? "Unlike" : "Like"} className="text-2xl transition-transform active:scale-125">
            <span className={post.liked ? "" : "opacity-80 grayscale"}>{post.liked ? "❤️" : "🤍"}</span>
          </button>
          {detail ? (
            <span className="text-2xl opacity-90">💬</span>
          ) : (
            <Link href={`/community/p/${post.id}`} aria-label="Comments" className="text-2xl opacity-90">
              💬
            </Link>
          )}
          <button onClick={share} aria-label="Share" className="text-2xl opacity-90">
            📤
          </button>
          <button onClick={save} aria-label={post.saved ? "Unsave" : "Save"} className="ml-auto text-2xl transition-transform active:scale-125">
            <span className={post.saved ? "" : "opacity-80 grayscale"}>{post.saved ? "🔖" : "🏷️"}</span>
          </button>
        </div>

        {post.likeCount > 0 && (
          <p className="mt-2 text-sm font-semibold text-text-primary">
            {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
          </p>
        )}

        {editing ? (
          <div className="mt-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={600}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-text-primary outline-none focus:border-psyche-teal/60"
            />
            <div className="mt-2 flex gap-3 text-sm">
              <button onClick={saveEdit} className="font-semibold text-psyche-teal">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="text-text-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          (post.image || post.video) &&
          post.text && (
            <p className="mt-2 text-[15px] leading-relaxed text-text-primary">
              <Link href={`/community/u/${post.author}`} className="mr-1 font-semibold hover:underline">
                {post.name}
              </Link>
              <RichText text={post.text} />
              {post.edited && <span className="ml-1 text-xs text-text-secondary">(edited)</span>}
            </p>
          )
        )}

        {!detail && post.commentCount > comments.length && (
          <button onClick={() => setShowAll(true)} className="mt-2 text-sm text-text-secondary hover:text-text-primary">
            View all {post.commentCount} comments
          </button>
        )}

        {comments.length > 0 && (
          <div className="mt-2 space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Link href={`/community/u/${c.author}`} className="mt-0.5">
                  <Avatar url={c.avatar} name={c.name} size={24} />
                </Link>
                <p className="min-w-0 flex-1 text-sm leading-snug text-text-secondary">
                  <Link href={`/community/u/${c.author}`} className="mr-1 font-semibold text-text-primary hover:underline">
                    {c.name}
                  </Link>
                  <RichText text={c.text} />
                  <span className="ml-2 text-xs opacity-60">{timeAgo(c.ts)}</span>
                </p>
                {(c.mine || post.mine) && (
                  <button onClick={() => act({ action: "delcomment", commentId: c.id })} aria-label="Delete comment" className="text-xs text-text-secondary hover:text-psyche-coral">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Avatar url={me?.avatar} name={me?.name || "?"} size={28} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => requireLogin()}
            onKeyDown={(e) => e.key === "Enter" && comment()}
            maxLength={240}
            placeholder={me ? "Add a comment…" : "Log in to comment…"}
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
          />
          {draft.trim() && (
            <button onClick={comment} className="text-sm font-semibold text-psyche-teal">
              Post
            </button>
          )}
        </div>
        {msg && <p className="mt-2 text-sm text-psyche-gold">{msg}</p>}
      </div>
    </article>
  );
}
