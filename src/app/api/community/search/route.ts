import { NextResponse } from "next/server";
import { smembers, ztop, pipeline } from "@/lib/kv";
import { getSessionUser, USERNAMES_KEY } from "@/lib/auth";
import { TAGS_KEY, TAGCOUNT_KEY } from "@/lib/community";
import { toPeople } from "@/lib/social";

const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/community/search?q=...  -> { users, tags }.  Empty q -> popular tags.
export async function GET(req: Request) {
  try {
    const raw = (new URL(req.url).searchParams.get("q") || "").trim().toLowerCase().slice(0, 40);
    const me = (await getSessionUser(req))?.username || "";

    if (!raw) {
      const top = (await ztop(TAGCOUNT_KEY, 12)).filter((t) => t.score > 0);
      return NextResponse.json({ users: [], tags: top.map((t) => ({ tag: t.member, count: t.score })) }, { headers: NO_STORE });
    }

    const tagOnly = raw.startsWith("#");
    const q = raw.replace(/^[#@]/, "").replace(/[^a-z0-9_]/g, "");
    if (!q) return NextResponse.json({ users: [], tags: [] }, { headers: NO_STORE });

    let users: Awaited<ReturnType<typeof toPeople>> = [];
    if (!tagOnly) {
      const names = (await smembers(USERNAMES_KEY))
        .filter((u) => u.includes(q))
        .sort((a, b) => Number(b.startsWith(q)) - Number(a.startsWith(q)) || a.localeCompare(b))
        .slice(0, 20);
      users = await toPeople(names, me);
    }

    const matchTags = (await smembers(TAGS_KEY)).filter((t) => t.startsWith(q) || t.includes(q)).slice(0, 12);
    const scores = await pipeline(matchTags.map((t) => ["ZSCORE", TAGCOUNT_KEY, t]));
    const tags = matchTags
      .map((tag, i) => ({ tag, count: Number(scores[i] ?? 0) }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ users, tags }, { headers: NO_STORE });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ users: [], tags: [] }, { headers: NO_STORE });
  }
}
