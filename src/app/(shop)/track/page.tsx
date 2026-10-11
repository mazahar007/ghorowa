import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { normalizeBdPhone } from "@/lib/format";
import { OrderCard } from "@/components/account/OrderCard";

export const metadata: Metadata = { title: "অর্ডার ট্র্যাক", robots: { index: false } };

async function Result({ searchParams }: { searchParams: PageProps<"/track">["searchParams"] }) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code.trim().toUpperCase().slice(0, 20) : "";
  const phone = typeof sp.phone === "string" ? normalizeBdPhone(sp.phone) : null;

  return (
    <>
      <form className="grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[1fr_1fr_auto]">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">অর্ডার নম্বর</span>
          <input name="code" defaultValue={code} required placeholder="GH-XXXXXXXX" className="h-12 rounded-xl border-[1.5px] border-line-strong px-3.5 uppercase" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">মোবাইল নম্বর</span>
          <input name="phone" type="tel" defaultValue={phone ?? ""} required placeholder="01XXXXXXXXX" className="h-12 rounded-xl border-[1.5px] border-line-strong px-3.5" />
        </label>
        <button className="h-12 self-end rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">ট্র্যাক করুন</button>
      </form>
      {code && phone && <OrderResult code={code} phone={phone} />}
    </>
  );
}

async function OrderResult({ code, phone }: { code: string; phone: string }) {
  const [order] = await db.select().from(schema.orders).where(and(eq(schema.orders.code, code), eq(schema.orders.phone, phone)));
  if (!order) return <p className="mt-6 rounded-2xl bg-sand px-6 py-8 text-center text-muted">এই নম্বর ও ফোনে কোনো অর্ডার পাওয়া যায়নি।</p>;
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id));
  return (
    <div className="mt-6">
      <OrderCard order={order} items={items} />
    </div>
  );
}

export default function TrackPage({ searchParams }: PageProps<"/track">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 font-bangla text-3xl font-bold">অর্ডার ট্র্যাক করুন</h1>
      <p className="mb-6 text-soft">
        অর্ডার নম্বর ও মোবাইল নম্বর দিন। অথবা <Link href="/account/login" className="font-semibold underline">লগইন করে</Link> সব অর্ডার দেখুন।
      </p>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-sand" />}>
        <Result searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
