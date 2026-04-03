"use client";

import { useState } from "react";

interface BuyButtonProps {
  productId: string;
  displayPrice: string;
  type: "digital" | "paperback" | "bundle";
  externalLink?: string;
  storeName?: string;
}

export default function BuyButton({
  productId,
  displayPrice,
  type,
  externalLink,
  storeName,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  if (type === "paperback" && externalLink) {
    return (
      <a
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-5 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-105"
      >
        {displayPrice} &mdash; Buy on {storeName}
      </a>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-5 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-105 disabled:opacity-50"
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Processing...
        </>
      ) : (
        <>{displayPrice} &mdash; Buy Now</>
      )}
    </button>
  );
}
