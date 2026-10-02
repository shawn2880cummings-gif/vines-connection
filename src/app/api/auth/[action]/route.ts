import { NextResponse } from "next/server";
import { getJSON, setJSON, setIfAbsent, del, hit, sadd, getNum } from "@/lib/kv";
import {
  userKey,
  emailKey,
  USERNAMES_KEY,
  normalizeUsername,
  normalizeEmail,
  hashPassword,
  verifyPassword,
  makeSession,
  sessionCookie,
  clearCookie,
  getSessionUser,
  sameOrigin,
  clientIp,
  siteUrl,
  issueToken,
  consumeToken,
  type User,
} from "@/lib/auth";
import { cleanDisplayName, unreadKey } from "@/lib/community";
import { emailEnabled, sendEmail, verifyEmail, resetEmail } from "@/lib/email";
import { avatarUrl } from "@/lib/social";

type Ctx = { params: Promise<{ action: string }> };

const NO_STORE = { "Cache-Control": "no-store" };
const videoEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

function publicUser(u: User) {
  return { username: u.username, name: u.name, emailVerified: u.emailVerified, avatar: avatarUrl(u) };
}

async function sendVerification(req: Request, user: User): Promise<boolean> {
  const token = await issueToken("verify", user.username, 24 * 3600);
  const url = `${siteUrl(req)}/api/auth/verify?token=${token}`;
  return sendEmail({ to: user.email, ...verifyEmail(user.name, url) });
}

// GET /api/auth/me -> { user, video, email, unread }
// GET /api/auth/verify?token=...  (link from the confirmation email)
export async function GET(req: Request, { params }: Ctx) {
  const { action } = await params;

  if (action === "verify") {
    const base = siteUrl(req);
    const username = await consumeToken("verify", new URL(req.url).searchParams.get("token"));
    if (username) {
      const user = await getJSON<User>(userKey(username));
      if (user) {
        user.emailVerified = true;
        await setJSON(userKey(username), user);
        return NextResponse.redirect(`${base}/community/settings?verified=1`);
      }
    }
    return NextResponse.redirect(`${base}/community/settings?verified=0`);
  }

  if (action !== "me") return err("Not found.", 404);
  try {
    const session = await getSessionUser(req);
    const user = session ? await getJSON<User>(userKey(session.username)) : null;
    return NextResponse.json(
      {
        user: user ? publicUser(user) : null,
        video: videoEnabled(),
        email: emailEnabled(),
        unread: user ? await getNum(unreadKey(user.username)) : 0,
      },
      { headers: NO_STORE }
    );
  } catch {
    return NextResponse.json({ user: null, video: videoEnabled(), email: emailEnabled(), unread: 0 }, { headers: NO_STORE });
  }
}

// POST /api/auth/register | login | logout | forgot | reset | resend
export async function POST(req: Request, { params }: Ctx) {
  const { action } = await params;
  if (!sameOrigin(req)) return err("Bad request.", 403);

  try {
    if (action === "logout") {
      const res = NextResponse.json({ ok: true });
      res.headers.append("Set-Cookie", clearCookie());
      return res;
    }

    const body = await req.json().catch(() => null);
    if (!body) return err("Bad request.");
    const ip = clientIp(req);

    if (action === "register") {
      if (body.ageOk !== true) return err("You must be 13 or older to join.");
      const username = normalizeUsername(body.username);
      if (!username) return err("Username must be 3–20 letters, numbers or underscores (and not a reserved name).");
      const email = normalizeEmail(body.email);
      if (!email) return err("Please enter a valid email address.");
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length < 8 || password.length > 100) return err("Password must be at least 8 characters.");
      if ((await hit(`vc_rl_reg:${ip}`, 3600)) > 8) return err("Too many sign-ups from here. Try again later.", 429);

      const display = cleanDisplayName(body.name);
      const user: User = {
        username,
        name: display.length >= 2 ? display : username,
        pw: await hashPassword(password),
        created: Date.now(),
        email,
        emailVerified: false,
        sv: 0,
        bio: "",
        av: 0,
      };
      // Reserve the email first, then the username; undo the first if the second is taken.
      if (!(await setIfAbsent(emailKey(email), username))) return err("An account with that email already exists.", 409);
      if (!(await setIfAbsent(userKey(username), user))) {
        await del(emailKey(email));
        return err("That username is taken.", 409);
      }
      await sadd(USERNAMES_KEY, username);

      const sent = emailEnabled() ? await sendVerification(req, user) : false;
      const { token, maxAge } = makeSession(user);
      const res = NextResponse.json({ ok: true, user: publicUser(user), emailSent: sent });
      res.headers.append("Set-Cookie", sessionCookie(token, maxAge));
      return res;
    }

    if (action === "login") {
      const id = String(body.login ?? body.username ?? "").trim().toLowerCase();
      if ((await hit(`vc_rl_login:${ip}:${id}`, 900)) > 10) return err("Too many attempts. Wait a few minutes.", 429);
      const password = typeof body.password === "string" ? body.password : "";
      let username = id.includes("@") ? await getJSON<string>(emailKey(id)) : normalizeUsername(id);
      username = username || "";
      const user = username ? await getJSON<User>(userKey(username)) : null;
      // Same message either way so accounts can't be probed.
      if (!user || !(await verifyPassword(password, user.pw))) return err("Wrong username/email or password.", 401);
      const { token, maxAge } = makeSession(user);
      const res = NextResponse.json({ ok: true, user: publicUser(user) });
      res.headers.append("Set-Cookie", sessionCookie(token, maxAge));
      return res;
    }

    if (action === "forgot") {
      if (!emailEnabled()) return err("Password reset by email isn't switched on yet.", 503);
      if ((await hit(`vc_rl_forgot:${ip}`, 3600)) > 6) return err("Too many requests. Try again later.", 429);
      const email = normalizeEmail(body.email);
      // Always answer the same way, whether or not the address has an account.
      if (email && (await hit(`vc_rl_forgot_e:${email}`, 3600)) <= 3) {
        const username = await getJSON<string>(emailKey(email));
        const user = username ? await getJSON<User>(userKey(username)) : null;
        if (user) {
          const token = await issueToken("reset", user.username, 3600);
          await sendEmail({ to: user.email, ...resetEmail(user.name, `${siteUrl(req)}/community/reset?token=${token}`) });
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "reset") {
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length < 8 || password.length > 100) return err("Password must be at least 8 characters.");
      if ((await hit(`vc_rl_reset:${ip}`, 900)) > 10) return err("Too many attempts. Wait a few minutes.", 429);
      const username = await consumeToken("reset", body.token);
      const user = username ? await getJSON<User>(userKey(username)) : null;
      if (!user) return err("That reset link is invalid or has expired. Request a new one.");
      user.pw = await hashPassword(password);
      user.sv = (user.sv || 0) + 1; // signs out every other device
      user.emailVerified = true; // they just proved they own the inbox
      await setJSON(userKey(user.username), user);
      const { token, maxAge } = makeSession(user);
      const res = NextResponse.json({ ok: true, user: publicUser(user) });
      res.headers.append("Set-Cookie", sessionCookie(token, maxAge));
      return res;
    }

    if (action === "resend") {
      if (!emailEnabled()) return err("Email isn't switched on yet.", 503);
      const session = await getSessionUser(req);
      if (!session) return err("Please log in first.", 401);
      const user = await getJSON<User>(userKey(session.username));
      if (!user) return err("Please log in first.", 401);
      if (user.emailVerified) return NextResponse.json({ ok: true, already: true });
      if ((await hit(`vc_rl_resend:${user.username}`, 3600)) > 3) return err("Too many emails — try again in a while.", 429);
      return NextResponse.json({ ok: await sendVerification(req, user) });
    }

    return err("Not found.", 404);
  } catch (error) {
    console.error("Auth error:", error);
    return err("Something went wrong. Try again.", 500);
  }
}
