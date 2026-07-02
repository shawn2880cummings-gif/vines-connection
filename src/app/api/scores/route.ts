import { NextResponse } from "next/server";

// Magnet Run global leaderboard.
// GET  -> { scores: [{ n: "ABC", s: 1234 }, ...] }  (best first, max 10)
// POST { n, s } -> { ok, rank, scores }
//
// Storage: Vercel KV / Upstash Redis via REST when connected
// (KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/
// UPSTASH_REDIS_REST_TOKEN). Falls back to per-instance memory so the
// feature still works before a store is attached.

type Entry = { n: string; s: number };

const KEY = "mr_scores";
const MAX_KEEP = 10;

const kvUrl =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const kvToken =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const hasKV = Boolean(kvUrl && kvToken);

// Memory fallback (per warm serverless instance — fine for dev/preview,
// attach a KV store in Vercel for permanent global scores).
const g = globalThis as unknown as { __mrScores?: Entry[] };

async function loadScores(): Promise<Entry[]> {
  if (!hasKV) return g.__mrScores || [];
  const res = await fetch(`${kvUrl}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${kvToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  if (!data || typeof data.result !== "string") return [];
  try {
    const list = JSON.parse(data.result);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function saveScores(list: Entry[]): Promise<void> {
  if (!hasKV) {
    g.__mrScores = list;
    return;
  }
  await fetch(`${kvUrl}/set/${KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}` },
    body: JSON.stringify(list),
  });
}

function sanitize(list: Entry[]): Entry[] {
  return list
    .filter(
      (e) =>
        e &&
        typeof e.n === "string" &&
        /^[A-Z0-9]{1,3}$/.test(e.n) &&
        Number.isFinite(e.s)
    )
    .map((e) => ({ n: e.n, s: Math.floor(e.s) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, MAX_KEEP);
}

// Kid-safe: block crude 3-letter combos.
const BLOCKED = new Set([
  "ASS", "FUK", "FUC", "FCK", "FKU", "SEX", "FAG", "NIG", "NGR", "NGA",
  "KKK", "COK", "COX", "DIC", "DIK", "DCK", "CUM", "TIT", "HOE", "CNT",
  "VAG", "PNS", "PIS", "POO", "KYS", "DIE", "WTF", "STD", "XXX",
]);

export async function GET() {
  try {
    const scores = sanitize(await loadScores()).slice(0, MAX_KEEP);
    return NextResponse.json(
      { scores, persistent: hasKV },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Leaderboard read error:", error);
    return NextResponse.json({ scores: [], persistent: false });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const rawName = typeof body?.n === "string" ? body.n : "";
    const rawScore = Number(body?.s);

    const name = rawName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
    if (!/^[A-Z0-9]{1,3}$/.test(name) || BLOCKED.has(name)) {
      return NextResponse.json({ error: "Pick different initials." }, { status: 400 });
    }
    if (!Number.isFinite(rawScore) || rawScore < 1 || rawScore > 99999) {
      return NextResponse.json({ error: "Invalid score." }, { status: 400 });
    }
    const score = Math.floor(rawScore);

    const list = sanitize(await loadScores());
    list.push({ n: name, s: score });
    const merged = sanitize(list);
    await saveScores(merged);

    const rank = merged.findIndex((e) => e.n === name && e.s === score) + 1;
    return NextResponse.json({ ok: true, rank: rank || null, scores: merged });
  } catch (error) {
    console.error("Leaderboard write error:", error);
    return NextResponse.json({ error: "Could not save score." }, { status: 500 });
  }
}
