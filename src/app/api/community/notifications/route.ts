import { NextResponse } from "next/server";
import { getNum, del } from "@/lib/kv";
import { getSessionUser, sameOrigin } from "@/lib/auth";
import { unreadKey } from "@/lib/community";
import { listNotifications } from "@/lib/social";

const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/community/notifications -> { notifications, unread }
export async function GET(req: Request) {
  const me = (await getSessionUser(req))?.username;
  if (!me) return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  const [notifications, unread] = await Promise.all([listNotifications(me), getNum(unreadKey(me))]);
  return NextResponse.json({ notifications, unread }, { headers: NO_STORE });
}

// POST /api/community/notifications — mark everything as read
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });
  const me = (await getSessionUser(req))?.username;
  if (!me) return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  await del(unreadKey(me));
  return NextResponse.json({ ok: true });
}
