import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHmac, createHash } from "crypto";
import { promisify } from "util";
import { NextResponse } from "next/server";
import { getJSON, setJSON, del } from "@/lib/kv";
import { emailEnabled } from "@/lib/email";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export type User = {
  username: string; // lowercase handle, the account id
  name: string; // display name
  pw: string; // "s1:<salt>:<hash>"
  created: number;
  email: string;
  emailVerified: boolean;
  sv: number; // session version — bumped on password reset to sign out other devices
  bio: string;
  av: number; // avatar version (0 = no avatar)
};

export type SessionUser = { username: string; name: string; emailVerified: boolean; av: number };

export const COOKIE = "vc_session";
const SESSION_DAYS = 30;
export const userKey = (username: string) => `vc_user:${username}`;
export const emailKey = (email: string) => `vc_email:${email}`;
export const USERNAMES_KEY = "vc_usernames";

const RESERVED = new Set([
  "admin", "administrator", "root", "support", "staff", "mod", "moderator",
  "vine", "vines", "vinesconnection", "shawn", "system", "official", "null",
]);

export function normalizeUsername(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const u = s.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return null;
  if (RESERVED.has(u)) return null;
  return u;
}

export function normalizeEmail(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const e = s.trim().toLowerCase();
  if (e.length > 254 || !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(e)) return null;
  return e;
}

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(pw, salt, 32);
  return `s1:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [v, saltHex, hashHex] = stored.split(":");
  if (v !== "s1" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(pw, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Session signing secret. AUTH_SECRET wins; otherwise derive from the database
// token so it is stable across serverless instances; otherwise a random
// per-instance secret (sessions then only work on that instance — never forgeable).
const g = globalThis as unknown as { __vcSecret?: string };
function secret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  const kv = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kv) return createHash("sha256").update("vc-session|" + kv).digest("hex");
  return (g.__vcSecret ??= randomBytes(32).toString("hex"));
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function makeSession(user: Pick<User, "username" | "sv">): { token: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 3600;
  const body = Buffer.from(`${user.username}|${Math.floor(Date.now() / 1000) + maxAge}|${user.sv || 0}`).toString("base64url");
  return { token: `${body}.${sign(body)}`, maxAge };
}

function readSession(token: string): { username: string; sv: number } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const want = sign(body);
  if (sig.length !== want.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  const [username, exp, sv] = Buffer.from(body, "base64url").toString().split("|");
  if (!username || !exp || Number(exp) < Date.now() / 1000) return null;
  return { username, sv: Number(sv || 0) };
}

function readCookie(req: Request, name: string): string {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return "";
}

// The signed-in user for a request (verified against the stored account), or null.
export async function getSessionUser(req: Request): Promise<SessionUser | null> {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const s = readSession(token);
  if (!s) return null;
  const user = await getJSON<User>(userKey(s.username));
  if (!user || (user.sv || 0) !== s.sv) return null;
  return { username: user.username, name: user.name, emailVerified: Boolean(user.emailVerified), av: user.av || 0 };
}

// For actions that create content: must be logged in, and — once email sending is
// configured — must have confirmed their email.
export async function requireWriter(
  req: Request
): Promise<{ user: SessionUser; res?: undefined } | { user?: undefined; res: NextResponse }> {
  if (!sameOrigin(req)) return { res: NextResponse.json({ error: "Bad request." }, { status: 403 }) };
  const user = await getSessionUser(req);
  if (!user) return { res: NextResponse.json({ error: "Please log in first." }, { status: 401 }) };
  if (emailEnabled() && !user.emailVerified) {
    return {
      res: NextResponse.json({ error: "Please confirm your email first — check your inbox.", needsVerify: true }, { status: 403 }),
    };
  }
  return { user };
}

export function sessionCookie(token: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// Reject cross-site form posts: if the browser sent an Origin, it must be this site.
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}

// Base URL for links inside emails. Prefer SITE_URL; otherwise trust the request
// host only if it is one of our own domains (prevents poisoned reset links).
export function siteUrl(req: Request): string {
  const env = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const ok = /(^|\.)vinesconnection\.info$/.test(host) || /\.vercel\.app$/.test(host) || /^localhost(:\d+)?$/.test(host) || /^127\.0\.0\.1(:\d+)?$/.test(host);
  if (!ok) return "https://vinesconnection.info";
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return `${proto}://${host}`;
}

// ---- single-use email tokens (only a hash is stored) ----
type TokenKind = "verify" | "reset";
const tokKey = (kind: TokenKind, raw: string) => `vc_tok:${kind}:${createHash("sha256").update(raw).digest("hex")}`;

export async function issueToken(kind: TokenKind, username: string, ttlSeconds: number): Promise<string> {
  const raw = randomBytes(32).toString("hex");
  await setJSON(tokKey(kind, raw), { u: username, exp: Date.now() + ttlSeconds * 1000 });
  return raw;
}

// Returns the username if the token is valid, and burns it.
export async function consumeToken(kind: TokenKind, raw: unknown): Promise<string | null> {
  if (typeof raw !== "string" || !/^[a-f0-9]{64}$/.test(raw)) return null;
  const key = tokKey(kind, raw);
  const t = await getJSON<{ u: string; exp: number }>(key);
  if (!t) return null;
  await del(key);
  return t.exp > Date.now() ? t.u : null;
}
