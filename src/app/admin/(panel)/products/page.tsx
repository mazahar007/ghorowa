import Link from "next/link";
import Image from "next/image";
import { asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "পণ্য" };

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const saved = (await searchParams).saved;
  const rows = await db
    .select({ p: schema.products, category: schema.categories.name })
    .from(schema.products)
    .innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .orderBy(asc(schema.categories.sortOrder), desc(schema.products.createdAt));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-bangla text-3xl font-bold">পণ্য</h1>
        <Link href="/admin/products/new" className="flex h-12 items-center rounded-xl bg-brand px-5 font-bold text-white hover:bg-brand-dark">
          + নতুন পণ্য
        </Link>
      </div>
      {typeof saved === "string" && (
        <p role="status" className="rounded-xl bg-[#e6f4ea] px-4 py-3 font-semibold text-[#17703d]">“{saved}” সেভ হয়েছে।</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ p, category }) => (
          <Link key={p.id} href={`/admin/products/${p.id}`} className="flex gap-4 rounded-2xl bg-white p-3 hover:ring-2 hover:ring-brand">
            <span className="relative block aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
              {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="80px" className="object-cover" />}
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-bold leading-snug">{p.name}</span>
              <span className="text-sm text-muted">{category}</span>
              <span className="font-bold text-brand-dark">{formatPrice(p.price)}</span>
              <span className="flex flex-wrap gap-1.5 text-xs font-bold">
                {!p.active && <span className="rounded-full bg-sand px-2 py-0.5 text-muted">লুকানো</span>}
                {!p.inStock && <span className="rounded-full bg-sand px-2 py-0.5 text-muted">স্টক শেষ</span>}
                {p.featured && <span className="rounded-full bg-cream px-2 py-0.5 text-brand-dark">বেস্ট সেলার</span>}
              </span>
            </span>
          </Link>
        ))}
      </div>
      {rows.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted">এখনো কোনো পণ্য নেই।</p>}
    </div>
  );
}
