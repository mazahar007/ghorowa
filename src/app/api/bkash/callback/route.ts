import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { executeBkashPayment, queryBkashPayment } from "@/lib/bkash";

/** বিকাশ পেমেন্ট শেষে ক্রেতাকে এখানে ফেরত পাঠায়: ?paymentID=...&status=success|failure|cancel */
export async function GET(request: NextRequest) {
  const paymentID = request.nextUrl.searchParams.get("paymentID") ?? "";
  const status = request.nextUrl.searchParams.get("status");
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  const [order] = paymentID
    ? await db.select().from(schema.orders).where(eq(schema.orders.bkashPaymentId, paymentID))
    : [];
  if (!order) return NextResponse.redirect(`${origin}/`);

  const done = (paid: boolean) =>
    NextResponse.redirect(
      `${origin}/order-success?id=${encodeURIComponent(order.code)}&total=${order.total}&payment=${paid ? "paid" : "failed"}`,
    );

  if (order.paymentStatus === "paid") return done(true);
  if (status !== "success") {
    await db.update(schema.orders).set({ paymentStatus: "failed", updatedAt: new Date() }).where(eq(schema.orders.id, order.id));
    return done(false);
  }

  try {
    let result = await executeBkashPayment(paymentID);
    // execute can time out on bKash's side; the status API is the source of truth
    if (result.transactionStatus !== "Completed") result = await queryBkashPayment(paymentID);
    const paid =
      result.transactionStatus === "Completed" &&
      result.merchantInvoiceNumber === order.code &&
      Number(result.amount) === order.total;
    await db
      .update(schema.orders)
      .set({
        paymentStatus: paid ? "paid" : "failed",
        bkashTrxId: result.trxID ?? null,
        bkashSender: result.customerMsisdn ?? null,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, order.id));
    return done(paid);
  } catch (err) {
    console.error("bKash execute failed", err);
    return done(false);
  }
}
