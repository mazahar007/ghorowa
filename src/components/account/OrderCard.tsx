import type { OrderItemRow, OrderRow } from "@/db/schema";
import { formatPrice, toBn } from "@/lib/format";
import { orderStatusLabels, paymentMethodLabels, paymentStatusLabels } from "@/lib/labels";
import { steadfastTrackingUrl } from "@/lib/steadfast";

const steps = ["new", "confirmed", "shipped", "delivered"];
const dateFmt = new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" });

export function OrderCard({ order, items }: { order: OrderRow; items: OrderItemRow[] }) {
  const stepIndex = steps.indexOf(order.status);
  return (
    <article className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold">অর্ডার {order.code}</h3>
          <p className="text-sm text-muted">{dateFmt.format(order.createdAt)}</p>
        </div>
        <p className="text-right">
          <span className="block text-lg font-bold">{formatPrice(order.total)}</span>
          <span className="text-xs text-muted">
            {paymentMethodLabels[order.paymentMethod]} · {paymentStatusLabels[order.paymentStatus]}
          </span>
        </p>
      </div>

      {stepIndex >= 0 ? (
        <ol className="my-4 grid grid-cols-4 gap-1" aria-label="অর্ডারের অবস্থা">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-col gap-1.5">
              <span className={`h-1.5 rounded-full ${i <= stepIndex ? "bg-brand" : "bg-line"}`} />
              <span className={`text-xs ${i <= stepIndex ? "font-bold text-ink" : "text-muted"}`} aria-current={i === stepIndex ? "step" : undefined}>
                {orderStatusLabels[s]}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="my-4 rounded-lg bg-sand px-3 py-2 text-sm font-semibold">{orderStatusLabels[order.status]}</p>
      )}

      <ul className="space-y-1 text-sm text-soft">
        {items.map((i) => (
          <li key={i.id}>
            {i.name} ({i.size}{i.color && `, ${i.color}`}) × {toBn(i.qty)}
          </li>
        ))}
      </ul>
      {order.courierTrackingCode && (
        <a href={steadfastTrackingUrl(order.courierTrackingCode)} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-11 items-center rounded-xl border-[1.5px] border-ink px-4 text-sm font-bold hover:bg-cream">
          কুরিয়ারে ট্র্যাক করুন ({order.courierTrackingCode})
        </a>
      )}
    </article>
  );
}
