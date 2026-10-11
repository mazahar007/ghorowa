import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { normalizeBdPhone } from "./format";
import { deliveryCharge, type DeliveryZone } from "./shipping";

export type PaymentMethod = "cod" | "bkash_manual" | "bkash_online";

type Line = {
  productId: number;
  productSlug: string;
  name: string;
  size: string;
  color: string | null;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type ValidOrder = {
  name: string;
  phone: string;
  address: string;
  zone: DeliveryZone;
  note: string;
  paymentMethod: PaymentMethod;
  bkashSender: string | null;
  bkashTrxId: string | null;
  lines: Line[];
  subtotal: number;
  delivery: number;
  total: number;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function bkashOnlineEnabled() {
  return Boolean(process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET && process.env.BKASH_USERNAME && process.env.BKASH_PASSWORD);
}

/**
 * ক্লায়েন্টের পাঠানো অর্ডার যাচাই করে। দাম সবসময় ডাটাবেস থেকে নেওয়া হয়,
 * ক্লায়েন্টের পাঠানো দাম বিশ্বাস করা হয় না।
 */
export async function validateOrder(input: unknown): Promise<{ order: ValidOrder } | { error: string }> {
  if (typeof input !== "object" || input === null) return { error: "অর্ডারের তথ্য পাওয়া যায়নি।" };
  const body = input as Record<string, unknown>;

  const name = str(body.name, 80);
  const phone = normalizeBdPhone(str(body.phone, 20));
  const address = str(body.address, 300);
  const note = str(body.note, 300);
  const zone = body.zone === "inside" || body.zone === "outside" ? body.zone : null;
  const method: PaymentMethod | null =
    body.payment === "cod" || body.payment === "bkash_manual" || body.payment === "bkash_online" ? body.payment : null;

  if (name.length < 2) return { error: "আপনার নাম লিখুন।" };
  if (!phone) return { error: "সঠিক মোবাইল নম্বর লিখুন (যেমন 01712345678)।" };
  if (address.length < 8) return { error: "পূর্ণ ঠিকানা লিখুন।" };
  if (!zone) return { error: "ডেলিভারি এলাকা বেছে নিন।" };
  if (!method) return { error: "পেমেন্টের মাধ্যম বেছে নিন।" };
  if (method === "bkash_online" && !bkashOnlineEnabled()) return { error: "বিকাশ অনলাইন পেমেন্ট এখন চালু নেই।" };

  let bkashSender: string | null = null;
  let bkashTrxId: string | null = null;
  if (method === "bkash_manual") {
    bkashSender = normalizeBdPhone(str(body.bkashSender, 20));
    bkashTrxId = str(body.bkashTrxId, 30).toUpperCase();
    if (!bkashSender) return { error: "যে বিকাশ নম্বর থেকে টাকা পাঠিয়েছেন সেটা লিখুন।" };
    if (!/^[A-Z0-9]{8,12}$/.test(bkashTrxId)) return { error: "সঠিক বিকাশ ট্রানজেকশন আইডি লিখুন।" };
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return { error: "কার্টে কোনো পণ্য নেই।" };
  }
  const items = body.items as Record<string, unknown>[];
  const slugs = [...new Set(items.map((i) => str(i?.slug, 100)))];
  const rows = await db
    .select()
    .from(schema.products)
    .where(and(inArray(schema.products.slug, slugs), eq(schema.products.active, true)));
  const bySlug = new Map(rows.map((p) => [p.slug, p]));

  const lines: Line[] = [];
  for (const raw of items) {
    const product = bySlug.get(str(raw?.slug, 100));
    const size = str(raw?.size, 20);
    const qty = Number(raw?.qty);
    const color = str(raw?.color, 40) || null;
    if (!product || !product.inStock) return { error: "কার্টের একটি পণ্য এখন আর পাওয়া যাচ্ছে না। কার্ট থেকে সরিয়ে আবার চেষ্টা করুন।" };
    if (!product.sizes.includes(size)) return { error: `${product.name}: সাইজ সঠিক নয়।` };
    if (color && !product.colors.includes(color)) return { error: `${product.name}: রং সঠিক নয়।` };
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return { error: "পরিমাণ সঠিক নয়।" };
    lines.push({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      size,
      color,
      qty,
      unitPrice: product.price,
      lineTotal: product.price * qty,
    });
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const delivery = deliveryCharge(zone, subtotal);
  return {
    order: { name, phone, address, zone, note, paymentMethod: method, bkashSender, bkashTrxId, lines, subtotal, delivery, total: subtotal + delivery },
  };
}

function newOrderCode() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return `GH-${stamp}${randomBytes(2).toString("hex").toUpperCase()}`;
}

export async function createOrder(order: ValidOrder, customerId: number | null) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(schema.orders)
      .values({
        code: newOrderCode(),
        customerId,
        name: order.name,
        phone: order.phone,
        address: order.address,
        zone: order.zone,
        note: order.note,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentMethod === "cod" ? "unpaid" : "pending",
        bkashSender: order.bkashSender,
        bkashTrxId: order.bkashTrxId,
        subtotal: order.subtotal,
        delivery: order.delivery,
        total: order.total,
      })
      .returning();
    await tx.insert(schema.orderItems).values(order.lines.map((l) => ({ ...l, orderId: row.id })));
    return row;
  });
}
