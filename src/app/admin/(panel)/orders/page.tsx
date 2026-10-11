import Link from "next/link";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/labels";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/StatusBadge";

export const metadata = { title: "অর্ডার" };

const dateFmt = new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" });

export default async function AdminOrders({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status in orderStatusLabels ? sp.status : null;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 50) : "";

  const where: SQL[] = [];
  if (status) where.push(eq(schema.orders.status, status));
  if (q) where.push(or(ilike(schema.orders.code, `%${q}%`), ilike(schema.orders.phone, `%${q}%`), ilike(schema.orders.name, `%${q}%`))!);
  const orders = await db
    .select()
    .from(schema.orders)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(schema.orders.createdAt))
    .limit(200);

  const tabs = [{ id: null, label: "সব" }, ...Object.entries(orderStatusLabels).map(([id, label]) => ({ id, label }))];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bangla text-3xl font-bold">অর্ডার</h1>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.id ? `/admin/orders?status=${t.id}` : "/admin/orders"}
            className={`flex h-10 items-center rounded-full px-4 text-sm font-semibold ${status === t.id ? "bg-ink text-cream" : "bg-white hover:bg-cream"}`}
          >
            {t.label}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="অর্ডার নম্বর / ফোন / নাম" aria-label="অর্ডার খুঁজুন" className="h-10 w-56 rounded-xl border-[1.5px] border-line-strong bg-white px-3" />
          <button className="h-10 rounded-xl bg-ink px-4 font-semibold text-cream">খুঁজুন</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">অর্ডার</th>
              <th scope="col" className="px-4 py-3">ক্রেতা</th>
              <th scope="col" className="px-4 py-3">মোট</th>
              <th scope="col" className="px-4 py-3">পেমেন্ট</th>
              <th scope="col" className="px-4 py-3">স্ট্যাটাস</th>
              <th scope="col" className="px-4 py-3">সময়</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-sand">
                <td className="px-4 py-3 font-bold"><Link href={`/admin/orders/${o.id}`} className="underline">{o.code}</Link></td>
                <td className="px-4 py-3">{o.name}<br /><span className="text-muted">{o.phone}</span></td>
                <td className="px-4 py-3 font-bold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">{paymentMethodLabels[o.paymentMethod]}<br /><PaymentBadge status={o.paymentStatus} /></td>
                <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-muted">{dateFmt.format(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-muted">কোনো অর্ডার পাওয়া যায়নি।</p>}
      </div>
    </div>
  );
}
