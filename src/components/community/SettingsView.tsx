"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";
import { compressAvatar } from "./media";

type Own = { username: string; name: string; bio: string; avatar: string | null; email: string; emailVerified: boolean };

export default function SettingsView() {
  const { me, ready, flags, requireLogin, refresh, logout } = useCommunity();
  const [own, setOwn] = useState<Own | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null | undefined>(undefined); // undefined = unchanged
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("verified");
    if (v === "1") setBanner("✅ Your email is confirmed — you're all set to post.");
    if (v === "0") setBanner("That confirmation link is invalid or expired. Request a new one below.");
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!me) {
      requireLogin("login");
      return;
    }
    call("/api/community/users/me").then((r) => {
      if (r.ok) {
        setOwn(r.data.profile);
        setName(r.data.profile.name);
        setBio(r.data.profile.bio);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, me?.username]);

  if (ready && !me) return <p className="py-10 text-center text-text-secondary">Log in to edit your profile.</p>;
  if (!own) return <p className="py-10 text-center text-text-secondary">Loading…</p>;

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      setAvatar(await compressAvatar(f));
      setMsg("");
    } catch {
      setMsg("Couldn't use that photo — try a different one.");
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const body: Record<string, unknown> = { name, bio };
    if (avatar !== undefined) body.avatar = avatar;
    const r = await call("/api/community/users/me", "PATCH", body);
    if (r.ok) {
      setOwn(r.data.profile);
      setAvatar(undefined);
      await refresh();
      setMsg("Saved ✓");
    } else setMsg(r.data.error || "Could not save.");
    setBusy(false);
  }

  async function resend() {
    const r = await call("/api/auth/resend", "POST", {});
    setMsg(r.ok ? (r.data.already ? "You're already confirmed." : "Sent! Check your inbox.") : r.data.error || "Couldn't send.");
  }

  const shownAvatar = avatar === undefined ? own.avatar : avatar;
  const input = "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[15px] text-text-primary outline-none focus:border-psyche-teal/60";

  return (
    <div className="mx-auto w-full max-w-xl">
      {banner && <div className="mb-4 rounded-2xl border border-psyche-teal/40 bg-psyche-teal/10 px-4 py-3 text-sm text-text-primary">{banner}</div>}

      <form onSubmit={save} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
        <h1 className="mb-5 text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          Edit profile
        </h1>

        <div className="mb-5 flex items-center gap-4">
          <Avatar url={shownAvatar} name={name || own.name} size={72} />
          <div className="flex flex-col items-start gap-1.5 text-sm">
            <input ref={fileRef} type="file" accept="image/*" onChange={pick} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="font-semibold text-psyche-teal">
              Change photo
            </button>
            {shownAvatar && (
              <button type="button" onClick={() => setAvatar(null)} className="text-text-secondary hover:text-psyche-coral">
                Remove photo
              </button>
            )}
          </div>
        </div>

        <label className="mb-1 block text-xs uppercase tracking-widest text-text-secondary">Display name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} className={`${input} mb-4`} />

        <label className="mb-1 block text-xs uppercase tracking-widest text-text-secondary">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={150} rows={3} className={`${input} mb-1 resize-none`} placeholder="A line about you — #tags and @mentions work" />
        <p className="mb-4 text-right text-xs text-text-secondary">{bio.length}/150</p>

        <label className="mb-1 block text-xs uppercase tracking-widest text-text-secondary">Email</label>
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
          <span className="truncate text-text-primary">{own.email}</span>
          {own.emailVerified ? (
            <span className="shrink-0 text-psyche-teal">✓ Confirmed</span>
          ) : flags.email ? (
            <button type="button" onClick={resend} className="shrink-0 font-semibold text-psyche-gold">
              Confirm it
            </button>
          ) : (
            <span className="shrink-0 text-text-secondary">Not confirmed</span>
          )}
        </div>

        <button type="submit" disabled={busy} className="w-full rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold py-3 font-semibold text-celestial-900 disabled:opacity-60">
          {busy ? "Saving…" : "Save changes"}
        </button>
        {msg && <p className="mt-3 text-center text-sm text-psyche-gold">{msg}</p>}
      </form>

      <div className="mt-5 flex items-center justify-between px-1 text-sm">
        <Link href={`/community/u/${own.username}`} className="text-text-secondary hover:text-text-primary">
          ← View my profile
        </Link>
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/community";
          }}
          className="text-psyche-coral"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
