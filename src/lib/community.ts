import { createHash } from "crypto";

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

export type Comment = { id: string; name: string; text: string; ts: number };

export type Post = {
  id: string;
  uid: string; // hashed device id
  name: string;
  topic: TopicId;
  text: string;
  image?: string; // small JPEG data URL
  ts: number;
  likes: string[]; // hashed uids
  comments: Comment[];
  reports: string[]; // hashed uids
  hidden: boolean;
};

export type PostView = {
  id: string;
  name: string;
  topic: TopicId;
  text: string;
  image?: string;
  ts: number;
  likeCount: number;
  liked: boolean;
  commentCount: number;
  comments: Comment[];
  mine: boolean;
};

export const LIMITS = {
  text: 600,
  comment: 240,
  name: 24,
  imageChars: 420_000, // ~300KB of JPEG
  feedKeep: 200,
  feedShow: 40,
  commentsKeep: 60,
  likesKeep: 5000,
  hideAfterReports: 3,
  postsPerHour: 6,
  actionsPerMinute: 30,
};

export const FEED_KEY = "vc_feed";
export const postKey = (id: string) => `vc_post:${id}`;

export function hashUid(uid: string): string {
  return createHash("sha256").update("vc|" + uid).digest("hex").slice(0, 20);
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function cleanText(s: unknown, max: number): string {
  return typeof s === "string" ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
}

export function cleanName(s: unknown): string {
  const n = cleanText(s, LIMITS.name).replace(/[^\p{L}\p{N} _.'-]/gu, "").trim();
  return n.length >= 2 ? n : "Seeker";
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

export function toView(p: Post, uidHash: string): PostView {
  return {
    id: p.id,
    name: p.name,
    topic: p.topic,
    text: p.text,
    image: p.image,
    ts: p.ts,
    likeCount: p.likes.length,
    liked: uidHash ? p.likes.includes(uidHash) : false,
    commentCount: p.comments.length,
    comments: p.comments.slice(-20),
    mine: uidHash ? p.uid === uidHash : false,
  };
}
