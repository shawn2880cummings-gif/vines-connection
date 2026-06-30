"use client";

import { useState } from "react";

export default function BecomeArchitectButton({
  className = "",
  label = "Become an Architect",
}: {
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const start = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/architects", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError(data?.error || "Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        onClick={start}
        disabled={loading}
        className={
          className ||
          "glow-gold rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-10 py-4 text-lg font-semibold text-celestial-900 transition-all hover:scale-110 active:scale-95 disabled:opacity-60 [text-shadow:none]"
        }
      >
        {loading ? "Opening checkout…" : label}
      </button>
      {error && <span className="text-sm text-psyche-coral">{error}</span>}
    </div>
  );
}
