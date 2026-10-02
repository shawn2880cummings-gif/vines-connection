"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TOPICS, type PostView } from "@/lib/community";
import Composer from "./Composer";
import FeedList from "./FeedList";
import StoriesBar from "./StoriesBar";
import { useCommunity } from "./CommunityProvider";

export default function HomeFeed() {
  const { me, flags, requireLogin } = useCommunity();
  const [scope, setScope] = useState<"explore" | "following">("explore");
  const [topic, setTopic] = useState("");
  const [fresh, setFresh] = useState<PostView[]>([]);

  useEffect(() => {
    try {
      if (localStorage.getItem("vc_scope") === "following") setScope("following");
    } catch {}
  }, []);

  function pickScope(s: "explore" | "following") {
    if (s === "following" && !requireLogin()) return;
    setScope(s);
    try {
      localStorage.setItem("vc_scope", s);
    } catch {}
  }

  const effective = scope === "following" && me ? "following" : "explore";
  const endpoint = `/api/community?scope=${effective}${topic ? `&topic=${topic}` : ""}`;

  const seg = (on: boolean) =>
    `flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-white/15 text-text-primary" : "text-text-secondary hover:text-text-primary"}`;

  return (
    <div className="mx-auto w-full max-w-xl">
      <StoriesBar me={me} videoEnabled={flags.video} onNeedLogin={() => requireLogin()} />

      <Composer onPosted={(p) => setFresh((f) => [p, ...f])} />

      <div className="mb-4 flex rounded-full border border-white/10 bg-white/[0.04] p-1">
        <button onClick={() => pickScope("following")} className={seg(effective === "following")}>
          Following
        </button>
        <button onClick={() => pickScope("explore")} className={seg(effective === "explore")}>
          Explore
        </button>
      </div>

      <div className="no-scrollbar -mx-2 mb-6 flex gap-2 overflow-x-auto px-2 pb-1">
        {[{ id: "", label: "All", emoji: "✨" }, ...TOPICS].map((t) => (
          <button
            key={t.id || "all"}
            onClick={() => setTopic(t.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              topic === t.id ? "border-psyche-teal bg-psyche-teal/20 text-text-primary" : "border-white/15 text-text-secondary hover:border-white/40"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <FeedList
        endpoint={endpoint}
        reloadKey={effective + topic}
        fresh={fresh.filter((p) => !topic || p.topic === topic)}
        empty={
          effective === "following" ? (
            <>
              Nothing here yet — follow people to fill your feed.{" "}
              <Link href="/community/search" className="text-psyche-teal underline">
                Find people
              </Link>
            </>
          ) : (
            "No posts here yet — be the first to share ✨"
          )
        }
      />
    </div>
  );
}
