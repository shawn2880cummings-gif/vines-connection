import type { Metadata } from "next";
import ProfileView from "@/components/community/ProfileView";
import { getJSON } from "@/lib/kv";
import { userKey, type User } from "@/lib/auth";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const u = username.toLowerCase();
  const user = /^[a-z0-9_]{3,20}$/.test(u) ? await getJSON<User>(userKey(u)).catch(() => null) : null;
  if (!user) return { title: "Profile | Vines Connection" };
  return {
    title: `${user.name} (@${user.username}) | Vines Connection`,
    description: user.bio || `${user.name} on The Circle — spirituality and quantum mechanics.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  return <ProfileView username={username.toLowerCase()} />;
}
