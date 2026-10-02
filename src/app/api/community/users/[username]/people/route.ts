import { NextResponse } from "next/server";
import { smembers } from "@/lib/kv";
import { getSessionUser } from "@/lib/auth";
import { followersKey, followingKey } from "@/lib/community";
import { toPeople } from "@/lib/social";

// GET /api/community/users/:username/people?kind=followers|following
export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const u = username.toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return NextResponse.json({ people: [] });
  const kind = new URL(req.url).searchParams.get("kind") === "following" ? "following" : "followers";
  const members = (await smembers(kind === "following" ? followingKey(u) : followersKey(u))).slice(0, 200);
  const me = (await getSessionUser(req))?.username || "";
  return NextResponse.json({ people: await toPeople(members, me) }, { headers: { "Cache-Control": "no-store" } });
}
