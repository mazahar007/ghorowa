import "server-only";
import type { OrderRow } from "@/db/schema";
import { paymentMethodLabels } from "./labels";
import { deliveryZoneLabels, type DeliveryZone } from "./shipping";

type Line = { name: string; size: string; color: string | null; qty: number };

/**
 * নতুন অর্ডারের নোটিফিকেশন (ঐচ্ছিক) — অর্ডার ডাটাবেসে সেভ হওয়ার পর পাঠানো হয়:
 *  - TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID: টেলিগ্রামে মেসেজ
 *  - ORDER_WEBHOOK_URL: Google Sheet (Apps Script) বা অন্য কোথাও JSON
 * এগুলো ব্যর্থ হলেও অর্ডার বাতিল হয় না।
 */
export async function notifyNewOrder(order: OrderRow, lines: Line[]) {
  const items = lines.map((l) => `${l.name} (${l.size}${l.color ? ", " + l.color : ""}) x${l.qty}`).join("; ");
  const flat = {
    id: order.code,
    createdAt: order.createdAt.toISOString(),
    name: order.name,
    phone: order.phone,
    address: order.address,
    zone: deliveryZoneLabels[order.zone as DeliveryZone],
    note: order.note,
    payment: paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod,
    bkashSender: order.bkashSender ?? "",
    bkashTrxId: order.bkashTrxId ?? "",
    items,
    subtotal: order.subtotal,
    delivery: order.delivery,
    total: order.total,
  };

  const jobs: Promise<unknown>[] = [];
  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    jobs.push(fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(flat) }));
  }
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const text = [
      `নতুন অর্ডার ${flat.id}`,
      `নাম: ${flat.name}`,
      `ফোন: ${flat.phone}`,
      `ঠিকানা: ${flat.address} (${flat.zone})`,
      `পণ্য: ${flat.items}`,
      `মোট: ৳${flat.total} (ডেলিভারি ৳${flat.delivery})`,
      `পেমেন্ট: ${flat.payment}${flat.bkashTrxId ? ` — TrxID ${flat.bkashTrxId}, from ${flat.bkashSender}` : ""}`,
      flat.note ? `নোট: ${flat.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    jobs.push(
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text }),
      }),
    );
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("Order notification failed", r.reason));
}
