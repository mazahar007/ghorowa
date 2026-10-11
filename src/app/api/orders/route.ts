import { after } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getCustomerId } from "@/lib/auth";
import { createBkashPayment } from "@/lib/bkash";
import { createOrder, validateOrder } from "@/lib/order";
import { notifyNewOrder } from "@/lib/order-sinks";
import { site } from "@/config/site";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "অর্ডারের তথ্য পড়া যায়নি।" }, { status: 400 });
  }

  const result = await validateOrder(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });

  let order;
  try {
    order = await createOrder(result.order, await getCustomerId());
  } catch (err) {
    console.error("Order save failed", err);
    return Response.json(
      { error: "দুঃখিত, এই মুহূর্তে অর্ডার নেওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন বা ফোন করুন।" },
      { status: 502 },
    );
  }

  after(() => notifyNewOrder(order, result.order.lines));

  if (order.paymentMethod === "bkash_online") {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
      const payment = await createBkashPayment({
        amount: order.total,
        invoice: order.code,
        payerReference: order.phone,
        callbackURL: `${origin}/api/bkash/callback`,
      });
      await db.update(schema.orders).set({ bkashPaymentId: payment.paymentID }).where(eq(schema.orders.id, order.id));
      return Response.json({ id: order.code, total: order.total, redirect: payment.bkashURL });
    } catch (err) {
      console.error("bKash create failed", err);
      return Response.json({
        id: order.code,
        total: order.total,
        warning: `অর্ডার নেওয়া হয়েছে, কিন্তু বিকাশ পেমেন্ট শুরু করা যায়নি। আমরা ফোন করে পেমেন্টের ব্যবস্থা করব (${site.phone})।`,
      });
    }
  }

  return Response.json({ id: order.code, total: order.total });
}
