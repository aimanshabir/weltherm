import "server-only";
import crypto from "node:crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/** True when all three Cloudinary env vars are present. */
export function cloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

/**
 * Upload an image buffer to Cloudinary (signed, server-side) and return its
 * secure URL. Returns null on any failure — callers decide how to report.
 */
export async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string | null> {
  if (!cloudinaryConfigured()) return null;
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const params: Record<string, string> = { folder, timestamp: String(timestamp) };
    const toSign =
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&") + API_SECRET;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)]));
    form.append("api_key", API_KEY!);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { secure_url?: string };
    return data.secure_url ?? null;
  } catch {
    return null;
  }
}
