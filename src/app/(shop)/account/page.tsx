import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { getCurrentCustomer } from "@/lib/customers";
import { OrderCard } from "@/components/account/OrderCard";
import { ProfileForm } from "@/components/account/AuthForms";
import { logoutCustomer } from "./actions";

export const metadata: Metadata = { title: "আমার অ্যাকাউন্ট", robots: { index: false } };

async function Account() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");
  const orders = await db.select().from(schema.orders).where(eq(schema.orders.customerId, customer.id)).orderBy(desc(schema.orders.createdAt)).limit(50);
  const items = orders.length
    ? await db.select().from(schema.orderItems).where(inArray(schema.orderItems.orderId, orders.map((o) => o.id)))
    : [];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bangla text-3xl font-bold">আসসালামু আলাইকুম, {customer.name}</h1>
          <p className="text-muted">{customer.phone}</p>
        </div>
        <form action={logoutCustomer}>
          <button type="submit" className="h-11 rounded-xl border-[1.5px] border-line-strong px-4 font-semibold hover:bg-sand">লগআউট</button>
        </form>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="orders-title">
          <h2 id="orders-title" className="mb-4 font-bangla text-2xl font-bold">আমার অর্ডার</h2>
          {orders.length === 0 ? (
            <p className="rounded-2xl bg-sand px-6 py-10 text-center text-muted">এখনো কোনো অর্ডার নেই।</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} items={items.filter((i) => i.orderId === o.id)} />
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="profile-title" className="h-fit rounded-2xl bg-cream p-5">
          <h2 id="profile-title" className="mb-4 font-bangla text-xl font-bold">ডেলিভারির তথ্য</h2>
          <ProfileForm name={customer.name} address={customer.address} zone={customer.zone} />
        </section>
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-sand" />}>
        <Account />
      </Suspense>
    </div>
  );
}
