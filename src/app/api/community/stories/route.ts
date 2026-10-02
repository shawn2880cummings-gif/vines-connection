import { NextResponse } from "next/server";
import { getJSON, setJSON, del, mgetJSON, hit } from "@/lib/kv";
import { getSessionUser, sameOrigin } from "@/lib/auth";
import {
  STORIES_KEY,
  LIMITS,
  storyKey,
  newId,
  cleanText,
  cleanImage,
  cleanVideo,
  rejectReason,
  toStoryView,
  type Story,
} from "@/lib/community";

const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/community/stories -> { stories }  (public; last 24 hours, newest first)
export async function GET(req: Request) {
  try {
    const me = (await getSessionUser(req))?.username || "";
    const ids = (await getJSON<string[]>(STORIES_KEY)) || [];
    const cutoff = Date.now() - LIMITS.storyTtlMs;
    const stories = (await mgetJSON<Story>(ids.map(storyKey)))
      .filter((s): s is Story => !!s && !s.hidden && s.ts > cutoff)
      .map((s) => toStoryView(s, me));
    return NextResponse.json({ stories }, { headers: NO_STORE });
  } catch (error) {
    console.error("Stories read error:", error);
    return NextResponse.json({ stories: [] }, { headers: NO_STORE });
  }
}

// POST /api/community/stories
//   create: { image? | video?, caption? }       report: { action: "report", id }
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Please log in to share a story." }, { status: 401 });
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

    if (body.action === "report") {
      const story = await getJSON<Story>(storyKey(String(body.id || "")));
      if (!story) return NextResponse.json({ ok: true });
      if (!story.reports.includes(user.username)) story.reports.push(user.username);
      if (story.reports.length >= LIMITS.hideAfterReports) story.hidden = true;
      await setJSON(storyKey(story.id), story);
      return NextResponse.json({ ok: true, hidden: story.hidden });
    }

    const image = cleanImage(body.image);
    const video = cleanVideo(body.video);
    if (image === "bad" || video === "bad") {
      return NextResponse.json({ error: "That media couldn't be used." }, { status: 400 });
    }
    if (!image && !video) {
      return NextResponse.json({ error: "Add a photo or video for your story." }, { status: 400 });
    }
    const caption = cleanText(body.caption, LIMITS.caption);
    const reason = rejectReason(caption);
    if (reason) return NextResponse.json({ error: reason }, { status: 400 });

    if ((await hit(`vc_rl_story:${user.username}`, 3600)) > LIMITS.storiesPerHour) {
      return NextResponse.json({ error: "That's a lot of stories — try again later." }, { status: 429 });
    }

    const story: Story = {
      id: newId(),
      author: user.username,
      name: user.name,
      image,
      video,
      caption,
      ts: Date.now(),
      reports: [],
      hidden: false,
    };
    await setJSON(storyKey(story.id), story);
    const cutoff = Date.now() - LIMITS.storyTtlMs;
    const old = (await getJSON<string[]>(STORIES_KEY)) || [];
    const fresh = (await mgetJSON<Story>(old.map(storyKey))).map((s, i) => (s && s.ts > cutoff ? old[i] : null));
    const ids = [story.id, ...fresh.filter((x): x is string => !!x)].slice(0, LIMITS.storiesKeep);
    await setJSON(STORIES_KEY, ids);
    // expired story bodies are no longer referenced; remove them
    await Promise.all(old.filter((_, i) => !fresh[i]).slice(0, 20).map((id) => del(storyKey(id))));

    return NextResponse.json({ ok: true, story: toStoryView(story, user.username) });
  } catch (error) {
    console.error("Story write error:", error);
    return NextResponse.json({ error: "Could not share your story." }, { status: 500 });
  }
}

// DELETE /api/community/stories?id=...  — the author or an admin (x-admin-key)
export async function DELETE(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });
    const id = new URL(req.url).searchParams.get("id") || "";
    const story = await getJSON<Story>(storyKey(id));
    if (!story) return NextResponse.json({ ok: true });

    const adminKey = process.env.COMMUNITY_ADMIN_KEY;
    const isAdmin = Boolean(adminKey) && req.headers.get("x-admin-key") === adminKey;
    const user = await getSessionUser(req);
    if (!isAdmin && user?.username !== story.author) {
      return NextResponse.json({ error: "Not allowed." }, { status: 403 });
    }
    await del(storyKey(id));
    const ids = (await getJSON<string[]>(STORIES_KEY)) || [];
    await setJSON(STORIES_KEY, ids.filter((x) => x !== id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Story delete error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
