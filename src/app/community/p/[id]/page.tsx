import type { Metadata } from "next";
import PostDetail from "@/components/community/PostDetail";
import { getJSON } from "@/lib/kv";
import { userKey, type User } from "@/lib/auth";
import { postKey, type Post } from "@/lib/community";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = /^[a-z0-9]{6,32}$/.test(id) ? await getJSON<Post>(postKey(id)).catch(() => null) : null;
  if (!post || post.hidden) return { title: "Post | Vines Connection" };
  const author = await getJSON<User>(userKey(post.author)).catch(() => null);
  const name = author?.name || post.author;
  const text = post.text || (post.video ? "Shared a video" : "Shared a photo");
  return {
    title: `${name} on The Circle | Vines Connection`,
    description: text.slice(0, 160),
    openGraph: { title: `${name} on The Circle`, description: text.slice(0, 160), type: "article" },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  return <PostDetail id={id} />;
}
