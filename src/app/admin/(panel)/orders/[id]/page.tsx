import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { paymentMethodLabels } from "@/lib/labels";
import { deliveryZoneLabels, type DeliveryZone } from "@/lib/shipping";
import { formatPrice, toBn } from "@/lib/format";
import { steadfastEnabled, steadfastTrackingUrl } from "@/lib/steadfast";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/StatusBadge";
import { CourierPanel, OrderUpdateForm } from "./OrderForms";

export const metadata = { title: "অর্ডারের বিস্তারিত" };

const dateFmt = new Intl.DateTimeFormat("bn-BD", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Dhaka" });

export default async function AdminOrderDetail({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
  if (!order) notFound();
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/orders" className="text-muted underline">← সব অর্ডার</Link>
        <h1 className="font-bangla text-3xl font-bold">{order.code}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="-mt-4 text-sm text-muted">{dateFmt.format(order.createdAt)}</p>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl bg-white p-5">
            <h2 className="mb-3 font-bangla text-xl font-bold">পণ্য</h2>
            <ul className="divide-y divide-line">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3">
                  <span>
                    <Link href={`/product/${i.productSlug}`} target="_blank" className="font-semibold underline">{i.name}</Link>
                    <span className="block text-sm text-muted">সাইজ {i.size}{i.color && ` · ${i.color}`} · {formatPrice(i.unitPrice)} × {toBn(i.qty)}</span>
                  </span>
                  <span className="font-bold">{formatPrice(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-1 border-t border-line pt-3">
              <dt>পণ্যের দাম</dt><dd className="text-right">{formatPrice(order.subtotal)}</dd>
              <dt>ডেলিভারি</dt><dd className="text-right">{formatPrice(order.delivery)}</dd>
              <dt className="text-lg font-bold">সর্বমোট</dt><dd className="text-right text-lg font-bold">{formatPrice(order.total)}</dd>
            </dl>
          </section>

          <section className="grid gap-6 rounded-2xl bg-white p-5 sm:grid-cols-2">
            <div>
              <h2 className="mb-2 font-bangla text-xl font-bold">ক্রেতা</h2>
              <p className="font-semibold">{order.name}</p>
              <p><a href={`tel:${order.phone}`} className="underline">{order.phone}</a></p>
              <p className="mt-1 text-soft">{order.address}</p>
              <p className="text-sm text-muted">{deliveryZoneLabels[order.zone as DeliveryZone]}</p>
              {order.note && <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-sm">নোট: {order.note}</p>}
            </div>
            <div>
              <h2 className="mb-2 font-bangla text-xl font-bold">পেমেন্ট</h2>
              <p>{paymentMethodLabels[order.paymentMethod]}</p>
              <PaymentBadge status={order.paymentStatus} />
              {order.bkashTrxId && <p className="mt-1 text-sm">TrxID: <b>{order.bkashTrxId}</b></p>}
              {order.bkashSender && <p className="text-sm">নম্বর: {order.bkashSender}</p>}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl bg-white p-5">
            <h2 className="mb-3 font-bangla text-xl font-bold">স্ট্যাটাস আপডেট</h2>
            <OrderUpdateForm key={`${order.status}-${order.paymentStatus}-${order.updatedAt.getTime()}`} id={order.id} status={order.status} paymentStatus={order.paymentStatus} adminNote={order.adminNote} />
          </section>
          <section className="rounded-2xl bg-white p-5">
            <h2 className="mb-3 font-bangla text-xl font-bold">কুরিয়ার (Steadfast)</h2>
            {order.courierConsignmentId ? (
              <div className="mb-3 text-sm">
                <p>Consignment ID: <b>{order.courierConsignmentId}</b></p>
                {order.courierTrackingCode && (
                  <p>
                    ট্র্যাকিং:{" "}
                    <a href={steadfastTrackingUrl(order.courierTrackingCode)} target="_blank" rel="noreferrer" className="font-bold underline">
                      {order.courierTrackingCode}
                    </a>
                  </p>
                )}
                <p>কুরিয়ার স্ট্যাটাস: <b>{order.courierStatus ?? "—"}</b></p>
              </div>
            ) : (
              <p className="mb-3 text-sm text-muted">
                {order.paymentStatus === "paid" ? "টাকা পরিশোধিত — কুরিয়ার ক্যাশ নেবে না।" : `কুরিয়ার ক্রেতার কাছ থেকে ${formatPrice(order.total)} নেবে।`}
              </p>
            )}
            <CourierPanel id={order.id} booked={Boolean(order.courierConsignmentId)} enabled={steadfastEnabled()} />
          </section>
        </div>
      </div>
    </div>
  );
}
