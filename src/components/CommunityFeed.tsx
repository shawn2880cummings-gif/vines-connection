"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Topic = { id: string; label: string; emoji: string };
type Comment = { id: string; name: string; text: string; ts: number };
type PostView = {
  id: string;
  name: string;
  topic: string;
  text: string;
  image?: string;
  ts: number;
  likeCount: number;
  liked: boolean;
  commentCount: number;
  comments: Comment[];
  mine: boolean;
};

const TOPICS: Topic[] = [
  { id: "spirit", label: "Spirituality", emoji: "🕊️" },
  { id: "quantum", label: "Quantum", emoji: "⚛️" },
  { id: "consciousness", label: "Consciousness", emoji: "🧠" },
  { id: "meditation", label: "Meditation", emoji: "🧘" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "geometry", label: "Sacred Geometry", emoji: "🔯" },
];

const TOPIC_GRADIENT: Record<string, string> = {
  spirit: "from-[#2b1055] via-[#7597de] to-[#20c9b0]",
  quantum: "from-[#0f2027] via-[#2c5364] to-[#20c9b0]",
  consciousness: "from-[#41295a] via-[#2f0743] to-[#e83e8c]",
  meditation: "from-[#134e5e] via-[#2c7a6b] to-[#a8e06c]",
  science: "from-[#141e30] via-[#243b55] to-[#f0a830]",
  geometry: "from-[#1d2671] via-[#c33764] to-[#f0a830]",
};

const MAX_IMAGE_CHARS = 420_000;

function topicOf(id: string) {
  return TOPICS.find((t) => t.id === id) || TOPICS[0];
}

function timeAgo(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d` : new Date(ts).toLocaleDateString();
}

function getUid(): string {
  try {
    let id = localStorage.getItem("vc_uid");
    if (!id) {
      id = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "");
      localStorage.setItem("vc_uid", id);
    }
    return id;
  } catch {
    return "anon" + Math.random().toString(36).slice(2, 12);
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load"));
    };
    img.src = url;
  });
}

async function compressImage(file: File): Promise<string> {
  const img = await loadImage(file);
  for (const [maxSide, quality] of [[960, 0.74], [800, 0.6], [640, 0.5]]) {
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const out = canvas.toDataURL("image/jpeg", quality);
    if (out.length <= MAX_IMAGE_CHARS) return out;
  }
  throw new Error("big");
}

export default function CommunityFeed() {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [text, setText] = useState("");
  const [postTopic, setPostTopic] = useState("spirit");
  const [image, setImage] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [honey, setHoney] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setUid(getUid());
    try {
      setName(localStorage.getItem("vc_name") || "");
    } catch {}
  }, []);

  const load = useCallback(async () => {
    if (!uid) return;
    try {
      const q = new URLSearchParams({ uid });
      if (topic) q.set("topic", topic);
      const res = await fetch(`/api/community?${q}`, { cache: "no-store" });
      const data = await res.json();
      setPosts(data.posts || []);
      setLoadError(false);
    } catch {
      setLoadError(true);
      setPosts((p) => p || []);
    }
  }, [uid, topic]);

  useEffect(() => {
    load();
  }, [load]);

  function replacePost(p: PostView) {
    setPosts((list) => (list ? list.map((x) => (x.id === p.id ? p : x)) : list));
  }

  async function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setMsg("");
    try {
      setImage(await compressImage(f));
    } catch {
      setMsg("Couldn't use that photo — try a different one.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!text.trim() && !image) {
      setMsg("Write something or add a photo.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      try {
        localStorage.setItem("vc_name", name);
      } catch {}
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, topic: postTopic, text, image, website: honey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Could not post.");
      } else {
        setText("");
        setImage(undefined);
        if (data.post && (!topic || topic === data.post.topic)) {
          setPosts((list) => [data.post, ...(list || [])]);
        } else {
          setMsg("Posted! Switch to All to see it.");
        }
      }
    } catch {
      setMsg("Could not post. Check your connection.");
    }
    setBusy(false);
  }

  async function act(id: string, action: "like" | "comment" | "report", extra?: { text?: string }) {
    const res = await fetch(`/api/community/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, action, name, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  async function like(p: PostView) {
    replacePost({ ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) });
    const { ok, data } = await act(p.id, "like");
    if (ok && data.post) replacePost(data.post);
    else replacePost(p);
  }

  async function comment(p: PostView) {
    const t = (drafts[p.id] || "").trim();
    if (!t) return;
    const { ok, data } = await act(p.id, "comment", { text: t });
    if (ok && data.post) {
      replacePost(data.post);
      setDrafts((d) => ({ ...d, [p.id]: "" }));
    } else {
      setMsg(data.error || "Could not comment.");
    }
  }

  async function report(p: PostView) {
    if (!confirm("Report this post as inappropriate?")) return;
    const { ok, data } = await act(p.id, "report");
    if (ok) {
      if (data.hidden) setPosts((l) => (l ? l.filter((x) => x.id !== p.id) : l));
      setMsg("Thanks — we'll take a look.");
    }
  }

  async function remove(p: PostView) {
    if (!confirm("Delete your post?")) return;
    const res = await fetch(`/api/community/${p.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    if (res.ok) setPosts((l) => (l ? l.filter((x) => x.id !== p.id) : l));
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="no-scrollbar -mx-2 mb-6 flex gap-2 overflow-x-auto px-2 pb-1">
        {[{ id: "", label: "All", emoji: "✨" }, ...TOPICS].map((t) => (
          <button
            key={t.id || "all"}
            onClick={() => setTopic(t.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              topic === t.id
                ? "border-psyche-teal bg-psyche-teal/20 text-text-primary"
                : "border-white/15 text-text-secondary hover:border-white/40"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Your name (optional)"
          className="mb-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder="Share a thought, insight, or experience…"
          className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
        />
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          name="website"
        />
        {image && (
          <div className="relative mt-3 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Selected" className="max-h-72 w-full object-cover" />
            <button
              type="button"
              onClick={() => setImage(undefined)}
              aria-label="Remove photo"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={postTopic}
            onChange={(e) => setPostTopic(e.target.value)}
            className="rounded-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-text-primary"
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
          <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-secondary hover:border-white/40"
          >
            📷 Photo
          </button>
          <button
            type="submit"
            disabled={busy || !uid}
            className="ml-auto rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-6 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-105 disabled:opacity-60"
          >
            {busy ? "Posting…" : "Share"}
          </button>
        </div>
        <p className="mt-3 text-xs text-text-secondary/70">
          Be kind and curious. No links or spam. Posts reported by 3 people are hidden automatically.
        </p>
        {msg && <p className="mt-2 text-sm text-psyche-gold">{msg}</p>}
      </form>

      {posts === null && <p className="py-10 text-center text-text-secondary">Opening the feed…</p>}
      {posts && posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-text-secondary">
          {loadError ? "Couldn't load the feed. Pull to refresh." : "No posts here yet — be the first to share ✨"}
        </div>
      )}

      <div className="space-y-6">
        {posts?.map((p) => {
          const t = topicOf(p.topic);
          const showComments = openComments[p.id];
          return (
            <article key={p.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
              <header className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-psyche-teal to-psyche-magenta text-base font-bold text-celestial-900">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{p.name}</p>
                  <p className="text-xs text-text-secondary">
                    {t.emoji} {t.label} · {timeAgo(p.ts)}
                  </p>
                </div>
                {p.mine ? (
                  <button onClick={() => remove(p)} className="text-xs text-text-secondary hover:text-psyche-coral">
                    Delete
                  </button>
                ) : (
                  <button onClick={() => report(p)} aria-label="Report" className="text-sm text-text-secondary hover:text-psyche-coral">
                    ⚑
                  </button>
                )}
              </header>

              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="max-h-[560px] w-full object-cover" onDoubleClick={() => !p.liked && like(p)} />
              ) : (
                <div
                  onDoubleClick={() => !p.liked && like(p)}
                  className={`flex min-h-64 items-center justify-center bg-gradient-to-br px-8 py-12 text-center ${TOPIC_GRADIENT[p.topic] || TOPIC_GRADIENT.spirit}`}
                >
                  <p className="text-xl font-medium leading-snug text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
                    {p.text}
                  </p>
                </div>
              )}

              <div className="px-4 pb-4 pt-3">
                <div className="flex items-center gap-5">
                  <button onClick={() => like(p)} aria-label="Like" className="flex items-center gap-1.5 text-sm text-text-primary">
                    <span className={`text-2xl transition-transform active:scale-125 ${p.liked ? "" : "opacity-80 grayscale"}`}>
                      {p.liked ? "❤️" : "🤍"}
                    </span>
                    {p.likeCount > 0 && p.likeCount}
                  </button>
                  <button
                    onClick={() => setOpenComments((o) => ({ ...o, [p.id]: !o[p.id] }))}
                    className="flex items-center gap-1.5 text-sm text-text-primary"
                  >
                    <span className="text-2xl opacity-90">💬</span>
                    {p.commentCount > 0 && p.commentCount}
                  </button>
                </div>

                {p.image && p.text && (
                  <p className="mt-3 text-[15px] leading-relaxed text-text-primary">
                    <span className="font-semibold">{p.name}</span> {p.text}
                  </p>
                )}

                {showComments && (
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    {p.comments.map((c) => (
                      <p key={c.id} className="text-sm leading-snug text-text-secondary">
                        <span className="font-semibold text-text-primary">{c.name}</span> {c.text}
                      </p>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <input
                        value={drafts[p.id] || ""}
                        onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && comment(p)}
                        maxLength={240}
                        placeholder="Add a comment…"
                        className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
                      />
                      <button onClick={() => comment(p)} className="text-sm font-semibold text-psyche-teal">
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
