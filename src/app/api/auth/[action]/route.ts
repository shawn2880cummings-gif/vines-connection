import { NextResponse } from "next/server";
import { getJSON, setIfAbsent, hit } from "@/lib/kv";
import {
  userKey,
  normalizeUsername,
  hashPassword,
  verifyPassword,
  makeSession,
  sessionCookie,
  clearCookie,
  getSessionUser,
  sameOrigin,
  clientIp,
  type User,
} from "@/lib/auth";
import { cleanText } from "@/lib/community";

type Ctx = { params: Promise<{ action: string }> };

const NO_STORE = { "Cache-Control": "no-store" };

function videoEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// GET /api/auth/me -> { user, video }
export async function GET(req: Request, { params }: Ctx) {
  const { action } = await params;
  if (action !== "me") return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    const user = await getSessionUser(req);
    return NextResponse.json({ user, video: videoEnabled() }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ user: null, video: videoEnabled() }, { headers: NO_STORE });
  }
}

// POST /api/auth/register | login | logout
export async function POST(req: Request, { params }: Ctx) {
  const { action } = await params;
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });

  try {
    if (action === "logout") {
      const res = NextResponse.json({ ok: true });
      res.headers.append("Set-Cookie", clearCookie());
      return res;
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });
    const ip = clientIp(req);

    if (action === "register") {
      if (body.ageOk !== true) {
        return NextResponse.json({ error: "You must be 13 or older to join." }, { status: 400 });
      }
      const username = normalizeUsername(body.username);
      if (!username) {
        return NextResponse.json(
          { error: "Username must be 3–20 letters, numbers or underscores (and not a reserved name)." },
          { status: 400 }
        );
      }
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length < 8 || password.length > 100) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      if ((await hit(`vc_rl_reg:${ip}`, 3600)) > 8) {
        return NextResponse.json({ error: "Too many sign-ups from here. Try again later." }, { status: 429 });
      }
      const display = cleanText(body.name, 24).replace(/[^\p{L}\p{N} _.'-]/gu, "").trim();
      const user: User = {
        username,
        name: display.length >= 2 ? display : username,
        pw: await hashPassword(password),
        created: Date.now(),
      };
      if (!(await setIfAbsent(userKey(username), user))) {
        return NextResponse.json({ error: "That username is taken." }, { status: 409 });
      }
      const { token, maxAge } = makeSession(username);
      const res = NextResponse.json({ ok: true, user: { username, name: user.name } });
      res.headers.append("Set-Cookie", sessionCookie(token, maxAge));
      return res;
    }

    if (action === "login") {
      const username = normalizeUsername(body.username) || "";
      if ((await hit(`vc_rl_login:${ip}:${username}`, 900)) > 10) {
        return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });
      }
      const password = typeof body.password === "string" ? body.password : "";
      const user = username ? await getJSON<User>(userKey(username)) : null;
      // Same message either way so usernames can't be probed.
      if (!user || !(await verifyPassword(password, user.pw))) {
        return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
      }
      const { token, maxAge } = makeSession(user.username);
      const res = NextResponse.json({ ok: true, user: { username: user.username, name: user.name } });
      res.headers.append("Set-Cookie", sessionCookie(token, maxAge));
      return res;
    }

    return NextResponse.json({ error: "Not found." }, { status: 404 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
