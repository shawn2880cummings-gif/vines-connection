// Tiny storage layer for community features.
// Uses Vercel KV / Upstash Redis over REST when connected
// (KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/TOKEN) and
// falls back to per-instance memory so previews work before a store is attached.

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
export const hasKV = Boolean(kvUrl && kvToken);

const mem = globalThis as unknown as { __vcMem?: Map<string, string> };
const memory = (mem.__vcMem ??= new Map<string, string>());

async function cmd(args: (string | number)[]): Promise<unknown> {
  const res = await fetch(kvUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  const data = await res.json();
  return data.result;
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = hasKV ? ((await cmd(["GET", key])) as string | null) : memory.get(key) ?? null;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  if (hasKV) await cmd(["SET", key, raw]);
  else memory.set(key, raw);
}

// Atomically create a key only if it doesn't exist yet. Returns true if created.
export async function setIfAbsent(key: string, value: unknown): Promise<boolean> {
  const raw = JSON.stringify(value);
  if (hasKV) return (await cmd(["SET", key, raw, "NX"])) === "OK";
  if (memory.has(key)) return false;
  memory.set(key, raw);
  return true;
}

export async function mgetJSON<T>(keys: string[]): Promise<(T | null)[]> {
  if (!keys.length) return [];
  const raws = hasKV
    ? ((await cmd(["MGET", ...keys])) as (string | null)[])
    : keys.map((k) => memory.get(k) ?? null);
  return raws.map((r) => {
    if (!r) return null;
    try {
      return JSON.parse(r) as T;
    } catch {
      return null;
    }
  });
}

export async function del(key: string): Promise<void> {
  if (hasKV) await cmd(["DEL", key]);
  else memory.delete(key);
}

// Count hits per key inside a time window (used for rate limiting).
export async function hit(key: string, windowSeconds: number): Promise<number> {
  if (hasKV) {
    const n = (await cmd(["INCR", key])) as number;
    if (n === 1) await cmd(["EXPIRE", key, windowSeconds]);
    return n;
  }
  const bucket = `${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
  const n = Number(memory.get(bucket) ?? 0) + 1;
  memory.set(bucket, String(n));
  return n;
}
