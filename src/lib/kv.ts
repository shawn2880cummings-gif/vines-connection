// Storage layer for community features.
// Uses Vercel KV / Upstash Redis over REST when connected
// (KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/TOKEN) and
// falls back to per-instance memory so previews work before a store is attached.

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
export const hasKV = Boolean(kvUrl && kvToken);

type Mem = {
  str: Map<string, string>;
  set: Map<string, Set<string>>;
  zset: Map<string, Map<string, number>>;
  list: Map<string, string[]>;
};
const g = globalThis as unknown as { __vcMem?: Mem };
const mem: Mem = (g.__vcMem ??= { str: new Map(), set: new Map(), zset: new Map(), list: new Map() });

type Arg = string | number;

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(kvUrl + path, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  return res.json();
}

async function cmd(args: Arg[]): Promise<unknown> {
  return ((await post("", args)) as { result: unknown }).result;
}

// Run several commands in one round trip. Results come back in order.
export async function pipeline(cmds: Arg[][]): Promise<unknown[]> {
  if (!cmds.length) return [];
  if (!hasKV) return Promise.all(cmds.map((c) => memCmd(c)));
  const out = (await post("/pipeline", cmds)) as { result?: unknown; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

// ---- in-memory implementation of the commands we use ----
function sortedZ(key: string, desc: boolean): [string, number][] {
  const z = mem.zset.get(key);
  if (!z) return [];
  return [...z.entries()].sort((a, b) => (desc ? b[1] - a[1] : a[1] - b[1]) || (a[0] < b[0] ? 1 : -1));
}

async function memCmd(a: Arg[]): Promise<unknown> {
  const [op, key, ...rest] = a as string[];
  const K = String(key);
  switch (op.toUpperCase()) {
    case "GET":
      return mem.str.get(K) ?? null;
    case "SET": {
      if (rest.includes("NX") && mem.str.has(K)) return null;
      mem.str.set(K, String(rest[0]));
      return "OK";
    }
    case "DEL":
      for (const k of [K, ...rest]) {
        mem.str.delete(k);
        mem.set.delete(k);
        mem.zset.delete(k);
        mem.list.delete(k);
      }
      return 1;
    case "MGET":
      return [K, ...rest].map((k) => mem.str.get(k) ?? null);
    case "INCR": {
      const n = Number(mem.str.get(K) ?? 0) + 1;
      mem.str.set(K, String(n));
      return n;
    }
    case "DECR": {
      const n = Number(mem.str.get(K) ?? 0) - 1;
      mem.str.set(K, String(n));
      return n;
    }
    case "EXPIRE":
      return 1;
    case "SADD": {
      const s = mem.set.get(K) ?? new Set<string>();
      let n = 0;
      for (const m of rest) if (!s.has(m)) (s.add(m), n++);
      mem.set.set(K, s);
      return n;
    }
    case "SREM": {
      const s = mem.set.get(K);
      let n = 0;
      if (s) for (const m of rest) if (s.delete(m)) n++;
      return n;
    }
    case "SMEMBERS":
      return [...(mem.set.get(K) ?? [])];
    case "SCARD":
      return mem.set.get(K)?.size ?? 0;
    case "SISMEMBER":
      return mem.set.get(K)?.has(rest[0]) ? 1 : 0;
    case "ZADD": {
      const z = mem.zset.get(K) ?? new Map<string, number>();
      z.set(rest[1], Number(rest[0]));
      mem.zset.set(K, z);
      return 1;
    }
    case "ZREM": {
      const z = mem.zset.get(K);
      let n = 0;
      if (z) for (const m of rest) if (z.delete(m)) n++;
      return n;
    }
    case "ZCARD":
      return mem.zset.get(K)?.size ?? 0;
    case "ZSCORE": {
      const v = mem.zset.get(K)?.get(rest[0]);
      return v === undefined ? null : String(v);
    }
    case "ZINCRBY": {
      const z = mem.zset.get(K) ?? new Map<string, number>();
      const v = (z.get(rest[1]) ?? 0) + Number(rest[0]);
      z.set(rest[1], v);
      mem.zset.set(K, z);
      return String(v);
    }
    case "ZREVRANGEBYSCORE": {
      // key, max, min, [WITHSCORES], [LIMIT, offset, count]
      const maxS = rest[0], minS = rest[1];
      const maxEx = maxS.startsWith("(");
      const max = maxS === "+inf" ? Infinity : Number(maxEx ? maxS.slice(1) : maxS);
      const min = minS === "-inf" ? -Infinity : Number(minS);
      const withScores = rest.includes("WITHSCORES");
      const li = rest.indexOf("LIMIT");
      const off = li >= 0 ? Number(rest[li + 1]) : 0;
      const cnt = li >= 0 ? Number(rest[li + 2]) : Infinity;
      const rows = sortedZ(K, true).filter(([, s]) => (maxEx ? s < max : s <= max) && s >= min).slice(off, off + cnt);
      return withScores ? rows.flatMap(([m, s]) => [m, String(s)]) : rows.map(([m]) => m);
    }
    case "ZREVRANGE": {
      const start = Number(rest[0]);
      const stop = Number(rest[1]);
      const withScores = rest.includes("WITHSCORES");
      const all = sortedZ(K, true);
      const rows = all.slice(start, stop < 0 ? undefined : stop + 1);
      return withScores ? rows.flatMap(([m, s]) => [m, String(s)]) : rows.map(([m]) => m);
    }
    case "LPUSH": {
      const l = mem.list.get(K) ?? [];
      l.unshift(...rest.slice().reverse());
      mem.list.set(K, l);
      return l.length;
    }
    case "LTRIM": {
      const l = mem.list.get(K) ?? [];
      mem.list.set(K, l.slice(Number(rest[0]), Number(rest[1]) + 1));
      return "OK";
    }
    case "LRANGE": {
      const l = mem.list.get(K) ?? [];
      const stop = Number(rest[1]);
      return l.slice(Number(rest[0]), stop < 0 ? undefined : stop + 1);
    }
    default:
      throw new Error(`memCmd: unsupported ${op}`);
  }
}

export async function run(args: Arg[]): Promise<unknown> {
  return hasKV ? cmd(args) : memCmd(args);
}

// ---- JSON / text values ----
export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = (await run(["GET", key])) as string | null;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  await run(["SET", key, JSON.stringify(value)]);
}

export async function getText(key: string): Promise<string | null> {
  return ((await run(["GET", key])) as string | null) ?? null;
}

export async function setText(key: string, value: string): Promise<void> {
  await run(["SET", key, value]);
}

// Atomically create a key only if it doesn't exist yet. Returns true if created.
export async function setIfAbsent(key: string, value: unknown): Promise<boolean> {
  return (await run(["SET", key, JSON.stringify(value), "NX"])) === "OK";
}

export async function mgetJSON<T>(keys: string[]): Promise<(T | null)[]> {
  if (!keys.length) return [];
  const raws = (await run(["MGET", ...keys])) as (string | null)[];
  return raws.map((r) => {
    if (!r) return null;
    try {
      return JSON.parse(r) as T;
    } catch {
      return null;
    }
  });
}

export async function del(...keys: string[]): Promise<void> {
  if (keys.length) await run(["DEL", ...keys]);
}

// ---- counters / rate limiting ----
export async function incr(key: string): Promise<number> {
  return Number(await run(["INCR", key]));
}

export async function decr(key: string): Promise<number> {
  return Number(await run(["DECR", key]));
}

export async function getNum(key: string): Promise<number> {
  return Number((await run(["GET", key])) ?? 0);
}

// Count hits per key inside a time window (used for rate limiting).
export async function hit(key: string, windowSeconds: number): Promise<number> {
  if (hasKV) {
    const n = Number(await cmd(["INCR", key]));
    if (n === 1) await cmd(["EXPIRE", key, windowSeconds]);
    return n;
  }
  const bucket = `${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
  const n = Number(mem.str.get(bucket) ?? 0) + 1;
  mem.str.set(bucket, String(n));
  return n;
}

// ---- sets ----
export const sadd = async (key: string, member: string) => Number(await run(["SADD", key, member])) === 1;
export const srem = async (key: string, member: string) => Number(await run(["SREM", key, member])) === 1;
export const smembers = async (key: string) => ((await run(["SMEMBERS", key])) as string[]) || [];
export const scard = async (key: string) => Number(await run(["SCARD", key]));
export const sismember = async (key: string, member: string) => Number(await run(["SISMEMBER", key, member])) === 1;

// ---- sorted sets (score = time, member = id) ----
export const zadd = (key: string, score: number, member: string) => run(["ZADD", key, score, member]);
export const zrem = (key: string, member: string) => run(["ZREM", key, member]);
export const zcard = async (key: string) => Number(await run(["ZCARD", key]));
export const zincr = (key: string, by: number, member: string) => run(["ZINCRBY", key, by, member]);

export type Scored = { member: string; score: number };

function parseScored(flat: unknown): Scored[] {
  const a = (flat as string[]) || [];
  const out: Scored[] = [];
  for (let i = 0; i + 1 < a.length; i += 2) out.push({ member: a[i], score: Number(a[i + 1]) });
  return out;
}

export function zpageCmd(key: string, before: number | null, count: number): Arg[] {
  return ["ZREVRANGEBYSCORE", key, before === null ? "+inf" : `(${before}`, "-inf", "WITHSCORES", "LIMIT", 0, count];
}

// Newest-first page strictly older than `before`.
export async function zpage(key: string, before: number | null, count: number): Promise<Scored[]> {
  return parseScored(await run(zpageCmd(key, before, count)));
}

// Same, for many keys at once (one round trip).
export async function zpageMany(keys: string[], before: number | null, count: number): Promise<Scored[][]> {
  const res = await pipeline(keys.map((k) => zpageCmd(k, before, count)));
  return res.map(parseScored);
}

export async function ztop(key: string, count: number): Promise<Scored[]> {
  return parseScored(await run(["ZREVRANGE", key, 0, count - 1, "WITHSCORES"]));
}

// ---- lists (newest first) ----
export const lpush = (key: string, value: string) => run(["LPUSH", key, value]);
export const ltrim = (key: string, start: number, stop: number) => run(["LTRIM", key, start, stop]);
export const lrange = async (key: string, start: number, stop: number) =>
  ((await run(["LRANGE", key, start, stop])) as string[]) || [];
