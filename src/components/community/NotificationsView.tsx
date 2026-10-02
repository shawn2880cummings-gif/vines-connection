"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NotificationView } from "@/lib/community";
import Avatar from "./Avatar";
import { call, timeAgo } from "./api";
import { useCommunity } from "./CommunityProvider";

function describe(n: NotificationView) {
  switch (n.type) {
    case "like":
      return "liked your post.";
    case "comment":
      return `commented: “${n.text || ""}”`;
    case "follow":
      return "started following you.";
    case "mention":
      return `mentioned you: “${n.text || ""}”`;
  }
}

export default function NotificationsView() {
  const { me, ready, requireLogin, clearUnread } = useCommunity();
  const [items, setItems] = useState<NotificationView[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!me) {
      requireLogin("login");
      return;
    }
    call("/api/community/notifications").then(async (r) => {
      setItems(r.data.notifications || []);
      if (r.data.unread) {
        await call("/api/community/notifications", "POST", {});
        clearUnread();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, me?.username]);

  if (ready && !me) return <p className="py-10 text-center text-text-secondary">Log in to see your activity.</p>;
  if (items === null) return <p className="py-10 text-center text-text-secondary">Loading…</p>;
  if (!items.length)
    return <p className="mx-auto max-w-xl rounded-3xl border border-dashed border-white/15 p-10 text-center text-text-secondary">No activity yet. Likes, comments, mentions, and new followers will show up here.</p>;

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
      {items.map((n) => {
        const href = n.postId ? `/community/p/${n.postId}` : `/community/u/${n.actor.username}`;
        return (
          <Link key={n.id} href={href} className="flex items-center gap-3 border-b border-white/5 px-4 py-3.5 last:border-0 hover:bg-white/5">
            <Avatar url={n.actor.avatar} name={n.actor.name} size={42} />
            <p className="min-w-0 flex-1 text-sm leading-snug text-text-secondary">
              <span className="font-semibold text-text-primary">{n.actor.name}</span> {describe(n)}
              <span className="ml-2 text-xs opacity-60">{timeAgo(n.ts)}</span>
            </p>
          </Link>
        );
      })}
    </div>
  );
}
