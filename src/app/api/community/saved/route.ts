import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { savedKey } from "@/lib/community";
import { postsFromKey } from "@/lib/social";

// GET /api/community/saved?before=<score> — your saved posts, newest save first
export async function GET(req: Request) {
  const me = (await getSessionUser(req))?.username;
  if (!me) return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  const raw = new URL(req.url).searchParams.get("before");
  const before = raw && Number.isFinite(Number(raw)) ? Number(raw) : null;
  const page = await postsFromKey(savedKey(me), before, me);
  return NextResponse.json({ posts: page.items, next: page.next }, { headers: { "Cache-Control": "no-store" } });
}
