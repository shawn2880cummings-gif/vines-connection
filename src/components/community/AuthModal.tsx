"use client";

import { useState } from "react";
import type { Me } from "./types";

type Mode = "login" | "register" | "forgot";

export default function AuthModal({
  initialMode = "register",
  emailOn,
  onClose,
  onDone,
}: {
  initialMode?: Mode;
  emailOn: boolean;
  onClose: () => void;
  onDone: (user: Me, emailSent: boolean) => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [username, setUsername] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [ageOk, setAgeOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function go(m: Mode) {
    setMode(m);
    setError("");
    setSent(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const payload =
        mode === "register"
          ? { username, email, name, password, ageOk }
          : mode === "login"
            ? { login, password }
            : { email };
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else if (mode === "forgot") setSent(true);
      else if (data.user) onDone(data.user, Boolean(data.emailSent));
    } catch {
      setError("Couldn't connect. Try again.");
    }
    setBusy(false);
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60 focus:border-psyche-teal/60";
  const title = mode === "register" ? "Join the Circle" : mode === "login" ? "Welcome back" : "Reset your password";
  const sub =
    mode === "register"
      ? "Create an account to post, share stories, follow people, and comment."
      : mode === "login"
        ? "Log in to keep sharing."
        : "Enter your email and we'll send you a link to choose a new password.";

  return (
    <div className="fixed inset-0 z-[9000] flex items-end justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="my-auto w-full max-w-sm rounded-3xl border border-white/15 bg-[#0d0f1c] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              {title}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">{sub}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-xl text-text-secondary">
            ✕
          </button>
        </div>

        {mode === "forgot" && sent ? (
          <p className="rounded-xl border border-psyche-teal/40 bg-psyche-teal/10 p-4 text-sm text-text-primary">
            If an account uses that email, a reset link is on its way. It works for 1 hour.
          </p>
        ) : mode === "forgot" && !emailOn ? (
          <p className="rounded-xl border border-psyche-gold/40 bg-psyche-gold/10 p-4 text-sm text-text-primary">
            Password reset by email isn&apos;t switched on yet. Please contact us and we&apos;ll help you back in.
          </p>
        ) : (
          <div className="space-y-3">
            {mode === "register" && (
              <>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="username"
                  maxLength={20}
                  placeholder="Username (letters, numbers, _)"
                  className={field}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Email"
                  className={field}
                />
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="Display name (optional)" className={field} />
              </>
            )}
            {mode === "login" && (
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoCapitalize="none"
                autoComplete="username"
                placeholder="Username or email"
                className={field}
              />
            )}
            {mode === "forgot" && (
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Email" className={field} />
            )}
            {mode !== "forgot" && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder="Password (8+ characters)"
                className={field}
              />
            )}
          </div>
        )}

        {mode === "register" && (
          <label className="mt-4 flex items-start gap-3 text-sm text-text-secondary">
            <input type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#20c9b0]" />
            I&apos;m 13 or older and I&apos;ll keep things kind and respectful.
          </label>
        )}

        {error && <p className="mt-4 text-sm text-psyche-coral">{error}</p>}

        {!(mode === "forgot" && (sent || !emailOn)) && (
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold py-3 font-semibold text-celestial-900 disabled:opacity-60"
          >
            {busy ? "One moment…" : mode === "register" ? "Create account" : mode === "login" ? "Log in" : "Send reset link"}
          </button>
        )}

        <div className="mt-4 space-y-2 text-center text-sm">
          {mode === "login" && (
            <button type="button" onClick={() => go("forgot")} className="block w-full text-text-secondary hover:text-psyche-teal">
              Forgot your password?
            </button>
          )}
          <button
            type="button"
            onClick={() => go(mode === "register" ? "login" : "register")}
            className="block w-full text-text-secondary hover:text-psyche-teal"
          >
            {mode === "register" ? "Already have an account? Log in" : mode === "login" ? "New here? Create an account" : "Back to log in"}
          </button>
        </div>
      </form>
    </div>
  );
}
