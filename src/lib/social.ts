import {
  mgetJSON,
  setIfAbsent,
  scard,
  smembers,
  lpush,
  ltrim,
  lrange,
  incr,
  pipeline,
  zpage,
  zpageMany,
  type Scored,
} from "@/lib/kv";
import { userKey, type User } from "@/lib/auth";
import {
  FEED_KEY,
  LIMITS,
  TAGS_KEY,
  TAGCOUNT_KEY,
  postKey,
  storyKey,
  tagKey,
  topicKey,
  userPostsKey,
  followersKey,
  followingKey,
  savedKey,
  notifKey,
  unreadKey,
  newId,
  extractMentions,
  imageUrl,
  type Post,
  type PostView,
  type Story,
  type StoryView,
  type CommentView,
  type PersonView,
  type Notification,
  type NotificationView,
} from "@/lib/community";

// ---------- users ----------
export const avatarUrl = (u: Pick<User, "username" | "av">) =>
  u.av ? `/api/community/avatar/${u.username}?v=${u.av}` : null;

export async function loadUsers(usernames: string[]): Promise<Map<string, User | null>> {
  const uniq = [...new Set(usernames)];
  const found = await mgetJSON<User>(uniq.map(userKey));
  return new Map(uniq.map((u, i) => [u, found[i]]));
}

function nameOf(users: Map<string, User | null>, u: string) {
  return users.get(u)?.name || u;
}

export async function toPeople(usernames: string[], me: string): Promise<PersonView[]> {
  const users = await loadUsers(usernames);
  const myFollowing = me ? new Set(await smembers(followingKey(me))) : new Set<string>();
  return usernames
    .map((u) => users.get(u))
    .filter((u): u is User => !!u)
    .map((u) => ({
      username: u.username,
      name: u.name,
      avatar: avatarUrl(u),
      bio: u.bio || "",
      following: myFollowing.has(u.username),
      isMe: u.username === me,
    }));
}

// ---------- posts ----------
export async function loadPosts(ids: string[]): Promise<Post[]> {
  const posts = await mgetJSON<Post>(ids.map(postKey));
  return posts.filter((p): p is Post => !!p && !p.hidden);
}

export async function hydratePosts(posts: Post[], me: string, commentLimit = 6): Promise<PostView[]> {
  if (!posts.length) return [];
  const authors = [...posts.map((p) => p.author), ...posts.flatMap((p) => p.comments.slice(-commentLimit).map((c) => c.author))];
  const users = await loadUsers(authors);
  let savedScores: unknown[] = [];
  if (me) savedScores = await pipeline(posts.map((p) => ["ZSCORE", savedKey(me), p.id]));
  return posts.map((p, i) => {
    const a = users.get(p.author);
    const comments: CommentView[] = p.comments.slice(-commentLimit).map((c) => ({
      id: c.id,
      author: c.author,
      name: nameOf(users, c.author),
      avatar: users.get(c.author) ? avatarUrl(users.get(c.author)!) : null,
      text: c.text,
      ts: c.ts,
      mine: me ? c.author === me : false,
    }));
    return {
      id: p.id,
      author: p.author,
      name: a?.name || p.author,
      avatar: a ? avatarUrl(a) : null,
      topic: p.topic,
      text: p.text,
      image: p.hasImage ? imageUrl(p.id, p.edited ? p.ts : undefined) : undefined,
      video: p.video ? { url: p.video.url, poster: p.video.hasPoster ? imageUrl(p.id) : undefined } : undefined,
      tags: p.tags || [],
      ts: p.ts,
      score: p.score,
      likeCount: p.likes.length,
      liked: me ? p.likes.includes(me) : false,
      saved: me ? savedScores[i] != null : false,
      commentCount: p.comments.length,
      comments,
      mine: me ? p.author === me : false,
      edited: Boolean(p.edited),
    };
  });
}

export async function indexPost(p: Post) {
  const cmds: (string | number)[][] = [
    ["ZADD", FEED_KEY, p.score, p.id],
    ["ZADD", topicKey(p.topic), p.score, p.id],
    ["ZADD", userPostsKey(p.author), p.score, p.id],
  ];
  for (const t of p.tags) {
    cmds.push(["ZADD", tagKey(t), p.score, p.id], ["SADD", TAGS_KEY, t], ["ZINCRBY", TAGCOUNT_KEY, 1, t]);
  }
  await pipeline(cmds);
}

export async function unindexPost(p: Post) {
  const cmds: (string | number)[][] = [
    ["ZREM", FEED_KEY, p.id],
    ["ZREM", topicKey(p.topic), p.id],
    ["ZREM", userPostsKey(p.author), p.id],
  ];
  for (const t of p.tags) cmds.push(["ZREM", tagKey(t), p.id], ["ZINCRBY", TAGCOUNT_KEY, -1, t]);
  await pipeline(cmds);
}

export type Page<T> = { items: T[]; next: number | null };

// One page of a single newest-first index (feed, a user's posts, a tag, saved…).
export async function postsFromKey(key: string, before: number | null, me: string): Promise<Page<PostView>> {
  const rows = await zpage(key, before, LIMITS.feedPage);
  const posts = await loadPosts(rows.map((r) => r.member));
  const views = await hydratePosts(posts, me);
  return { items: views, next: rows.length === LIMITS.feedPage ? rows[rows.length - 1].score : null };
}

// Home feed: posts from people you follow, plus your own, merged newest-first.
export async function followingFeed(me: string, before: number | null): Promise<Page<PostView>> {
  const following = [...(await smembers(followingKey(me))).slice(0, LIMITS.followCap), me];
  const lists = await zpageMany(following.map(userPostsKey), before, LIMITS.feedPage);
  const merged = lists.flat().sort((a: Scored, b: Scored) => b.score - a.score).slice(0, LIMITS.feedPage);
  const posts = await loadPosts(merged.map((r) => r.member));
  const byId = new Map(posts.map((p) => [p.id, p]));
  const ordered = merged.map((r) => byId.get(r.member)).filter((p): p is Post => !!p);
  const views = await hydratePosts(ordered, me);
  return { items: views, next: merged.length === LIMITS.feedPage ? merged[merged.length - 1].score : null };
}

// ---------- stories ----------
export async function hydrateStories(stories: Story[], me: string): Promise<StoryView[]> {
  const users = await loadUsers(stories.map((s) => s.author));
  return stories.map((s) => {
    const a = users.get(s.author);
    return {
      id: s.id,
      author: s.author,
      name: a?.name || s.author,
      avatar: a ? avatarUrl(a) : null,
      image: s.hasImage ? imageUrl(s.id) : undefined,
      video: s.video ? { url: s.video.url, poster: s.video.hasPoster ? imageUrl(s.id) : undefined } : undefined,
      caption: s.caption,
      ts: s.ts,
      mine: me ? s.author === me : false,
    };
  });
}

export async function loadStories(ids: string[]): Promise<Story[]> {
  const cutoff = Date.now() - LIMITS.storyTtlMs;
  const stories = await mgetJSON<Story>(ids.map(storyKey));
  return stories.filter((s): s is Story => !!s && !s.hidden && s.ts > cutoff);
}

// ---------- follows ----------
export async function counts(username: string) {
  const [followers, following, posts] = await Promise.all([
    scard(followersKey(username)),
    scard(followingKey(username)),
    pipeline([["ZCARD", userPostsKey(username)]]).then((r) => Number(r[0])),
  ]);
  return { followers, following, posts };
}

// ---------- notifications ----------
export async function notify(target: string, n: Omit<Notification, "id" | "ts">) {
  if (!target || target === n.actor) return;
  const entry: Notification = { ...n, id: newId(), ts: Date.now() };
  await lpush(notifKey(target), JSON.stringify(entry));
  await ltrim(notifKey(target), 0, LIMITS.notifKeep - 1);
  await incr(unreadKey(target));
}

// First like by this person on this post only (so like/unlike spam doesn't spam the author).
export async function notifyLikeOnce(post: Post, actor: string) {
  if (await setIfAbsent(`vc_ln:${post.id}:${actor}`, 1)) {
    await notify(post.author, { type: "like", actor, postId: post.id });
  }
}

export async function notifyMentions(text: string, actor: string, postId: string, skip: string[] = []) {
  const names = extractMentions(text).filter((u) => !skip.includes(u) && u !== actor);
  if (!names.length) return;
  const users = await loadUsers(names);
  await Promise.all(
    names.filter((u) => users.get(u)).map((u) => notify(u, { type: "mention", actor, postId, text: text.slice(0, 80) }))
  );
}

export async function listNotifications(me: string): Promise<NotificationView[]> {
  const raw = await lrange(notifKey(me), 0, LIMITS.notifKeep - 1);
  const items = raw
    .map((r) => {
      try {
        return JSON.parse(r) as Notification;
      } catch {
        return null;
      }
    })
    .filter((n): n is Notification => !!n);
  const people = await toPeople([...new Set(items.map((n) => n.actor))], me);
  const byName = new Map(people.map((p) => [p.username, p]));
  return items
    .filter((n) => byName.has(n.actor))
    .map((n) => ({ id: n.id, type: n.type, actor: byName.get(n.actor)!, postId: n.postId, text: n.text, ts: n.ts }));
}
