"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Global warp transition. Intercepts clicks on internal links and plays a
 * spiral/light-speed cover before navigating, then reveals the new page.
 * Browser back/forward (and any other route change) get the reveal warp too,
 * so every move between sections feels like a warp.
 */
export default function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const lastPath = useRef(pathname);

  // Intercept internal link clicks → cover, then navigate
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || target === "_blank") return;
      // internal paths only (ignore external + protocol links)
      if (!href.startsWith("/") || href.startsWith("//")) return;

      const path = href.split("#")[0];
      if (!path || path === pathname) return; // same page / hash link

      e.preventDefault();
      setActive(true);
      window.setTimeout(() => router.push(href), 480);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // When the path actually changes (incl. back/forward), reveal
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 450);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-warp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-bg-primary"
        >
          {/* Spinning spiral rushing past */}
          <motion.div
            initial={{ scale: 0.2, rotate: 0, opacity: 0.3 }}
            animate={{ scale: 10, rotate: 480, opacity: 1 }}
            transition={{ duration: 0.95, ease: "easeIn" }}
            className="h-[40vmin] w-[40vmin] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(32,201,176,0) 0deg, rgba(240,168,48,0.7) 90deg, rgba(32,201,176,0) 180deg, rgba(155,89,182,0.7) 270deg, rgba(32,201,176,0) 360deg)",
              filter: "blur(6px)",
            }}
          />
          {/* Core flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 12], opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.95, ease: "easeIn", times: [0, 0.5, 1] }}
            className="absolute h-[18vmin] w-[18vmin] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(32,201,176,0.6) 40%, rgba(32,201,176,0) 70%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
