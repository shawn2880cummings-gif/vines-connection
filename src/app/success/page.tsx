"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const productId = searchParams.get("product_id");

  return (
    <section className="flex min-h-[80vh] items-center justify-center py-20">
      <div className="mx-auto max-w-lg px-6 text-center">
        {/* Success icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-psyche-teal/20">
          <svg
            className="h-10 w-10 text-psyche-teal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1
          className="mb-4 text-4xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Purchase Complete
        </h1>
        <p className="mb-8 text-lg text-text-secondary">
          Thank you for your purchase. Your download is ready.
        </p>

        {sessionId && productId && (
          <a
            href={`/api/download?session_id=${sessionId}&product_id=${productId}`}
            className="glow-teal mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-8 py-4 text-lg font-semibold text-celestial-900 transition-transform hover:scale-105"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Your File
          </a>
        )}

        <div className="mt-8">
          <Link
            href="/products"
            className="text-psyche-teal transition-colors hover:text-psyche-gold"
          >
            &larr; Browse more products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-text-secondary">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
