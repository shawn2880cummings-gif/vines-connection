"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StoryView } from "@/lib/community";
import type { Me } from "./types";
import AvatarImg from "./Avatar";
import { checkVideoFile, compressImage, uploadVideo, videoInfo } from "./media";

const IMAGE_MS = 5000;
const MAX_STORY_VIDEO_S = 30;

type Group = { author: string; name: string; avatar: string | null; stories: StoryView[]; latest: number };

function ago(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

function Avatar({ name, url, size = 56 }: { name: string; url?: string | null; size?: number }) {
  return <AvatarImg name={name} url={url} size={size} />;
}

export default function StoriesBar({
  me,
  videoEnabled,
  onNeedLogin,
}: {
  me: Me | null;
  videoEnabled: boolean;
  onNeedLogin: () => void;
}) {
  const [stories, setStories] = useState<StoryView[]>([]);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [view, setView] = useState<{ g: number; s: number } | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    try {
      setSeen(new Set(JSON.parse(localStorage.getItem("vc_seen") || "[]")));
    } catch {}
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/community/stories", { cache: "no-store" });
      const data = await res.json();
      setStories(data.stories || []);
    } catch {}
  }, []);

  useEffect(() => {
    load();
  }, [load, me?.username]);

  const groups: Group[] = useMemo(() => {
    const map = new Map<string, Group>();
    for (const s of [...stories].sort((a, b) => a.ts - b.ts)) {
      const g = map.get(s.author) || { author: s.author, name: s.name, avatar: s.avatar, stories: [], latest: 0 };
      g.stories.push(s);
      g.latest = Math.max(g.latest, s.ts);
      map.set(s.author, g);
    }
    return [...map.values()].sort((a, b) => b.latest - a.latest);
  }, [stories]);

  const markSeen = useCallback((id: string) => {
    setSeen((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem("vc_seen", JSON.stringify([...next].slice(-400)));
      } catch {}
      return next;
    });
  }, []);

  return (
    <>
      <div className="no-scrollbar -mx-2 mb-6 flex gap-4 overflow-x-auto px-2 pb-2">
        <button
          onClick={() => (me ? setCreating(true) : onNeedLogin())}
          className="flex w-[68px] shrink-0 flex-col items-center gap-1.5"
        >
          <div className="relative">
            <Avatar name={me?.name || "+"} url={me?.avatar} />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0a0a0b] bg-psyche-teal text-base font-bold leading-none text-celestial-900">
              +
            </span>
          </div>
          <span className="w-full truncate text-center text-xs text-text-secondary">Your story</span>
        </button>

        {groups.map((g, gi) => {
          const unseen = g.stories.some((s) => !seen.has(s.id));
          return (
            <button
              key={g.author}
              onClick={() => setView({ g: gi, s: Math.max(0, g.stories.findIndex((s) => !seen.has(s.id))) })}
              className="flex w-[68px] shrink-0 flex-col items-center gap-1.5"
            >
              <div
                className={`rounded-full p-[3px] ${
                  unseen ? "bg-gradient-to-tr from-psyche-gold via-psyche-magenta to-psyche-teal" : "bg-white/20"
                }`}
              >
                <div className="rounded-full border-2 border-[#0a0a0b]">
                  <Avatar name={g.name} url={g.avatar} size={52} />
                </div>
              </div>
              <span className="w-full truncate text-center text-xs text-text-secondary">
                {me?.username === g.author ? "You" : g.name}
              </span>
            </button>
          );
        })}
      </div>

      {view && groups[view.g] && (
        <Viewer
          groups={groups}
          start={view}
          me={me}
          onSeen={markSeen}
          onClose={() => setView(null)}
          onChanged={load}
        />
      )}
      {creating && (
        <Creator
          videoEnabled={videoEnabled}
          onClose={() => setCreating(false)}
          onShared={() => {
            setCreating(false);
            load();
          }}
        />
      )}
    </>
  );
}

function Viewer({
  groups,
  start,
  me,
  onSeen,
  onClose,
  onChanged,
}: {
  groups: Group[];
  start: { g: number; s: number };
  me: Me | null;
  onSeen: (id: string) => void;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [pos, setPos] = useState(start);
  const [pct, setPct] = useState(0);
  const group = groups[pos.g];
  const story = group?.stories[pos.s];
  const videoRef = useRef<HTMLVideoElement>(null);

  const posRef = useRef(pos);
  posRef.current = pos;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const next = useCallback(() => {
    const p = posRef.current;
    const g = groups[p.g];
    setPct(0);
    if (p.s + 1 < g.stories.length) setPos({ g: p.g, s: p.s + 1 });
    else if (p.g + 1 < groups.length) setPos({ g: p.g + 1, s: 0 });
    else closeRef.current();
  }, [groups]);

  const prev = useCallback(() => {
    const p = posRef.current;
    setPct(0);
    if (p.s > 0) setPos({ g: p.g, s: p.s - 1 });
    else if (p.g > 0) setPos({ g: p.g - 1, s: 0 });
  }, []);

  useEffect(() => {
    if (story) onSeen(story.id);
  }, [story, onSeen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Photos advance on a timer and drive the progress bar.
  const storyId = story?.id;
  const isVideo = Boolean(story?.video);
  useEffect(() => {
    if (!storyId || isVideo) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - t0) / IMAGE_MS) * 100);
      setPct(p);
      if (p >= 100) {
        clearInterval(id);
        next();
      }
    }, 50);
    return () => clearInterval(id);
  }, [storyId, isVideo, next]);

  if (!story) return null;

  async function remove() {
    if (!confirm("Delete this story?")) return;
    await fetch(`/api/community/stories?id=${story!.id}`, { method: "DELETE" });
    onChanged();
    onClose();
  }

  async function report() {
    if (!confirm("Report this story as inappropriate?")) return;
    await fetch("/api/community/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report", id: story!.id }),
    });
    onChanged();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9500] flex flex-col bg-black">
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent px-3 pb-6 pt-3">
        <div className="flex gap-1">
          {group.stories.map((s, i) => (
            <div key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{ width: i < pos.s ? "100%" : i === pos.s ? `${pct}%` : "0%" }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Avatar name={story.name} url={story.avatar} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{story.name}</p>
            <p className="text-xs text-white/70">{ago(story.ts)}</p>
          </div>
          {me &&
            (story.mine ? (
              <button onClick={remove} className="px-2 text-sm text-white/80">
                Delete
              </button>
            ) : (
              <button onClick={report} aria-label="Report" className="px-2 text-base text-white/80">
                ⚑
              </button>
            ))}
          <button onClick={onClose} aria-label="Close" className="px-2 text-2xl leading-none text-white">
            ✕
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        {story.video ? (
          <video
            key={story.id}
            ref={videoRef}
            src={story.video.url}
            poster={story.video.poster}
            autoPlay
            playsInline
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setPct((v.currentTime / v.duration) * 100);
            }}
            onEnded={next}
            onError={next}
            className="max-h-full max-w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={story.id} src={story.image} alt="" className="max-h-full max-w-full object-contain" />
        )}
        <button aria-label="Previous" onClick={prev} className="absolute inset-y-0 left-0 w-1/3" />
        <button aria-label="Next" onClick={next} className="absolute inset-y-0 right-0 w-2/3" />
      </div>

      {story.caption && (
        <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-10 pt-12 text-center text-lg text-white">
          {story.caption}
        </p>
      )}
    </div>
  );
}

function Creator({
  videoEnabled,
  onClose,
  onShared,
}: {
  videoEnabled: boolean;
  onClose: () => void;
  onShared: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | undefined>();
  const [poster, setPoster] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setError("");
    setImage(undefined);
    setPoster(undefined);
    setFile(null);
    if (f.type.startsWith("video/")) {
      if (!videoEnabled) return setError("Video stories are switching on soon — photos work now.");
      const bad = checkVideoFile(f);
      if (bad) return setError(bad);
      try {
        const info = await videoInfo(f);
        if (info.duration > MAX_STORY_VIDEO_S + 0.5) return setError(`Story videos can be up to ${MAX_STORY_VIDEO_S} seconds.`);
        setPoster(info.poster);
      } catch {
        return setError("Couldn't read that video — try another.");
      }
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      try {
        const out = await compressImage(f);
        setImage(out);
        setPreviewUrl("");
      } catch {
        setError("Couldn't use that photo — try a different one.");
      }
    }
  }

  async function share() {
    if (busy || (!file && !image)) return;
    setBusy(true);
    setError("");
    try {
      let video;
      if (file) video = { url: await uploadVideo(file, setProgress), poster };
      const res = await fetch("/api/community/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, video, caption }),
      });
      const data = await res.json();
      if (res.ok) return onShared();
      setError(data.error || "Could not share your story.");
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Upload failed. Try again.");
    }
    setBusy(false);
  }

  const hasMedia = Boolean(file || image);

  return (
    <div className="fixed inset-0 z-[9000] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0d0f1c] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Add to your story</h2>
          <button onClick={onClose} aria-label="Close" className="text-xl text-text-secondary">
            ✕
          </button>
        </div>
        <p className="mb-3 text-xs text-text-secondary">Stories disappear after 24 hours.</p>

        <input ref={inputRef} type="file" accept="image/*,video/mp4,video/quicktime,video/webm" onChange={pick} className="hidden" />

        {hasMedia ? (
          <div className="relative mx-auto mb-3 aspect-[9/16] max-h-[52vh] overflow-hidden rounded-2xl bg-black">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Story preview" className="h-full w-full object-cover" />
            ) : (
              <video src={previewUrl} poster={poster} muted playsInline controls className="h-full w-full object-cover" />
            )}
            <button
              onClick={() => {
                setFile(null);
                setImage(undefined);
                setPoster(undefined);
              }}
              aria-label="Remove"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="mb-3 flex aspect-[9/16] max-h-[40vh] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 text-text-secondary hover:border-psyche-teal/60"
          >
            <span className="text-4xl">📷</span>
            <span className="text-sm">Choose a photo or video</span>
          </button>
        )}

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={140}
          placeholder="Add a caption (optional)"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
        />

        {busy && file && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-psyche-teal to-psyche-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && <p className="mt-3 text-sm text-psyche-coral">{error}</p>}

        <button
          onClick={share}
          disabled={busy || !hasMedia}
          className="mt-4 w-full rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold py-3 font-semibold text-celestial-900 disabled:opacity-50"
        >
          {busy ? (file ? `Uploading ${progress}%` : "Sharing…") : "Share story"}
        </button>
      </div>
    </div>
  );
}
