export const TOPICS = [
  { id: "spirit", label: "Spirituality", emoji: "🕊️" },
  { id: "quantum", label: "Quantum", emoji: "⚛️" },
  { id: "consciousness", label: "Consciousness", emoji: "🧠" },
  { id: "meditation", label: "Meditation", emoji: "🧘" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "geometry", label: "Sacred Geometry", emoji: "🔯" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];
export const TOPIC_IDS = TOPICS.map((t) => t.id) as string[];

// ---------- stored shapes ----------
export type Comment = { id: string; author: string; text: string; ts: number };

export type Post = {
  id: string;
  author: string; // username
  topic: TopicId;
  text: string;
  hasImage: boolean; // bytes live at vc_img:{id}
  video?: { url: string; hasPoster: boolean };
  tags: string[];
  ts: number; // ms
  score: number; // ts + jitter, the sort key in feeds
  likes: string[]; // usernames
  comments: Comment[];
  reports: string[]; // usernames
  hidden: boolean;
  edited?: boolean;
};

export type Story = {
  id: string;
  author: string;
  hasImage: boolean;
  video?: { url: string; hasPoster: boolean };
  caption: string;
  ts: number;
  reports: string[];
  hidden: boolean;
};

export type Notification = {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  actor: string;
  postId?: string;
  text?: string;
  ts: number;
};

// ---------- what the browser receives ----------
export type VideoView = { url: string; poster?: string };

export type PostView = {
  id: string;
  author: string;
  name: string;
  avatar: string | null;
  topic: TopicId;
  text: string;
  image?: string;
  video?: VideoView;
  tags: string[];
  ts: number;
  score: number;
  likeCount: number;
  liked: boolean;
  saved: boolean;
  commentCount: number;
  comments: CommentView[];
  mine: boolean;
  edited: boolean;
};

export type CommentView = {
  id: string;
  author: string;
  name: string;
  avatar: string | null;
  text: string;
  ts: number;
  mine: boolean;
};

export type StoryView = {
  id: string;
  author: string;
  name: string;
  avatar: string | null;
  image?: string;
  video?: VideoView;
  caption: string;
  ts: number;
  mine: boolean;
};

export type PersonView = {
  username: string;
  name: string;
  avatar: string | null;
  bio: string;
  following: boolean;
  isMe: boolean;
};

export type ProfileView = PersonView & {
  postCount: number;
  followerCount: number;
  followingCount: number;
  followsMe: boolean;
};

export type NotificationView = {
  id: string;
  type: Notification["type"];
  actor: PersonView;
  postId?: string;
  text?: string;
  ts: number;
};

export const LIMITS = {
  text: 600,
  comment: 240,
  caption: 140,
  bio: 150,
  name: 24,
  imageChars: 420_000, // ~300KB of JPEG
  posterChars: 120_000,
  avatarChars: 70_000,
  feedPage: 15,
  storiesKeep: 300,
  storyTtlMs: 24 * 3600 * 1000,
  commentsKeep: 80,
  likesKeep: 5000,
  hideAfterReports: 3,
  postsPerHour: 8,
  storiesPerHour: 10,
  actionsPerMinute: 40,
  followCap: 300,
  videoBytes: 60 * 1024 * 1024,
  notifKeep: 80,
};

// ---------- keys ----------
export const FEED_KEY = "vc_feed"; // zset: all posts
export const STORIES_KEY = "vc_stories"; // zset: all stories
export const postKey = (id: string) => `vc_post:${id}`;
export const storyKey = (id: string) => `vc_story:${id}`;
export const imgKey = (id: string) => `vc_img:${id}`;
export const avatarKey = (u: string) => `vc_avatar:${u}`;
export const userPostsKey = (u: string) => `vc_uposts:${u}`; // zset
export const userStoriesKey = (u: string) => `vc_ustories:${u}`; // zset
export const followersKey = (u: string) => `vc_followers:${u}`; // set
export const followingKey = (u: string) => `vc_following:${u}`; // set
export const savedKey = (u: string) => `vc_saved:${u}`; // zset
export const tagKey = (t: string) => `vc_tag:${t}`; // zset
export const topicKey = (t: string) => `vc_topic:${t}`; // zset
export const TAGS_KEY = "vc_tags"; // set of all tags
export const TAGCOUNT_KEY = "vc_tagcount"; // zset tag -> uses
export const notifKey = (u: string) => `vc_notif:${u}`; // list of JSON
export const unreadKey = (u: string) => `vc_unread:${u}`;

// ---------- parsing ----------
export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function cleanText(s: unknown, max: number): string {
  return typeof s === "string" ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
}

export function cleanDisplayName(s: unknown): string {
  return cleanText(s, LIMITS.name).replace(/[^\p{L}\p{N} _.'-]/gu, "").trim();
}

export const TAG_RE = /(^|[^\w&])#([a-zA-Z][a-zA-Z0-9_]{1,29})/g;
export const MENTION_RE = /(^|[^\w&])@([a-zA-Z0-9_]{3,20})/g;

export function extractTags(text: string): string[] {
  const out = new Set<string>();
  for (const m of text.matchAll(TAG_RE)) out.add(m[2].toLowerCase());
  return [...out].slice(0, 10);
}

export function extractMentions(text: string): string[] {
  const out = new Set<string>();
  for (const m of text.matchAll(MENTION_RE)) out.add(m[2].toLowerCase());
  return [...out].slice(0, 8);
}

// Light spam / abuse guard. Links are blocked outright to keep the feed spam-free;
// everything else relies on reports (3 distinct reports auto-hide a post).
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|info|co)\b)/i;
const BAD = /(kill\s+yourself|\bkys\b|porn|viagra|casino|crypto\s+giveaway|onlyfans|telegram\s*@|whatsapp\s*\+?\d)/i;

export function rejectReason(text: string): string | null {
  if (LINK.test(text)) return "Links aren't allowed — share the idea itself.";
  if (BAD.test(text)) return "That message isn't allowed here.";
  return null;
}

const BLOB_URL = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>]+$/i;
const JPEG_DATA = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/;

export function cleanImage(v: unknown, max: number = LIMITS.imageChars): string | undefined | "bad" {
  if (v == null || v === "") return undefined;
  if (typeof v !== "string" || !JPEG_DATA.test(v) || v.length > max) return "bad";
  return v;
}

export function cleanVideo(v: unknown): { url: string; poster?: string } | undefined | "bad" {
  if (v == null) return undefined;
  const o = v as { url?: unknown; poster?: unknown };
  if (typeof o.url !== "string" || !BLOB_URL.test(o.url) || o.url.length > 400) return "bad";
  const poster = cleanImage(o.poster, LIMITS.posterChars);
  if (poster === "bad") return "bad";
  return { url: o.url, poster };
}

export const imageUrl = (id: string, v?: number) => `/api/community/img/${id}${v ? `?v=${v}` : ""}`;
