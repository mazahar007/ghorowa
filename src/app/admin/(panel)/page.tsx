import Link from "next/link";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { formatPrice, toBn } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/StatusBadge";

export const metadata = { title: "ড্যাশবোর্ড" };

export default async function AdminDashboard() {
  await requireAdmin();
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const [[newOrders], [today], [products], recent] = await Promise.all([
    db.select({ n: count() }).from(schema.orders).where(eq(schema.orders.status, "new")),
    db
      .select({ n: count(), total: sql<number>`coalesce(sum(${schema.orders.total}), 0)::int` })
      .from(schema.orders)
      .where(gte(schema.orders.createdAt, since)),
    db.select({ n: count() }).from(schema.products).where(eq(schema.products.active, true)),
    db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(8),
  ]);

  const stats = [
    { label: "নতুন অর্ডার (কনফার্ম বাকি)", value: toBn(newOrders.n), href: "/admin/orders?status=new" },
    { label: "আজকের অর্ডার", value: toBn(today.n), href: "/admin/orders" },
    { label: "আজকের বিক্রি", value: formatPrice(today.total), href: "/admin/orders" },
    { label: "সক্রিয় পণ্য", value: toBn(products.n), href: "/admin/products" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-bangla text-3xl font-bold">ড্যাশবোর্ড</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl bg-white p-5 hover:ring-2 hover:ring-brand">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>
      <section className="rounded-2xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bangla text-xl font-bold">সাম্প্রতিক অর্ডার</h2>
          <Link href="/admin/orders" className="font-semibold underline">সব দেখুন</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted">এখনো কোনো অর্ডার নেই।</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-sand">
                  <span className="font-semibold">{o.code} · {o.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-bold">{formatPrice(o.total)}</span>
                    <OrderStatusBadge status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
