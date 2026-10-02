"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TOPICS, type PostView } from "@/lib/community";
import AuthModal, { type Me } from "./community/AuthModal";
import StoriesBar from "./community/StoriesBar";
import { checkVideoFile, compressImage, uploadVideo, videoInfo } from "./community/media";

const MAX_POST_VIDEO_S = 180;

const TOPIC_GRADIENT: Record<string, string> = {
  spirit: "from-[#2b1055] via-[#7597de] to-[#20c9b0]",
  quantum: "from-[#0f2027] via-[#2c5364] to-[#20c9b0]",
  consciousness: "from-[#41295a] via-[#2f0743] to-[#e83e8c]",
  meditation: "from-[#134e5e] via-[#2c7a6b] to-[#a8e06c]",
  science: "from-[#141e30] via-[#243b55] to-[#f0a830]",
  geometry: "from-[#1d2671] via-[#c33764] to-[#f0a830]",
};

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

export default function CommunityFeed() {
  const [me, setMe] = useState<Me | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [auth, setAuth] = useState<null | "login" | "register">(null);

  const [topic, setTopic] = useState("");
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [text, setText] = useState("");
  const [postTopic, setPostTopic] = useState("spirit");
  const [image, setImage] = useState<string | undefined>();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPoster, setVideoPoster] = useState<string | undefined>();
  const [videoPreview, setVideoPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");
  const [honey, setHoney] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setMe(d.user || null);
        setVideoEnabled(Boolean(d.video));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const load = useCallback(async () => {
    try {
      const q = topic ? `?topic=${topic}` : "";
      const res = await fetch(`/api/community${q}`, { cache: "no-store" });
      const data = await res.json();
      setPosts(data.posts || []);
      setLoadError(false);
    } catch {
      setLoadError(true);
      setPosts((p) => p || []);
    }
  }, [topic]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load, me?.username]);

  function replacePost(p: PostView) {
    setPosts((list) => (list ? list.map((x) => (x.id === p.id ? p : x)) : list));
  }

  function needLogin(mode: "login" | "register" = "register") {
    setAuth(mode);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setMsg("");
  }

  function clearVideo() {
    setVideoFile(null);
    setVideoPoster(undefined);
    setVideoPreview("");
  }

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setMsg("");
    try {
      setImage(await compressImage(f));
      clearVideo();
    } catch {
      setMsg("Couldn't use that photo — try a different one.");
    }
  }

  async function pickVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setMsg("");
    if (!videoEnabled) return setMsg("Video uploads are switching on soon — photos and text work now.");
    const bad = checkVideoFile(f);
    if (bad) return setMsg(bad);
    try {
      const info = await videoInfo(f);
      if (info.duration > MAX_POST_VIDEO_S) return setMsg("Videos can be up to 3 minutes.");
      setVideoPoster(info.poster);
      setVideoFile(f);
      setVideoPreview(URL.createObjectURL(f));
      setImage(undefined);
    } catch {
      setMsg("Couldn't read that video — try another.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!me) return needLogin();
    if (!text.trim() && !image && !videoFile) {
      setMsg("Write something or add a photo or video.");
      return;
    }
    setBusy(true);
    setMsg("");
    setProgress(0);
    try {
      let video;
      if (videoFile) video = { url: await uploadVideo(videoFile, setProgress), poster: videoPoster };
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: postTopic, text, image, video, website: honey }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setMe(null);
        needLogin("login");
      } else if (!res.ok) {
        setMsg(data.error || "Could not post.");
      } else {
        setText("");
        setImage(undefined);
        clearVideo();
        if (data.post && (!topic || topic === data.post.topic)) {
          setPosts((list) => [data.post, ...(list || [])]);
        } else {
          setMsg("Posted! Switch to All to see it.");
        }
      }
    } catch (err) {
      setMsg(err instanceof Error && err.message ? err.message : "Could not post. Check your connection.");
    }
    setBusy(false);
  }

  async function act(id: string, action: "like" | "comment" | "report", extra?: { text?: string }) {
    const res = await fetch(`/api/community/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setMe(null);
      needLogin("login");
    }
    return { ok: res.ok, data };
  }

  async function like(p: PostView) {
    if (!me) return needLogin();
    replacePost({ ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) });
    const { ok, data } = await act(p.id, "like");
    if (ok && data.post) replacePost(data.post);
    else replacePost(p);
  }

  async function comment(p: PostView) {
    if (!me) return needLogin();
    const t = (drafts[p.id] || "").trim();
    if (!t) return;
    const { ok, data } = await act(p.id, "comment", { text: t });
    if (ok && data.post) {
      replacePost(data.post);
      setDrafts((d) => ({ ...d, [p.id]: "" }));
    } else if (data.error) {
      setMsg(data.error);
    }
  }

  async function report(p: PostView) {
    if (!me) return needLogin();
    if (!confirm("Report this post as inappropriate?")) return;
    const { ok, data } = await act(p.id, "report");
    if (ok) {
      if (data.hidden) setPosts((l) => (l ? l.filter((x) => x.id !== p.id) : l));
      setMsg("Thanks — we'll take a look.");
    }
  }

  async function remove(p: PostView) {
    if (!confirm("Delete your post?")) return;
    const res = await fetch(`/api/community/${p.id}`, { method: "DELETE" });
    if (res.ok) setPosts((l) => (l ? l.filter((x) => x.id !== p.id) : l));
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
        {me ? (
          <>
            <p className="min-w-0 truncate text-sm text-text-primary">
              Signed in as <span className="font-semibold">{me.name}</span>{" "}
              <span className="text-text-secondary">@{me.username}</span>
            </p>
            <button onClick={logout} className="shrink-0 text-sm text-text-secondary hover:text-psyche-coral">
              Log out
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-text-secondary">Join to post, share stories, and comment.</p>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => setAuth("login")} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-text-primary">
                Log in
              </button>
              <button
                onClick={() => setAuth("register")}
                className="rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-4 py-1.5 text-sm font-semibold text-celestial-900"
              >
                Sign up
              </button>
            </div>
          </>
        )}
      </div>

      <StoriesBar me={me} videoEnabled={videoEnabled} onNeedLogin={() => setAuth("register")} />

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

      <form onSubmit={submit} className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => !me && ready && needLogin()}
          maxLength={600}
          rows={3}
          placeholder={me ? "Share a thought, insight, or experience…" : "Log in to share a thought…"}
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
        {videoFile && (
          <div className="relative mt-3 overflow-hidden rounded-2xl">
            <video src={videoPreview} poster={videoPoster} controls playsInline muted className="max-h-72 w-full bg-black" />
            <button
              type="button"
              onClick={clearVideo}
              aria-label="Remove video"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
            >
              ✕
            </button>
          </div>
        )}
        {busy && videoFile && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-psyche-teal to-psyche-gold transition-all" style={{ width: `${progress}%` }} />
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
          <input ref={photoRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
          <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={pickVideo} className="hidden" />
          <button
            type="button"
            onClick={() => (me ? photoRef.current?.click() : needLogin())}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-secondary hover:border-white/40"
          >
            📷 Photo
          </button>
          <button
            type="button"
            onClick={() => (me ? videoRef.current?.click() : needLogin())}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-secondary hover:border-white/40"
          >
            🎬 Video
          </button>
          <button
            type="submit"
            disabled={busy || !ready}
            className="ml-auto rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-6 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-105 disabled:opacity-60"
          >
            {busy ? (videoFile ? `Uploading ${progress}%` : "Posting…") : "Share"}
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
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {p.name} <span className="font-normal text-text-secondary">@{p.author}</span>
                  </p>
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

              {p.video ? (
                <video
                  src={p.video.url}
                  poster={p.video.poster}
                  controls
                  playsInline
                  preload={p.video.poster ? "none" : "metadata"}
                  className="max-h-[560px] w-full bg-black"
                />
              ) : p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="max-h-[560px] w-full object-cover" onDoubleClick={() => !p.liked && like(p)} />
              ) : (
                <div
                  onDoubleClick={() => !p.liked && like(p)}
                  className={`flex min-h-64 items-center justify-center bg-gradient-to-br px-8 py-12 text-center ${TOPIC_GRADIENT[p.topic] || TOPIC_GRADIENT.spirit}`}
                >
                  <p className="text-xl font-medium leading-snug text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">{p.text}</p>
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

                {(p.image || p.video) && p.text && (
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
                        onFocus={() => !me && needLogin()}
                        onKeyDown={(e) => e.key === "Enter" && comment(p)}
                        maxLength={240}
                        placeholder={me ? "Add a comment…" : "Log in to comment…"}
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

      {auth && (
        <AuthModal
          initialMode={auth}
          onClose={() => setAuth(null)}
          onDone={(u) => {
            setMe(u);
            setAuth(null);
            setMsg("");
          }}
        />
      )}
    </div>
  );
}
