import { getText } from "@/lib/kv";
import { imgKey } from "@/lib/community";

// Serves a post / story photo (or video cover) as a cacheable JPEG.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9]{6,32}$/.test(id)) return new Response("Not found", { status: 404 });
  const data = await getText(imgKey(id));
  const m = data && /^data:image\/jpeg;base64,(.+)$/.exec(data);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(m[1], "base64"), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
