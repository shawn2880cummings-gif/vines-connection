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

export type Video = { url: string; poster?: string };

export type Comment = { id: string; author: string; name: string; text: string; ts: number };

export type Post = {
  id: string;
  author: string; // username
  name: string; // display name
  topic: TopicId;
  text: string;
  image?: string; // small JPEG data URL
  video?: Video; // uploaded to Vercel Blob
  ts: number;
  likes: string[]; // usernames
  comments: Comment[];
  reports: string[]; // usernames
  hidden: boolean;
};

export type PostView = {
  id: string;
  author: string;
  name: string;
  topic: TopicId;
  text: string;
  image?: string;
  video?: Video;
  ts: number;
  likeCount: number;
  liked: boolean;
  commentCount: number;
  comments: Comment[];
  mine: boolean;
};

export type Story = {
  id: string;
  author: string;
  name: string;
  image?: string;
  video?: Video;
  caption: string;
  ts: number;
  reports: string[];
  hidden: boolean;
};

export type StoryView = {
  id: string;
  author: string;
  name: string;
  image?: string;
  video?: Video;
  caption: string;
  ts: number;
  mine: boolean;
};

export const LIMITS = {
  text: 600,
  comment: 240,
  caption: 140,
  imageChars: 420_000, // ~300KB of JPEG
  posterChars: 120_000,
  feedKeep: 200,
  feedShow: 40,
  storiesKeep: 300,
  storyTtlMs: 24 * 3600 * 1000,
  commentsKeep: 60,
  likesKeep: 5000,
  hideAfterReports: 3,
  postsPerHour: 8,
  storiesPerHour: 10,
  actionsPerMinute: 30,
  videoBytes: 60 * 1024 * 1024,
};

export const FEED_KEY = "vc_feed";
export const STORIES_KEY = "vc_stories";
export const postKey = (id: string) => `vc_post:${id}`;
export const storyKey = (id: string) => `vc_story:${id}`;

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function cleanText(s: unknown, max: number): string {
  return typeof s === "string" ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
}

// Light spam / abuse guard. Links are blocked outright to keep the feed spam-free;
// everything else relies on reports (3 distinct reports auto-hide a post).
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|info|co)\b)/i;
const BAD = /(kill\s+yourself|\bkys\b|porn|viagra|casino|crypto\s+giveaway|onlyfans|telegram\s*@|whatsapp\s*\+?\d)/i;

export function rejectReason(text: string): string | null {
  if (LINK.test(text)) return "Links aren't allowed in posts — share the idea itself.";
  if (BAD.test(text)) return "That message isn't allowed here.";
  return null;
}

const BLOB_URL = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>]+$/i;
const JPEG_DATA = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/;

// Validate media coming from the client. Returns the cleaned value or an error.
export function cleanImage(v: unknown): string | undefined | "bad" {
  if (v == null || v === "") return undefined;
  if (typeof v !== "string" || !JPEG_DATA.test(v) || v.length > LIMITS.imageChars) return "bad";
  return v;
}

export function cleanVideo(v: unknown): Video | undefined | "bad" {
  if (v == null) return undefined;
  const o = v as { url?: unknown; poster?: unknown };
  if (typeof o.url !== "string" || !BLOB_URL.test(o.url) || o.url.length > 400) return "bad";
  let poster: string | undefined;
  if (o.poster != null && o.poster !== "") {
    if (typeof o.poster !== "string" || !JPEG_DATA.test(o.poster) || o.poster.length > LIMITS.posterChars) return "bad";
    poster = o.poster;
  }
  return { url: o.url, poster };
}

export function toView(p: Post, me: string): PostView {
  return {
    id: p.id,
    author: p.author,
    name: p.name,
    topic: p.topic,
    text: p.text,
    image: p.image,
    video: p.video,
    ts: p.ts,
    likeCount: p.likes.length,
    liked: me ? p.likes.includes(me) : false,
    commentCount: p.comments.length,
    comments: p.comments.slice(-20),
    mine: me ? p.author === me : false,
  };
}

export function toStoryView(s: Story, me: string): StoryView {
  return {
    id: s.id,
    author: s.author,
    name: s.name,
    image: s.image,
    video: s.video,
    caption: s.caption,
    ts: s.ts,
    mine: me ? s.author === me : false,
  };
}
