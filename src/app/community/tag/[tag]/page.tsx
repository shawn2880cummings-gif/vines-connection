import type { Metadata } from "next";
import TagFeed from "@/components/community/TagFeed";

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag} | Vines Connection`, description: `Posts tagged #${tag} in The Circle.` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  return <TagFeed tag={tag.toLowerCase().replace(/[^a-z0-9_]/g, "")} />;
}
