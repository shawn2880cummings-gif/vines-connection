"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommunity } from "./CommunityProvider";
import Avatar from "./Avatar";

export default function CommunityNav() {
  const path = usePathname() || "";
  const { me, unread, requireLogin } = useCommunity();

  const tab = (active: boolean) =>
    `relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs transition-colors ${
      active ? "bg-white/10 text-text-primary" : "text-text-secondary hover:text-text-primary"
    }`;

  const onHome = path === "/community" || path.startsWith("/community/tag");
  const onMe = me ? path === `/community/u/${me.username}` || path === "/community/settings" : false;

  return (
    <nav className="sticky top-[76px] z-30 mx-auto mb-6 flex max-w-xl gap-1 rounded-2xl border border-white/10 bg-[#0a0a14]/80 p-1.5 backdrop-blur-xl">
      <Link href="/community" className={tab(onHome)}>
        <span className="text-xl leading-none">🏠</span>
        Home
      </Link>
      <Link href="/community/search" className={tab(path.startsWith("/community/search"))}>
        <span className="text-xl leading-none">🔍</span>
        Search
      </Link>
      <Link
        href="/community/notifications"
        onClick={(e) => {
          if (!me) {
            e.preventDefault();
            requireLogin("login");
          }
        }}
        className={tab(path.startsWith("/community/notifications"))}
      >
        <span className="text-xl leading-none">🔔</span>
        Activity
        {unread > 0 && (
          <span className="absolute right-3 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-psyche-coral px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
      {me ? (
        <Link href={`/community/u/${me.username}`} className={tab(onMe)}>
          <Avatar url={me.avatar} name={me.name} size={22} />
          Profile
        </Link>
      ) : (
        <button onClick={() => requireLogin("login")} className={tab(false)}>
          <span className="text-xl leading-none">👤</span>
          Log in
        </button>
      )}
    </nav>
  );
}
