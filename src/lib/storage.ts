import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BUCKET = "products";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/**
 * পণ্যের ছবি আপলোড করে পাবলিক URL ফেরত দেয়।
 * SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY থাকলে Supabase Storage-এ,
 * না থাকলে (শুধু লোকাল ডেভেলপমেন্টে) public/uploads ফোল্ডারে রাখে।
 */
export async function uploadProductImage(file: File, slug: string): Promise<string> {
  const ext = TYPES[file.type];
  if (!ext) throw new Error("শুধু JPG, PNG, WebP বা AVIF ছবি দেওয়া যাবে।");
  if (file.size > MAX_BYTES) throw new Error("ছবির সাইজ ৫ MB-এর কম হতে হবে।");

  const safeSlug = slug.replace(/[^a-z0-9-]/g, "").slice(0, 60) || "product";
  const name = `${safeSlug}-${Date.now().toString(36)}${randomBytes(3).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": file.type,
        "Cache-Control": "31536000",
      },
      body: bytes,
    });
    if (!res.ok) throw new Error(`ছবি আপলোড ব্যর্থ (${res.status}): ${await res.text()}`);
    return `${url}/storage/v1/object/public/${BUCKET}/${name}`;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ছবি রাখার জায়গা সেট করা নেই — SUPABASE_URL ও SUPABASE_SERVICE_ROLE_KEY দিন।");
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
