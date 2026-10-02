"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AuthModal from "./AuthModal";
import type { Flags, Me } from "./types";

type Ctx = {
  me: Me | null;
  flags: Flags;
  ready: boolean;
  unread: number;
  setMe: (m: Me | null) => void;
  refresh: () => Promise<void>;
  requireLogin: (mode?: "login" | "register") => boolean; // true if already logged in
  logout: () => Promise<void>;
  clearUnread: () => void;
};

const C = createContext<Ctx | null>(null);

export function useCommunity(): Ctx {
  const v = useContext(C);
  if (!v) throw new Error("useCommunity must be used inside CommunityProvider");
  return v;
}

export default function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [flags, setFlags] = useState<Flags>({ video: false, email: false });
  const [ready, setReady] = useState(false);
  const [unread, setUnread] = useState(0);
  const [auth, setAuth] = useState<null | "login" | "register">(null);
  const [notice, setNotice] = useState("");
  const [resent, setResent] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await res.json();
      setMe(d.user || null);
      setFlags({ video: Boolean(d.video), email: Boolean(d.email) });
      setUnread(d.unread || 0);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // keep the notification badge fresh
  useEffect(() => {
    if (!me) return;
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [me, refresh]);

  const requireLogin = useCallback(
    (mode: "login" | "register" = "register") => {
      if (me) return true;
      setAuth(mode);
      return false;
    },
    [me]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setUnread(0);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ me, flags, ready, unread, setMe, refresh, requireLogin, logout, clearUnread: () => setUnread(0) }),
    [me, flags, ready, unread, refresh, requireLogin, logout]
  );

  async function resend() {
    setResent("Sending…");
    const res = await fetch("/api/auth/resend", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setResent(res.ok ? (d.already ? "You're already confirmed." : "Sent! Check your inbox.") : d.error || "Couldn't send.");
  }

  const needsVerify = Boolean(me && flags.email && !me.emailVerified);

  return (
    <C.Provider value={value}>
      {needsVerify && (
        <div className="mx-auto mb-4 max-w-xl rounded-2xl border border-psyche-gold/40 bg-psyche-gold/10 px-4 py-3 text-sm text-text-primary">
          Confirm your email to start posting — we sent a link to your inbox.{" "}
          <button onClick={resend} className="font-semibold text-psyche-gold underline">
            Resend it
          </button>
          {resent && <span className="ml-2 text-text-secondary">{resent}</span>}
        </div>
      )}
      {notice && (
        <div className="mx-auto mb-4 max-w-xl rounded-2xl border border-psyche-teal/40 bg-psyche-teal/10 px-4 py-3 text-sm text-text-primary">{notice}</div>
      )}
      {children}
      {auth && (
        <AuthModal
          initialMode={auth}
          emailOn={flags.email}
          onClose={() => setAuth(null)}
          onDone={(u, sent) => {
            setMe(u);
            setAuth(null);
            refresh();
            if (sent) setNotice("Welcome! We emailed you a link to confirm your address.");
            else setNotice("");
          }}
        />
      )}
    </C.Provider>
  );
}
