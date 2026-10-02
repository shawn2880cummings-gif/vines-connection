import { upload } from "@vercel/blob/client";
import { LIMITS } from "@/lib/community";

export const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load"));
    };
    img.src = url;
  });
}

function drawJpeg(src: CanvasImageSource, w: number, h: number, maxSide: number, quality: number): string {
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

// Shrink a photo to a small JPEG data URL that fits the server limit.
export async function compressImage(file: File): Promise<string> {
  const img = await loadImage(file);
  for (const [maxSide, quality] of [[960, 0.74], [800, 0.6], [640, 0.5]]) {
    const out = drawJpeg(img, img.width, img.height, maxSide, quality);
    if (out.length <= LIMITS.imageChars) return out;
  }
  throw new Error("big");
}

// Center-crop a photo to a small square JPEG for a profile picture.
export async function compressAvatar(file: File): Promise<string> {
  const img = await loadImage(file);
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  for (const [px, quality] of [[256, 0.8], [200, 0.7], [160, 0.6]]) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = px;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(img, sx, sy, side, side, 0, 0, px, px);
    const out = canvas.toDataURL("image/jpeg", quality);
    if (out.length <= LIMITS.avatarChars) return out;
  }
  throw new Error("big");
}

// Read a video's length and grab a cover frame for the feed.
export function videoInfo(file: File): Promise<{ duration: number; poster?: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;
    let done = false;
    const finish = (poster?: string) => {
      if (done) return;
      done = true;
      const duration = v.duration;
      URL.revokeObjectURL(url);
      Number.isFinite(duration) ? resolve({ duration, poster }) : reject(new Error("meta"));
    };
    const timer = setTimeout(() => finish(), 6000);
    v.onerror = () => {
      clearTimeout(timer);
      if (!done) {
        done = true;
        URL.revokeObjectURL(url);
        reject(new Error("video"));
      }
    };
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(0.3, (v.duration || 1) / 2);
    };
    v.onseeked = () => {
      clearTimeout(timer);
      let poster: string | undefined;
      try {
        for (const q of [0.6, 0.45, 0.3]) {
          const out = drawJpeg(v, v.videoWidth || 480, v.videoHeight || 480, 480, q);
          if (out.length <= LIMITS.posterChars) {
            poster = out;
            break;
          }
        }
      } catch {}
      finish(poster);
    };
    v.src = url;
  });
}

export function checkVideoFile(file: File): string | null {
  if (!VIDEO_TYPES.includes(file.type)) return "Please choose an MP4, MOV or WebM video.";
  if (file.size > LIMITS.videoBytes) return "That video is over 60 MB — try a shorter clip.";
  return null;
}

const STALL_MS = 45_000;

// Send a video straight to storage; resolves to its public URL.
// Gives up (and tells the user) if no progress is made for 45 seconds.
export async function uploadVideo(file: File, onProgress: (pct: number) => void): Promise<string> {
  const ext = file.type === "video/webm" ? "webm" : file.type === "video/quicktime" ? "mov" : "mp4";
  const ctrl = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let giveUp: (e: Error) => void = () => {};
  const stalled = new Promise<never>((_, reject) => {
    giveUp = reject;
  });
  const arm = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ctrl.abort();
      giveUp(new Error("The upload stalled — check your connection and try again."));
    }, STALL_MS);
  };
  arm();

  const sending = upload(`community/clip-${Date.now()}.${ext}`, file, {
    access: "public",
    handleUploadUrl: "/api/community/upload",
    contentType: file.type,
    abortSignal: ctrl.signal,
    onUploadProgress: (e) => {
      arm();
      onProgress(Math.round(e.percentage));
    },
  });
  sending.catch(() => {});

  try {
    return (await Promise.race([sending, stalled])).url;
  } finally {
    clearTimeout(timer);
  }
}
