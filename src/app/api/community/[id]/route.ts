import { NextResponse } from "next/server";
import { getJSON, setJSON, del, hit, zadd, zrem } from "@/lib/kv";
import { getSessionUser, requireWriter, sameOrigin } from "@/lib/auth";
import {
  LIMITS,
  postKey,
  imgKey,
  savedKey,
  newId,
  cleanText,
  rejectReason,
  extractTags,
  type Post,
} from "@/lib/community";
import { hydratePosts, indexPost, unindexPost, notify, notifyLikeOnce, notifyMentions } from "@/lib/social";

type Ctx = { params: Promise<{ id: string }> };
const NO_STORE = { "Cache-Control": "no-store" };
const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

// GET /api/community/:id -> { post }  (public; includes all comments)
export async function GET(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const post = await getJSON<Post>(postKey(id));
    if (!post || post.hidden) return err("Post not found.", 404);
    const me = (await getSessionUser(req))?.username || "";
    const [view] = await hydratePosts([post], me, LIMITS.commentsKeep);
    return NextResponse.json({ post: view }, { headers: NO_STORE });
  } catch (error) {
    console.error("Post read error:", error);
    return err("Something went wrong.", 500);
  }
}

// POST /api/community/:id { action: like | comment | delcomment | report | save | unsave, text?, commentId? }
export async function POST(req: Request, { params }: Ctx) {
  try {
    const auth = await requireWriter(req);
    if (auth.res) return auth.res;
    const me = auth.user.username;

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return err("Bad request.");

    if ((await hit(`vc_rl_act:${me}`, 60)) > LIMITS.actionsPerMinute) return err("Slow down a little.", 429);

    const post = await getJSON<Post>(postKey(id));
    if (!post || post.hidden) return err("Post not found.", 404);

    const action = body.action;
    if (action === "like") {
      const i = post.likes.indexOf(me);
      if (i >= 0) post.likes.splice(i, 1);
      else {
        post.likes = [...post.likes, me].slice(-LIMITS.likesKeep);
        await notifyLikeOnce(post, me);
      }
    } else if (action === "comment") {
      const text = cleanText(body.text, LIMITS.comment);
      if (!text) return err("Write a comment first.");
      const reason = rejectReason(text);
      if (reason) return err(reason);
      const comment = { id: newId(), author: me, text, ts: Date.now() };
      post.comments = [...post.comments, comment].slice(-LIMITS.commentsKeep);
      await notify(post.author, { type: "comment", actor: me, postId: id, text: text.slice(0, 80) });
      await notifyMentions(text, me, id, [post.author]);
    } else if (action === "delcomment") {
      const c = post.comments.find((x) => x.id === body.commentId);
      if (c && (c.author === me || post.author === me)) post.comments = post.comments.filter((x) => x.id !== c.id);
    } else if (action === "report") {
      if (!post.reports.includes(me)) post.reports.push(me);
      if (post.reports.length >= LIMITS.hideAfterReports) post.hidden = true;
    } else if (action === "save") {
      await zadd(savedKey(me), Date.now(), id);
    } else if (action === "unsave") {
      await zrem(savedKey(me), id);
    } else {
      return err("Unknown action.");
    }

    if (action !== "save" && action !== "unsave") await setJSON(postKey(id), post);
    const [view] = await hydratePosts([post], me, LIMITS.commentsKeep);
    return NextResponse.json({ ok: true, post: view, hidden: post.hidden });
  } catch (error) {
    console.error("Community action error:", error);
    return err("Something went wrong.", 500);
  }
}

// PATCH /api/community/:id { text } — the author edits their caption
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const auth = await requireWriter(req);
    if (auth.res) return auth.res;
    const { id } = await params;
    const post = await getJSON<Post>(postKey(id));
    if (!post || post.author !== auth.user.username) return err("Not allowed.", 403);

    const body = await req.json().catch(() => null);
    const text = cleanText(body?.text, LIMITS.text);
    if (!text && !post.hasImage && !post.video) return err("A post needs some text, a photo, or a video.");
    const reason = rejectReason(text);
    if (reason) return err(reason);

    await unindexPost(post);
    post.text = text;
    post.tags = extractTags(text);
    post.edited = true;
    await setJSON(postKey(id), post);
    await indexPost(post);
    const [view] = await hydratePosts([post], auth.user.username, LIMITS.commentsKeep);
    return NextResponse.json({ ok: true, post: view });
  } catch (error) {
    console.error("Post edit error:", error);
    return err("Something went wrong.", 500);
  }
}

// DELETE /api/community/:id — the author, or an admin via header x-admin-key: $COMMUNITY_ADMIN_KEY
export async function DELETE(req: Request, { params }: Ctx) {
  try {
    if (!sameOrigin(req)) return err("Bad request.", 403);
    const { id } = await params;
    const post = await getJSON<Post>(postKey(id));
    if (!post) return NextResponse.json({ ok: true });

    const adminKey = process.env.COMMUNITY_ADMIN_KEY;
    const isAdmin = Boolean(adminKey) && req.headers.get("x-admin-key") === adminKey;
    const user = await getSessionUser(req);
    if (!isAdmin && user?.username !== post.author) return err("Not allowed.", 403);

    await unindexPost(post);
    await del(postKey(id), imgKey(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Community delete error:", error);
    return err("Something went wrong.", 500);
  }
}
