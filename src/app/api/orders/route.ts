import { randomBytes } from "node:crypto";
import { buildOrder } from "@/lib/order";
import { saveOrder } from "@/lib/order-sinks";

function newOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = randomBytes(2).toString("hex").toUpperCase();
  return `GH-${stamp}${rand}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "অর্ডারের তথ্য পড়া যায়নি।" }, { status: 400 });
  }

  const result = buildOrder(body, newOrderId(), new Date().toISOString());
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    await saveOrder(result.order);
  } catch (err) {
    console.error("Order save failed", err);
    return Response.json(
      { error: "দুঃখিত, এই মুহূর্তে অর্ডার নেওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন বা ফোন করুন।" },
      { status: 502 },
    );
  }

  return Response.json({ id: result.order.id, total: result.order.total });
}
