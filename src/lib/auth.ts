import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHmac, createHash } from "crypto";
import { promisify } from "util";
import { getJSON } from "@/lib/kv";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export type User = {
  username: string; // lowercase handle, the account id
  name: string; // display name
  pw: string; // "s1:<salt>:<hash>"
  created: number;
};

export type SessionUser = { username: string; name: string };

export const COOKIE = "vc_session";
const SESSION_DAYS = 30;
export const userKey = (username: string) => `vc_user:${username}`;

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

export function makeSession(username: string): { token: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 3600;
  const body = Buffer.from(`${username}|${Math.floor(Date.now() / 1000) + maxAge}`).toString("base64url");
  return { token: `${body}.${sign(body)}`, maxAge };
}

function readSession(token: string): string | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const want = sign(body);
  if (sig.length !== want.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  const [username, exp] = Buffer.from(body, "base64url").toString().split("|");
  if (!username || !exp || Number(exp) < Date.now() / 1000) return null;
  return username;
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
  const username = readSession(token);
  if (!username) return null;
  const user = await getJSON<User>(userKey(username));
  return user ? { username: user.username, name: user.name } : null;
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
