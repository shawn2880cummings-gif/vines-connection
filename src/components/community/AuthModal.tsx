"use client";

import { useState } from "react";

export type Me = { username: string; name: string };

export default function AuthModal({
  initialMode = "register",
  onClose,
  onDone,
}: {
  initialMode?: "login" | "register";
  onClose: () => void;
  onDone: (user: Me) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [ageOk, setAgeOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, password, ageOk }),
      });
      const data = await res.json();
      if (res.ok && data.user) onDone(data.user);
      else setError(data.error || "Something went wrong.");
    } catch {
      setError("Couldn't connect. Try again.");
    }
    setBusy(false);
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60";

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0d0f1c] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              {mode === "register" ? "Join the Circle" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {mode === "register" ? "Create an account to post, share stories, and comment." : "Log in to keep sharing."}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-xl text-text-secondary">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="none"
            autoComplete="username"
            maxLength={20}
            placeholder="Username (letters, numbers, _)"
            className={field}
          />
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              placeholder="Display name (optional)"
              className={field}
            />
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            placeholder="Password (8+ characters)"
            className={field}
          />
        </div>

        {mode === "register" && (
          <label className="mt-4 flex items-start gap-3 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={ageOk}
              onChange={(e) => setAgeOk(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#20c9b0]"
            />
            I&apos;m 13 or older and I&apos;ll keep things kind and respectful.
          </label>
        )}

        {error && <p className="mt-4 text-sm text-psyche-coral">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold py-3 font-semibold text-celestial-900 disabled:opacity-60"
        >
          {busy ? "One moment…" : mode === "register" ? "Create account" : "Log in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "register" ? "login" : "register");
            setError("");
          }}
          className="mt-4 w-full text-center text-sm text-text-secondary hover:text-psyche-teal"
        >
          {mode === "register" ? "Already have an account? Log in" : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}
