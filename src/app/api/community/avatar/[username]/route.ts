import { getText } from "@/lib/kv";
import { avatarKey } from "@/lib/community";

// Serves a profile picture as a cacheable JPEG (the ?v= in the URL changes when it's replaced).
export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  if (!/^[a-z0-9_]{3,20}$/.test(username)) return new Response("Not found", { status: 404 });
  const data = await getText(avatarKey(username));
  const m = data && /^data:image\/jpeg;base64,(.+)$/.exec(data);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(m[1], "base64"), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
