import { NextResponse } from "next/server";
import { getJSON, setJSON, mgetJSON, hit } from "@/lib/kv";
import {
  FEED_KEY,
  LIMITS,
  TOPIC_IDS,
  postKey,
  hashUid,
  newId,
  cleanText,
  cleanName,
  rejectReason,
  toView,
  type Post,
  type TopicId,
} from "@/lib/community";

const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/community?uid=...&topic=quantum  -> { posts }
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const uid = url.searchParams.get("uid") || "";
    const topic = url.searchParams.get("topic") || "";
    const me = uid ? hashUid(uid) : "";

    const ids = (await getJSON<string[]>(FEED_KEY)) || [];
    const posts = (await mgetJSON<Post>(ids.slice(0, LIMITS.feedKeep).map(postKey)))
      .filter((p): p is Post => !!p && !p.hidden)
      .filter((p) => !topic || p.topic === topic)
      .slice(0, LIMITS.feedShow)
      .map((p) => toView(p, me));

    return NextResponse.json({ posts }, { headers: NO_STORE });
  } catch (error) {
    console.error("Community read error:", error);
    return NextResponse.json({ posts: [] }, { headers: NO_STORE });
  }
}

// POST /api/community { uid, name, topic, text, image?, website? } -> { ok, post }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

    // Honeypot: bots fill the hidden field, people never see it.
    if (body.website) return NextResponse.json({ ok: true });

    const uid = cleanText(body.uid, 64);
    if (uid.length < 8) return NextResponse.json({ error: "Bad request." }, { status: 400 });
    const me = hashUid(uid);

    const text = cleanText(body.text, LIMITS.text);
    const image =
      typeof body.image === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(body.image)
        ? body.image
        : undefined;
    if (image && image.length > LIMITS.imageChars) {
      return NextResponse.json({ error: "That photo is too large." }, { status: 413 });
    }
    if (!text && !image) {
      return NextResponse.json({ error: "Write something or add a photo." }, { status: 400 });
    }
    const reason = rejectReason(text);
    if (reason) return NextResponse.json({ error: reason }, { status: 400 });

    const topic: TopicId = TOPIC_IDS.includes(body.topic) ? body.topic : "spirit";

    if ((await hit(`vc_rl_post:${me}`, 3600)) > LIMITS.postsPerHour) {
      return NextResponse.json({ error: "You're posting fast — try again in a bit." }, { status: 429 });
    }

    const post: Post = {
      id: newId(),
      uid: me,
      name: cleanName(body.name),
      topic,
      text,
      image,
      ts: Date.now(),
      likes: [],
      comments: [],
      reports: [],
      hidden: false,
    };

    await setJSON(postKey(post.id), post);
    const ids = (await getJSON<string[]>(FEED_KEY)) || [];
    await setJSON(FEED_KEY, [post.id, ...ids].slice(0, LIMITS.feedKeep));

    return NextResponse.json({ ok: true, post: toView(post, me) });
  } catch (error) {
    console.error("Community write error:", error);
    return NextResponse.json({ error: "Could not post. Try again." }, { status: 500 });
  }
}
