"use server";

import { and, eq, ne } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { headers } from "next/headers";
import { endAdminSession, startAdminSession } from "@/lib/auth";
import {
  MIN_ADMIN_PASSWORD,
  checkAdminPassword,
  createResetToken,
  findResetToken,
  setAdminPassword,
  verifyAdminLogin,
} from "@/lib/admin-accounts";
import { resetChannelConfigured, sendAdminResetLink } from "@/lib/notify-admin";
import { CATALOG_TAG } from "@/lib/catalog";
import { ageGroups } from "@/lib/labels";
import { uploadProductImage } from "@/lib/storage";
import { createSteadfastParcel, getSteadfastStatus, steadfastEnabled } from "@/lib/steadfast";

export type FormState = { error?: string; ok?: string } | undefined;

const text = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);
const list = (value: string) =>
  value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

// ── Auth ─────────────────────────────────────────────────

export async function loginAdmin(_: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email", 200);
  const password = String(fd.get("password") ?? "");
  // slow down brute-force attempts
  await new Promise((r) => setTimeout(r, 400));
  const admin = await verifyAdminLogin(email, password);
  if (!admin) return { error: "ইমেইল বা পাসওয়ার্ড ভুল।" };
  await startAdminSession(admin);
  redirect("/admin");
}

async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestAdminReset(_: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email", 200);
  if (!email.includes("@")) return { error: "সঠিক ইমেইল লিখুন।" };
  if (!resetChannelConfigured()) {
    return {
      error:
        "রিসেট লিংক পাঠানোর ব্যবস্থা এখনো চালু হয়নি। Vercel → Settings → Environment Variables-এ ADMIN_PASSWORD বদলে Redeploy করুন — নতুন পাসওয়ার্ড দিয়ে লগইন হবে।",
    };
  }
  await new Promise((r) => setTimeout(r, 400));
  const reset = await createResetToken(email);
  if (reset) {
    const link = `${await siteOrigin()}/admin/reset?token=${encodeURIComponent(reset.token)}`;
    await sendAdminResetLink(reset.email, link);
  }
  // same answer whether or not the email exists, so it can't be used to find admin emails
  return { ok: "এই ইমেইলে অ্যাডমিন অ্যাকাউন্ট থাকলে রিসেট লিংক পাঠানো হয়েছে। ইমেইল (বা টেলিগ্রাম) দেখুন — লিংক ৩০ মিনিট কাজ করবে।" };
}

export async function resetAdminPassword(_: FormState, fd: FormData): Promise<FormState> {
  const token = text(fd, "token", 100);
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const row = await findResetToken(token);
  if (!row) return { error: "লিংকটা আর কাজ করছে না (মেয়াদ শেষ বা আগেই ব্যবহার হয়েছে)। আবার রিসেট চেয়ে নিন।" };
  if (password.length < MIN_ADMIN_PASSWORD) return { error: `পাসওয়ার্ড অন্তত ${MIN_ADMIN_PASSWORD} অক্ষরের হতে হবে।` };
  if (password !== confirm) return { error: "দুই ঘরের পাসওয়ার্ড মেলেনি।" };
  await setAdminPassword(row.adminId, password);
  await endAdminSession();
  redirect("/admin/login?reset=1");
}

export async function changeAdminPassword(_: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (!(await checkAdminPassword(admin.id, current))) return { error: "বর্তমান পাসওয়ার্ড ভুল।" };
  if (password.length < MIN_ADMIN_PASSWORD) return { error: `নতুন পাসওয়ার্ড অন্তত ${MIN_ADMIN_PASSWORD} অক্ষরের হতে হবে।` };
  if (password !== confirm) return { error: "দুই ঘরের নতুন পাসওয়ার্ড মেলেনি।" };
  const session = await setAdminPassword(admin.id, password);
  // keep this browser signed in; every other device is logged out
  await startAdminSession(session);
  return { ok: "পাসওয়ার্ড বদলানো হয়েছে। অন্য সব ডিভাইস থেকে লগআউট হয়ে গেছে।" };
}

export async function logoutAdmin() {
  await endAdminSession();
  redirect("/admin/login");
}

// ── Products ─────────────────────────────────────────────

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;

  const name = text(fd, "name", 150);
  const slug = slugify(text(fd, "slug", 100));
  const categoryId = Number(fd.get("categoryId"));
  const gender = text(fd, "gender", 20);
  const price = Number(fd.get("price"));
  const compareRaw = text(fd, "compareAtPrice", 20);
  const compareAtPrice = compareRaw ? Number(compareRaw) : null;
  const sizes = list(text(fd, "sizes", 500));
  const colors = list(text(fd, "colors", 500));
  const details = text(fd, "details", 3000).split("\n").map((s) => s.trim()).filter(Boolean);
  const description = text(fd, "description", 3000);
  const validAges = new Set<string>(ageGroups.map((a) => a.id));
  const ages = fd.getAll("ageGroups").map(String).filter((a) => validAges.has(a));
  const keptImages = fd.getAll("images").map(String).filter((u) => u.startsWith("/uploads/") || u.startsWith("https://"));
  const newFiles = fd.getAll("newImages").filter((f): f is File => f instanceof File && f.size > 0);

  if (name.length < 2) return { error: "পণ্যের নাম লিখুন।" };
  if (!slug) return { error: "লিংকের নাম (slug) ইংরেজিতে লিখুন, যেমন cotton-frock।" };
  if (!Number.isInteger(price) || price <= 0) return { error: "সঠিক দাম লিখুন (শুধু সংখ্যা)।" };
  if (compareAtPrice !== null && (!Number.isInteger(compareAtPrice) || compareAtPrice <= price))
    return { error: "ছাড়ের আগের দাম বর্তমান দামের চেয়ে বেশি হতে হবে (না থাকলে খালি রাখুন)।" };
  if (sizes.length === 0) return { error: "অন্তত একটা সাইজ লিখুন।" };
  if (!["girls", "boys", "baby", "unisex"].includes(gender)) return { error: "কার জন্য — বেছে নিন।" };
  const [category] = await db.select().from(schema.categories).where(eq(schema.categories.id, categoryId));
  if (!category) return { error: "ক্যাটাগরি বেছে নিন।" };

  const clash = await db
    .select({ id: schema.products.id })
    .from(schema.products)
    .where(id ? and(eq(schema.products.slug, slug), ne(schema.products.id, id)) : eq(schema.products.slug, slug));
  if (clash.length) return { error: "এই লিংকের নামে আরেকটা পণ্য আছে — অন্য নাম দিন।" };

  let uploaded: string[];
  try {
    uploaded = await Promise.all(newFiles.slice(0, 8).map((f) => uploadProductImage(f, slug)));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "ছবি আপলোড ব্যর্থ হয়েছে।" };
  }

  const values = {
    name,
    slug,
    categoryId,
    gender,
    ageGroups: ages,
    price,
    compareAtPrice,
    sizes,
    colors,
    details,
    description,
    images: [...keptImages, ...uploaded].slice(0, 10),
    featured: fd.get("featured") === "on",
    active: fd.get("active") === "on",
    inStock: fd.get("inStock") === "on",
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(schema.products).set(values).where(eq(schema.products.id, id));
  } else {
    await db.insert(schema.products).values(values);
  }
  updateTag(CATALOG_TAG);
  redirect(`/admin/products?saved=${encodeURIComponent(name)}`);
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  if (id) await db.delete(schema.products).where(eq(schema.products.id, id));
  updateTag(CATALOG_TAG);
  redirect("/admin/products");
}

// ── Categories ───────────────────────────────────────────

export async function saveCategory(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const name = text(fd, "name", 80);
  const description = text(fd, "description", 300);
  const slug = slugify(text(fd, "slug", 80));
  const live = fd.get("live") === "on";
  const sortOrder = Number(fd.get("sortOrder")) || 0;
  if (name.length < 2) return { error: "ক্যাটাগরির নাম লিখুন।" };

  if (id) {
    await db.update(schema.categories).set({ name, description, live, sortOrder }).where(eq(schema.categories.id, id));
  } else {
    if (!slug) return { error: "লিংকের নাম (slug) ইংরেজিতে লিখুন।" };
    const exists = await db.select({ id: schema.categories.id }).from(schema.categories).where(eq(schema.categories.slug, slug));
    if (exists.length) return { error: "এই লিংকের নামে ক্যাটাগরি আছে।" };
    await db.insert(schema.categories).values({ name, description, slug, live, sortOrder });
  }
  updateTag(CATALOG_TAG);
  refresh();
  return { ok: "সেভ হয়েছে।" };
}

// ── Orders ───────────────────────────────────────────────

const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled", "returned"];
const PAYMENT_STATUSES = ["unpaid", "pending", "paid", "failed"];

export async function updateOrder(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = text(fd, "status", 20);
  const paymentStatus = text(fd, "paymentStatus", 20);
  const adminNote = text(fd, "adminNote", 1000);
  if (!ORDER_STATUSES.includes(status) || !PAYMENT_STATUSES.includes(paymentStatus)) return { error: "স্ট্যাটাস সঠিক নয়।" };
  await db
    .update(schema.orders)
    .set({ status, paymentStatus, adminNote, updatedAt: new Date() })
    .where(eq(schema.orders.id, id));
  refresh();
  return { ok: "আপডেট হয়েছে।" };
}

export async function sendToSteadfast(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (!steadfastEnabled()) return { error: "Steadfast API কী সেট করা নেই।" };
  const id = Number(fd.get("id"));
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
  if (!order) return { error: "অর্ডার পাওয়া যায়নি।" };
  if (order.courierConsignmentId) return { error: "এই অর্ডার আগেই কুরিয়ারে পাঠানো হয়েছে।" };

  try {
    const parcel = await createSteadfastParcel({
      invoice: order.code,
      name: order.name,
      phone: order.phone,
      address: order.address,
      codAmount: order.paymentStatus === "paid" ? 0 : order.total,
      note: order.note,
    });
    await db
      .update(schema.orders)
      .set({
        courier: "steadfast",
        courierConsignmentId: parcel.consignmentId,
        courierTrackingCode: parcel.trackingCode,
        courierStatus: parcel.status,
        status: order.status === "new" || order.status === "confirmed" ? "shipped" : order.status,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, id));
    refresh();
    return { ok: `Steadfast-এ বুক হয়েছে — ট্র্যাকিং কোড ${parcel.trackingCode}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Steadfast বুকিং ব্যর্থ।" };
  }
}

export async function refreshCourierStatus(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
  if (!order?.courierConsignmentId) return { error: "কুরিয়ার তথ্য নেই।" };
  try {
    const courierStatus = await getSteadfastStatus(order.courierConsignmentId);
    const delivered = courierStatus === "delivered";
    await db
      .update(schema.orders)
      .set({
        courierStatus,
        ...(delivered ? { status: "delivered", paymentStatus: "paid" } : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, id));
    refresh();
    return { ok: `কুরিয়ার স্ট্যাটাস: ${courierStatus}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "স্ট্যাটাস আনা যায়নি।" };
  }
}
