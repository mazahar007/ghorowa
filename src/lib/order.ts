import { getProduct } from "@/data/catalog";
import { normalizeBdPhone } from "./format";
import { deliveryCharge, type DeliveryZone } from "./shipping";

export type PaymentMethod = "cod" | "bkash";

export type OrderRequest = {
  name: string;
  phone: string;
  address: string;
  zone: DeliveryZone;
  note?: string;
  payment: PaymentMethod;
  bkashSender?: string;
  bkashTrxId?: string;
  items: { slug: string; size: string; color?: string; qty: number }[];
};

export type OrderLine = {
  slug: string;
  name: string;
  size: string;
  color?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; zone: DeliveryZone; note: string };
  payment: { method: PaymentMethod; bkashSender?: string; bkashTrxId?: string };
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  total: number;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * ক্লায়েন্টের পাঠানো অর্ডার যাচাই করে। দাম সবসময় সার্ভারের ক্যাটালগ থেকে নেওয়া হয়,
 * ক্লায়েন্টের পাঠানো দাম বিশ্বাস করা হয় না।
 */
export function buildOrder(input: unknown, id: string, createdAt: string): { order: Order } | { error: string } {
  if (typeof input !== "object" || input === null) return { error: "অর্ডারের তথ্য পাওয়া যায়নি।" };
  const body = input as Record<string, unknown>;

  const name = str(body.name, 80);
  const phone = normalizeBdPhone(str(body.phone, 20));
  const address = str(body.address, 300);
  const note = str(body.note, 300);
  const zone = body.zone === "inside" || body.zone === "outside" ? body.zone : null;
  const method = body.payment === "cod" || body.payment === "bkash" ? body.payment : null;

  if (name.length < 2) return { error: "আপনার নাম লিখুন।" };
  if (!phone) return { error: "সঠিক মোবাইল নম্বর লিখুন (যেমন 01712345678)।" };
  if (address.length < 8) return { error: "পূর্ণ ঠিকানা লিখুন।" };
  if (!zone) return { error: "ডেলিভারি এলাকা বেছে নিন।" };
  if (!method) return { error: "পেমেন্টের মাধ্যম বেছে নিন।" };

  const payment: Order["payment"] = { method };
  if (method === "bkash") {
    const sender = normalizeBdPhone(str(body.bkashSender, 20));
    const trx = str(body.bkashTrxId, 30).toUpperCase();
    if (!sender) return { error: "যে বিকাশ নম্বর থেকে টাকা পাঠিয়েছেন সেটা লিখুন।" };
    if (!/^[A-Z0-9]{8,12}$/.test(trx)) return { error: "সঠিক বিকাশ ট্রানজেকশন আইডি লিখুন।" };
    payment.bkashSender = sender;
    payment.bkashTrxId = trx;
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return { error: "কার্টে কোনো পণ্য নেই।" };
  }

  const lines: OrderLine[] = [];
  for (const raw of body.items as Record<string, unknown>[]) {
    const product = getProduct(str(raw?.slug, 100));
    const size = str(raw?.size, 20);
    const qty = Number(raw?.qty);
    const color = str(raw?.color, 40) || undefined;
    if (!product || !product.inStock) return { error: "কার্টের একটি পণ্য এখন আর পাওয়া যাচ্ছে না।" };
    if (!product.sizes.includes(size)) return { error: `${product.name}: সাইজ সঠিক নয়।` };
    if (color && !product.colors?.includes(color)) return { error: `${product.name}: রং সঠিক নয়।` };
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return { error: "পরিমাণ সঠিক নয়।" };
    lines.push({
      slug: product.slug,
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
    order: {
      id,
      createdAt,
      customer: { name, phone, address, zone, note },
      payment,
      lines,
      subtotal,
      delivery,
      total: subtotal + delivery,
    },
  };
}
