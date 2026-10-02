import { NextResponse } from "next/server";
import { getJSON, sismember } from "@/lib/kv";
import { getSessionUser, userKey, type User } from "@/lib/auth";
import { followersKey, followingKey, type ProfileView } from "@/lib/community";
import { avatarUrl, counts } from "@/lib/social";

// GET /api/community/users/:username -> { profile }
export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const u = username.toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const user = await getJSON<User>(userKey(u));
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const me = (await getSessionUser(req))?.username || "";
  const c = await counts(u);
  const [following, followsMe] = me && me !== u
    ? await Promise.all([sismember(followersKey(u), me), sismember(followingKey(u), me)])
    : [false, false];

  const profile: ProfileView = {
    username: u,
    name: user.name,
    avatar: avatarUrl(user),
    bio: user.bio || "",
    following,
    isMe: me === u,
    postCount: c.posts,
    followerCount: c.followers,
    followingCount: c.following,
    followsMe,
  };
  return NextResponse.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}
