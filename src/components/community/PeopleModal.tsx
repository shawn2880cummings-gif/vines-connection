"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PersonView } from "@/lib/community";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import { call } from "./api";

export default function PeopleModal({ username, kind, onClose }: { username: string; kind: "followers" | "following"; onClose: () => void }) {
  const [people, setPeople] = useState<PersonView[] | null>(null);

  useEffect(() => {
    call(`/api/community/users/${username}/people?kind=${kind}`).then((r) => setPeople(r.data.people || []));
  }, [username, kind]);

  return (
    <div className="fixed inset-0 z-[9000] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[75vh] w-full max-w-sm flex-col rounded-3xl border border-white/15 bg-[#0d0f1c] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-bold capitalize text-text-primary">{kind}</h2>
          <button onClick={onClose} aria-label="Close" className="text-xl text-text-secondary">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-3">
          {people === null && <p className="py-6 text-center text-text-secondary">Loading…</p>}
          {people?.length === 0 && <p className="py-6 text-center text-text-secondary">No one here yet.</p>}
          {people?.map((p) => (
            <div key={p.username} className="flex items-center gap-3 py-2.5">
              <Link href={`/community/u/${p.username}`} onClick={onClose}>
                <Avatar url={p.avatar} name={p.name} size={44} />
              </Link>
              <Link href={`/community/u/${p.username}`} onClick={onClose} className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">{p.name}</p>
                <p className="truncate text-xs text-text-secondary">@{p.username}</p>
              </Link>
              {!p.isMe && <FollowButton username={p.username} following={p.following} small />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
