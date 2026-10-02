import { NextResponse } from "next/server";
import { getJSON, setJSON, setText, del, hit, smembers, zadd, zrem, zpage, zpageMany } from "@/lib/kv";
import { getSessionUser, requireWriter, sameOrigin } from "@/lib/auth";
import {
  STORIES_KEY,
  LIMITS,
  storyKey,
  imgKey,
  userStoriesKey,
  followingKey,
  newId,
  cleanText,
  cleanImage,
  cleanVideo,
  rejectReason,
  type Story,
} from "@/lib/community";
import { hydrateStories, loadStories } from "@/lib/social";

const NO_STORE = { "Cache-Control": "no-store" };
const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

// GET /api/community/stories -> { stories }  (last 24h; people you follow + you, or everyone if you follow no one)
export async function GET(req: Request) {
  try {
    const me = (await getSessionUser(req))?.username || "";
    const following = me ? (await smembers(followingKey(me))).slice(0, LIMITS.followCap) : [];
    let ids: string[];
    if (me && following.length) {
      const lists = await zpageMany([...following, me].map(userStoriesKey), null, 10);
      ids = lists.flat().map((r) => r.member);
    } else {
      ids = (await zpage(STORIES_KEY, null, 80)).map((r) => r.member);
    }
    const stories = (await loadStories(ids)).sort((a, b) => a.ts - b.ts);
    return NextResponse.json({ stories: await hydrateStories(stories, me), scope: me && following.length ? "following" : "all" }, { headers: NO_STORE });
  } catch (error) {
    console.error("Stories read error:", error);
    return NextResponse.json({ stories: [], scope: "all" }, { headers: NO_STORE });
  }
}

async function sweepExpired() {
  const cutoff = Date.now() - LIMITS.storyTtlMs;
  const old = await zpage(STORIES_KEY, cutoff, 10);
  for (const row of old) {
    const s = await getJSON<Story>(storyKey(row.member));
    await zrem(STORIES_KEY, row.member);
    if (s) await zrem(userStoriesKey(s.author), row.member);
    await del(storyKey(row.member), imgKey(row.member));
  }
}

// POST /api/community/stories   create: { image? | video?, caption? }   report: { action: "report", id }
export async function POST(req: Request) {
  try {
    const auth = await requireWriter(req);
    if (auth.res) return auth.res;
    const me = auth.user.username;
    const body = await req.json().catch(() => null);
    if (!body) return err("Bad request.");

    if (body.action === "report") {
      const story = await getJSON<Story>(storyKey(String(body.id || "")));
      if (!story) return NextResponse.json({ ok: true });
      if (!story.reports.includes(me)) story.reports.push(me);
      if (story.reports.length >= LIMITS.hideAfterReports) story.hidden = true;
      await setJSON(storyKey(story.id), story);
      return NextResponse.json({ ok: true, hidden: story.hidden });
    }

    const video = cleanVideo(body.video);
    const image = video ? undefined : cleanImage(body.image);
    if (image === "bad" || video === "bad") return err("That media couldn't be used.");
    if (!image && !video) return err("Add a photo or video for your story.");
    const caption = cleanText(body.caption, LIMITS.caption);
    const reason = rejectReason(caption);
    if (reason) return err(reason);

    if ((await hit(`vc_rl_story:${me}`, 3600)) > LIMITS.storiesPerHour) return err("That's a lot of stories — try again later.", 429);

    const id = newId();
    const ts = Date.now();
    const story: Story = {
      id,
      author: me,
      hasImage: Boolean(image),
      video: video ? { url: video.url, hasPoster: Boolean(video.poster) } : undefined,
      caption,
      ts,
      reports: [],
      hidden: false,
    };
    const bytes = image || video?.poster;
    if (bytes) await setText(imgKey(id), bytes);
    await setJSON(storyKey(id), story);
    await zadd(STORIES_KEY, ts, id);
    await zadd(userStoriesKey(me), ts, id);
    await sweepExpired();

    const [view] = await hydrateStories([story], me);
    return NextResponse.json({ ok: true, story: view });
  } catch (error) {
    console.error("Story write error:", error);
    return err("Could not share your story.", 500);
  }
}

// DELETE /api/community/stories?id=...  — the author or an admin (x-admin-key)
export async function DELETE(req: Request) {
  try {
    if (!sameOrigin(req)) return err("Bad request.", 403);
    const id = new URL(req.url).searchParams.get("id") || "";
    const story = await getJSON<Story>(storyKey(id));
    if (!story) return NextResponse.json({ ok: true });

    const adminKey = process.env.COMMUNITY_ADMIN_KEY;
    const isAdmin = Boolean(adminKey) && req.headers.get("x-admin-key") === adminKey;
    const user = await getSessionUser(req);
    if (!isAdmin && user?.username !== story.author) return err("Not allowed.", 403);

    await zrem(STORIES_KEY, id);
    await zrem(userStoriesKey(story.author), id);
    await del(storyKey(id), imgKey(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Story delete error:", error);
    return err("Something went wrong.", 500);
  }
}
