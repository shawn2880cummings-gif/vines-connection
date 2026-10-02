import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { userPostsKey } from "@/lib/community";
import { postsFromKey } from "@/lib/social";

// GET /api/community/users/:username/posts?before=<score>
export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const u = username.toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return NextResponse.json({ posts: [], next: null });
  const raw = new URL(req.url).searchParams.get("before");
  const before = raw && Number.isFinite(Number(raw)) ? Number(raw) : null;
  const me = (await getSessionUser(req))?.username || "";
  const page = await postsFromKey(userPostsKey(u), before, me);
  return NextResponse.json({ posts: page.items, next: page.next }, { headers: { "Cache-Control": "no-store" } });
}
