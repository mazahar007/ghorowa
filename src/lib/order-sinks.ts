import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Order } from "./order";
import { deliveryZoneLabels } from "./shipping";

/**
 * অর্ডার কোথায় যাবে:
 *  - ORDER_WEBHOOK_URL: Google Sheet (Apps Script) বা যেকোনো ওয়েবহুকে JSON পাঠায়
 *  - TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID: টেলিগ্রামে নতুন অর্ডারের নোটিফিকেশন
 *  - লোকাল ডেভেলপমেন্টে কিছু সেট না থাকলে .data/orders.jsonl ফাইলে লেখে
 * অন্তত একটা জায়গায় সেভ না হলে অর্ডার ব্যর্থ ধরা হয়, যাতে অর্ডার হারিয়ে না যায়।
 */
export async function saveOrder(order: Order): Promise<void> {
  const webhook = process.env.ORDER_WEBHOOK_URL;
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;

  let saved = false;

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flatten(order)),
    });
    if (!res.ok) throw new Error(`Order webhook failed: ${res.status}`);
    saved = true;
  }

  if (tgToken && tgChat) {
    const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChat, text: telegramText(order) }),
    });
    if (res.ok) saved = true;
    else if (!saved) throw new Error(`Telegram notify failed: ${res.status}`);
  }

  if (!saved) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("No order destination configured (set ORDER_WEBHOOK_URL or TELEGRAM_* env vars)");
    }
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "orders.jsonl"), JSON.stringify(order) + "\n");
  }
}

/** Google Sheet-এ এক সারিতে বসানোর মতো সমতল রূপ। */
function flatten(order: Order) {
  return {
    id: order.id,
    createdAt: order.createdAt,
    name: order.customer.name,
    phone: order.customer.phone,
    address: order.customer.address,
    zone: deliveryZoneLabels[order.customer.zone],
    note: order.customer.note,
    payment: order.payment.method === "cod" ? "Cash on delivery" : "bKash",
    bkashSender: order.payment.bkashSender ?? "",
    bkashTrxId: order.payment.bkashTrxId ?? "",
    items: order.lines
      .map((l) => `${l.name} (${l.size}${l.color ? ", " + l.color : ""}) x${l.qty}`)
      .join("; "),
    subtotal: order.subtotal,
    delivery: order.delivery,
    total: order.total,
  };
}

function telegramText(order: Order) {
  const f = flatten(order);
  return [
    `🛍 নতুন অর্ডার ${f.id}`,
    `নাম: ${f.name}`,
    `ফোন: ${f.phone}`,
    `ঠিকানা: ${f.address} (${f.zone})`,
    `পণ্য: ${f.items}`,
    `মোট: ৳${f.total} (ডেলিভারি ৳${f.delivery})`,
    `পেমেন্ট: ${f.payment}${f.bkashTrxId ? ` — TrxID ${f.bkashTrxId}, from ${f.bkashSender}` : ""}`,
    f.note ? `নোট: ${f.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
