import { NextResponse } from "next/server";
import { getJSON, setJSON, del, hit } from "@/lib/kv";
import { getSessionUser, sameOrigin } from "@/lib/auth";
import {
  FEED_KEY,
  LIMITS,
  postKey,
  newId,
  cleanText,
  rejectReason,
  toView,
  type Post,
} from "@/lib/community";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/community/:id { action: "like" | "comment" | "report", text? }   (login required)
export async function POST(req: Request, { params }: Ctx) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });
    const me = user.username;

    if ((await hit(`vc_rl_act:${me}`, 60)) > LIMITS.actionsPerMinute) {
      return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
    }

    const post = await getJSON<Post>(postKey(id));
    if (!post || post.hidden) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    const action = body.action;
    if (action === "like") {
      const i = post.likes.indexOf(me);
      if (i >= 0) post.likes.splice(i, 1);
      else post.likes = [...post.likes, me].slice(-LIMITS.likesKeep);
    } else if (action === "comment") {
      const text = cleanText(body.text, LIMITS.comment);
      if (!text) return NextResponse.json({ error: "Write a comment first." }, { status: 400 });
      const reason = rejectReason(text);
      if (reason) return NextResponse.json({ error: reason }, { status: 400 });
      post.comments = [
        ...post.comments,
        { id: newId(), author: me, name: user.name, text, ts: Date.now() },
      ].slice(-LIMITS.commentsKeep);
    } else if (action === "report") {
      if (!post.reports.includes(me)) post.reports.push(me);
      if (post.reports.length >= LIMITS.hideAfterReports) post.hidden = true;
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    await setJSON(postKey(id), post);
    return NextResponse.json({ ok: true, post: toView(post, me), hidden: post.hidden });
  } catch (error) {
    console.error("Community action error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE /api/community/:id — the author, or an admin via header x-admin-key: $COMMUNITY_ADMIN_KEY
export async function DELETE(req: Request, { params }: Ctx) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Bad request." }, { status: 403 });
    const { id } = await params;
    const post = await getJSON<Post>(postKey(id));
    if (!post) return NextResponse.json({ ok: true });

    const adminKey = process.env.COMMUNITY_ADMIN_KEY;
    const isAdmin = Boolean(adminKey) && req.headers.get("x-admin-key") === adminKey;
    const user = await getSessionUser(req);
    const isOwner = Boolean(user) && user!.username === post.author;
    if (!isAdmin && !isOwner) return NextResponse.json({ error: "Not allowed." }, { status: 403 });

    await del(postKey(id));
    const ids = (await getJSON<string[]>(FEED_KEY)) || [];
    await setJSON(FEED_KEY, ids.filter((x) => x !== id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Community delete error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
