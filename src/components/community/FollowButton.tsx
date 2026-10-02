"use client";

import { useState } from "react";
import { call } from "./api";
import { useCommunity } from "./CommunityProvider";

export default function FollowButton({
  username,
  following,
  onChange,
  small = false,
}: {
  username: string;
  following: boolean;
  onChange?: (following: boolean, counts: { followerCount: number; followingCount: number }) => void;
  small?: boolean;
}) {
  const { requireLogin } = useCommunity();
  const [on, setOn] = useState(following);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function toggle() {
    if (!requireLogin() || busy) return;
    setBusy(true);
    setErr("");
    const next = !on;
    setOn(next);
    const r = await call(`/api/community/users/${username}/follow`, "POST", { action: next ? "follow" : "unfollow" });
    if (!r.ok) {
      setOn(!next);
      setErr(r.data.error || "Couldn't update.");
    } else onChange?.(next, { followerCount: r.data.followerCount, followingCount: r.data.followingCount });
    setBusy(false);
  }

  const size = small ? "px-4 py-1.5 text-sm" : "px-6 py-2 text-sm";
  return (
    <span className="inline-flex flex-col items-end">
      <button
        onClick={toggle}
        disabled={busy}
        className={`rounded-full font-semibold transition-colors disabled:opacity-60 ${size} ${
          on ? "border border-white/25 text-text-primary hover:border-psyche-coral hover:text-psyche-coral" : "bg-gradient-to-r from-psyche-teal to-psyche-gold text-celestial-900"
        }`}
      >
        {on ? "Following" : "Follow"}
      </button>
      {err && <span className="mt-1 text-xs text-psyche-coral">{err}</span>}
    </span>
  );
}
