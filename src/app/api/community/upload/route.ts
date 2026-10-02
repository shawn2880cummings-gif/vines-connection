import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireWriter } from "@/lib/auth";
import { LIMITS } from "@/lib/community";
import { hit } from "@/lib/kv";

// Issues short-lived upload tokens so the browser can send video straight to
// Vercel Blob (the file never passes through this server). Login required.
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Video uploads aren't switched on yet." }, { status: 501 });
  }

  try {
    const auth = await requireWriter(req);
    if (auth.res) return auth.res;
    const user = auth.user;

    const body = (await req.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("community/")) throw new Error("Bad path.");
        if ((await hit(`vc_rl_upload:${user.username}`, 3600)) > 12) throw new Error("Too many uploads. Try later.");
        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: LIMITS.videoBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ u: user.username }),
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
