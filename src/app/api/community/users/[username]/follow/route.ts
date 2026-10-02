import { NextResponse } from "next/server";
import { getJSON, hit, sadd, srem, scard } from "@/lib/kv";
import { requireWriter, userKey, type User } from "@/lib/auth";
import { LIMITS, followersKey, followingKey } from "@/lib/community";
import { notify } from "@/lib/social";

const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

// POST /api/community/users/:username/follow { action: "follow" | "unfollow" }
export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const auth = await requireWriter(req);
    if (auth.res) return auth.res;
    const me = auth.user.username;
    const { username } = await params;
    const target = username.toLowerCase();
    if (target === me) return err("You can't follow yourself.");
    if (!(await getJSON<User>(userKey(target)))) return err("Not found.", 404);
    if ((await hit(`vc_rl_follow:${me}`, 60)) > 30) return err("Slow down a little.", 429);

    const body = await req.json().catch(() => null);
    if (body?.action === "unfollow") {
      await Promise.all([srem(followingKey(me), target), srem(followersKey(target), me)]);
    } else {
      if ((await scard(followingKey(me))) >= LIMITS.followCap) return err(`You can follow up to ${LIMITS.followCap} people.`);
      const added = await sadd(followingKey(me), target);
      await sadd(followersKey(target), me);
      if (added) await notify(target, { type: "follow", actor: me });
    }
    const [followers, following] = await Promise.all([scard(followersKey(target)), scard(followingKey(target))]);
    return NextResponse.json({ ok: true, following: body?.action !== "unfollow", followerCount: followers, followingCount: following });
  } catch (error) {
    console.error("Follow error:", error);
    return err("Something went wrong.", 500);
  }
}
