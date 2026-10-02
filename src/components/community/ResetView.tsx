"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";

export default function ResetView() {
  const { refresh } = useCommunity();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await call("/api/auth/reset", "POST", { token, password });
    if (r.ok) {
      await refresh();
      setDone(true);
    } else setError(r.data.error || "Something went wrong.");
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
      <h1 className="mb-2 text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
        Choose a new password
      </h1>
      {done ? (
        <>
          <p className="mb-5 text-sm text-text-secondary">All set — your password is changed and you&apos;re logged in. Other devices were signed out.</p>
          <Link href="/community" className="block rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold py-3 text-center font-semibold text-celestial-900">
            Go to the Circle
          </Link>
        </>
      ) : !token ? (
        <p className="text-sm text-text-secondary">This page needs the link from your reset email. Open the link from the email, or request a new one from the log-in screen.</p>
      ) : (
        <form onSubmit={submit}>
          <p className="mb-4 text-sm text-text-secondary">Pick something at least 8 characters long.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="New password"
            className="mb-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[15px] text-text-primary outline-none focus:border-psyche-teal/60"
          />
          {error && <p className="mb-3 text-sm text-psyche-coral">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold py-3 font-semibold text-celestial-900 disabled:opacity-60">
            {busy ? "Saving…" : "Save new password"}
          </button>
        </form>
      )}
    </div>
  );
}
