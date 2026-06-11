"use client";

import React, { useState } from "react";
import { GROUPS } from "@/components/LeadMagnet";

export default function FooterOptIn() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, groupId: GROUPS.ebook }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Try again.");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setError("Network error.");
      setStatus("error");
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold tracking-widest text-psyche-gold uppercase">
        Newsletter
      </h3>
      {status === "done" ? (
        <p className="text-sm text-psyche-teal">
          Thanks — check your inbox for the ebook. ✦
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-text-primary placeholder-white/40 focus:border-psyche-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded bg-gradient-to-r from-psyche-gold to-psyche-teal px-4 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 [text-shadow:none]"
          >
            {status === "loading" ? "Joining…" : "Get the free ebook"}
          </button>
          {error && <p className="text-xs text-psyche-coral">{error}</p>}
        </form>
      )}
    </div>
  );
}
