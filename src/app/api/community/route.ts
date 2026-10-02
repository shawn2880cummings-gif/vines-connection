import { NextResponse } from "next/server";
import { getJSON, setJSON, mgetJSON, hit } from "@/lib/kv";
import { getSessionUser, sameOrigin } from "@/lib/auth";
import {
  FEED_KEY,
  LIMITS,
  TOPIC_IDS,
  postKey,
  newId,
  cleanText,
  cleanImage,
  cleanVideo,
  rejectReason,
  toView,
  type Post,
  type TopicId,
} from "@/lib/community";

const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/community?topic=quantum  -> { posts }   (public; `liked`/`mine` need a login)
export async function GET(req: Request) {
  try {
    const topic = new URL(req.url).searchParams.get("topic") || "";
    const me = (await getSessionUser(req))?.username || "";

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

// POST /api/community { topic, text, image?, video?, website? } -> { ok, post }   (login required)
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Please log in to post." }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

    // Honeypot: bots fill the hidden field, people never see it.
    if (body.website) return NextResponse.json({ ok: true });

    const text = cleanText(body.text, LIMITS.text);
    const image = cleanImage(body.image);
    const video = cleanVideo(body.video);
    if (image === "bad" || video === "bad") {
      return NextResponse.json({ error: "That media couldn't be used." }, { status: 400 });
    }
    if (!text && !image && !video) {
      return NextResponse.json({ error: "Write something or add a photo or video." }, { status: 400 });
    }
    const reason = rejectReason(text);
    if (reason) return NextResponse.json({ error: reason }, { status: 400 });

    const topic: TopicId = TOPIC_IDS.includes(body.topic) ? body.topic : "spirit";

    if ((await hit(`vc_rl_post:${user.username}`, 3600)) > LIMITS.postsPerHour) {
      return NextResponse.json({ error: "You're posting fast — try again in a bit." }, { status: 429 });
    }

    const post: Post = {
      id: newId(),
      author: user.username,
      name: user.name,
      topic,
      text,
      image,
      video,
      ts: Date.now(),
      likes: [],
      comments: [],
      reports: [],
      hidden: false,
    };

    await setJSON(postKey(post.id), post);
    const ids = (await getJSON<string[]>(FEED_KEY)) || [];
    await setJSON(FEED_KEY, [post.id, ...ids].slice(0, LIMITS.feedKeep));

    return NextResponse.json({ ok: true, post: toView(post, user.username) });
  } catch (error) {
    console.error("Community write error:", error);
    return NextResponse.json({ error: "Could not post. Try again." }, { status: 500 });
  }
}
