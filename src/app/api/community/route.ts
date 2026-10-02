import { NextResponse } from "next/server";
import { setJSON, setText, hit } from "@/lib/kv";
import { getSessionUser, requireWriter } from "@/lib/auth";
import {
  FEED_KEY,
  LIMITS,
  TOPIC_IDS,
  postKey,
  imgKey,
  tagKey,
  topicKey,
  newId,
  cleanText,
  cleanImage,
  cleanVideo,
  rejectReason,
  extractTags,
  type Post,
  type TopicId,
} from "@/lib/community";
import { followingFeed, hydratePosts, indexPost, notifyMentions, postsFromKey } from "@/lib/social";

const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/community?scope=explore|following&topic=&tag=&before=<score>
export async function GET(req: Request) {
  try {
    const q = new URL(req.url).searchParams;
    const me = (await getSessionUser(req))?.username || "";
    const topic = q.get("topic") || "";
    const tag = (q.get("tag") || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
    const beforeRaw = q.get("before");
    const before = beforeRaw && Number.isFinite(Number(beforeRaw)) ? Number(beforeRaw) : null;
    const scope = q.get("scope") === "following" && me ? "following" : "explore";

    let page;
    if (tag) page = await postsFromKey(tagKey(tag), before, me);
    else if (scope === "following") page = await followingFeed(me, before);
    else if (TOPIC_IDS.includes(topic)) page = await postsFromKey(topicKey(topic), before, me);
    else page = await postsFromKey(FEED_KEY, before, me);

    const posts = scope === "following" && TOPIC_IDS.includes(topic) ? page.items.filter((p) => p.topic === topic) : page.items;
    return NextResponse.json({ posts, next: page.next, scope }, { headers: NO_STORE });
  } catch (error) {
    console.error("Community read error:", error);
    return NextResponse.json({ posts: [], next: null, scope: "explore" }, { headers: NO_STORE });
  }
}

// POST /api/community { topic, text, image?, video?, website? } -> { ok, post }
export async function POST(req: Request) {
  try {
    const auth = await requireWriter(req);
    if (auth.res) return auth.res;
    const user = auth.user;

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

    // Honeypot: bots fill the hidden field, people never see it.
    if (body.website) return NextResponse.json({ ok: true });

    const text = cleanText(body.text, LIMITS.text);
    const video = cleanVideo(body.video);
    const image = video ? undefined : cleanImage(body.image);
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

    const id = newId();
    const ts = Date.now();
    const post: Post = {
      id,
      author: user.username,
      topic,
      text,
      hasImage: Boolean(image),
      video: video ? { url: video.url, hasPoster: Boolean(video.poster) } : undefined,
      tags: extractTags(text),
      ts,
      score: ts + Math.random() * 0.9,
      likes: [],
      comments: [],
      reports: [],
      hidden: false,
    };
    const bytes = image || video?.poster;
    if (bytes) await setText(imgKey(id), bytes);
    await setJSON(postKey(id), post);
    await indexPost(post);
    await notifyMentions(text, user.username, id);

    const [view] = await hydratePosts([post], user.username);
    return NextResponse.json({ ok: true, post: view });
  } catch (error) {
    console.error("Community write error:", error);
    return NextResponse.json({ error: "Could not post. Try again." }, { status: 500 });
  }
}
