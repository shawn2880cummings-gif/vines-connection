"use client";

import { useState } from "react";

export default function Avatar({
  url,
  name,
  size = 40,
  className = "",
}: {
  url?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.42 };
  if (url && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        style={style}
        onError={() => setBroken(true)}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      style={style}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-psyche-teal to-psyche-magenta font-bold text-celestial-900 ${className}`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}
