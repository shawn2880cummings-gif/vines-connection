import { NextResponse } from "next/server";
import { getJSON, setJSON, setText, del } from "@/lib/kv";
import { getSessionUser, sameOrigin, userKey, type User } from "@/lib/auth";
import { LIMITS, avatarKey, cleanText, cleanDisplayName, cleanImage, rejectReason } from "@/lib/community";
import { avatarUrl } from "@/lib/social";

const NO_STORE = { "Cache-Control": "no-store" };
const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

function own(u: User) {
  return {
    username: u.username,
    name: u.name,
    bio: u.bio || "",
    avatar: avatarUrl(u),
    email: u.email,
    emailVerified: u.emailVerified,
  };
}

// GET /api/community/users/me -> your editable profile (includes your email)
export async function GET(req: Request) {
  const session = await getSessionUser(req);
  if (!session) return err("Please log in first.", 401);
  const user = await getJSON<User>(userKey(session.username));
  if (!user) return err("Please log in first.", 401);
  return NextResponse.json({ profile: own(user) }, { headers: NO_STORE });
}

// PATCH /api/community/users/me { name?, bio?, avatar? (JPEG data URL, or null to remove) }
export async function PATCH(req: Request) {
  try {
    if (!sameOrigin(req)) return err("Bad request.", 403);
    const session = await getSessionUser(req);
    if (!session) return err("Please log in first.", 401);
    const user = await getJSON<User>(userKey(session.username));
    if (!user) return err("Please log in first.", 401);
    const body = await req.json().catch(() => null);
    if (!body) return err("Bad request.");

    if (body.name !== undefined) {
      const name = cleanDisplayName(body.name);
      if (name.length < 2) return err("Display name must be at least 2 characters.");
      user.name = name;
    }
    if (body.bio !== undefined) {
      const bio = cleanText(body.bio, LIMITS.bio);
      const reason = rejectReason(bio);
      if (reason) return err(reason);
      user.bio = bio;
    }
    if (body.avatar === null) {
      await del(avatarKey(user.username));
      user.av = 0;
    } else if (body.avatar !== undefined) {
      const img = cleanImage(body.avatar, LIMITS.avatarChars);
      if (img === "bad" || !img) return err("That photo couldn't be used.");
      await setText(avatarKey(user.username), img);
      user.av = Date.now();
    }
    await setJSON(userKey(user.username), user);
    return NextResponse.json({ ok: true, profile: own(user) });
  } catch (error) {
    console.error("Profile update error:", error);
    return err("Something went wrong.", 500);
  }
}
