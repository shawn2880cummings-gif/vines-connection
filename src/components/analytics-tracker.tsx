"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getOrCreateVisitorId(): string {
  if (typeof document === "undefined") return "";
  const COOKIE_NAME = "paan_vid";
  const existing = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];

  if (existing) return existing;

  const id = crypto.randomUUID();
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  return id;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    if (pathname === lastTrackedPath.current) return;
    lastTrackedPath.current = pathname;

    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      visitorId,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/track",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
