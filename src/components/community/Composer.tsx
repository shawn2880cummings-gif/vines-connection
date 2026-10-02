"use client";

import { useEffect, useRef, useState } from "react";
import { TOPICS, type PostView } from "@/lib/community";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";
import Avatar from "./Avatar";
import { checkVideoFile, compressImage, uploadVideo, videoInfo } from "./media";

const MAX_POST_VIDEO_S = 180;

export default function Composer({ onPosted }: { onPosted: (p: PostView) => void }) {
  const { me, flags, ready, requireLogin, refresh } = useCommunity();
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("spirit");
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

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

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
    if (!flags.video) return setMsg("Video uploads are switching on soon — photos and text work now.");
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
    if (!requireLogin()) return;
    if (!text.trim() && !image && !videoFile) return setMsg("Write something or add a photo or video.");
    setBusy(true);
    setMsg("");
    setProgress(0);
    try {
      let video;
      if (videoFile) video = { url: await uploadVideo(videoFile, setProgress), poster: videoPoster };
      const r = await call("/api/community", "POST", { topic, text, image, video, website: honey });
      if (r.status === 401) {
        await refresh();
        requireLogin("login");
      } else if (!r.ok) setMsg(r.data.error || "Could not post.");
      else if (r.data.post) {
        setText("");
        setImage(undefined);
        clearVideo();
        onPosted(r.data.post);
      }
    } catch (err) {
      setMsg(err instanceof Error && err.message ? err.message : "Could not post. Check your connection.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <Avatar url={me?.avatar} name={me?.name || "?"} size={36} className="mt-1" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => ready && requireLogin()}
          maxLength={600}
          rows={3}
          placeholder={me ? "Share a thought… use #tags and @mentions" : "Log in to share a thought…"}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60"
        />
      </div>
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
          <button type="button" onClick={() => setImage(undefined)} aria-label="Remove photo" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white">
            ✕
          </button>
        </div>
      )}
      {videoFile && (
        <div className="relative mt-3 overflow-hidden rounded-2xl">
          <video src={videoPreview} poster={videoPoster} controls playsInline muted className="max-h-72 w-full bg-black" />
          <button type="button" onClick={clearVideo} aria-label="Remove video" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white">
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
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-text-primary">
          {TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.label}
            </option>
          ))}
        </select>
        <input ref={photoRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
        <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={pickVideo} className="hidden" />
        <button type="button" onClick={() => requireLogin() && photoRef.current?.click()} className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-secondary hover:border-white/40">
          📷 Photo
        </button>
        <button type="button" onClick={() => requireLogin() && videoRef.current?.click()} className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-secondary hover:border-white/40">
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
      <p className="mt-3 text-xs text-text-secondary/70">Be kind and curious. No links or spam. Posts reported by 3 people are hidden automatically.</p>
      {msg && <p className="mt-2 text-sm text-psyche-gold">{msg}</p>}
    </form>
  );
}
