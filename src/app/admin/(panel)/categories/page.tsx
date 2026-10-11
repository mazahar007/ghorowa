import { asc, count, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { toBn } from "@/lib/format";
import { CategoryForm } from "./CategoryForm";

export const metadata = { title: "ক্যাটাগরি" };

export default async function AdminCategories() {
  await requireAdmin();
  const rows = await db
    .select({ c: schema.categories, n: count(schema.products.id) })
    .from(schema.categories)
    .leftJoin(schema.products, eq(schema.products.categoryId, schema.categories.id))
    .groupBy(schema.categories.id)
    .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bangla text-3xl font-bold">ক্যাটাগরি</h1>
      <p className="text-soft">“চালু” করলে ক্যাটাগরিতে পণ্য দেখাবে; বন্ধ থাকলে সাইটে “শীঘ্রই আসছে” লেখা থাকবে।</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map(({ c, n }) => (
          <div key={c.id} className="rounded-2xl bg-white p-5">
            <p className="mb-3 text-sm text-muted">/category/{c.slug} · {toBn(n)}টি পণ্য</p>
            <CategoryForm category={{ id: c.id, name: c.name, description: c.description, live: c.live, sortOrder: c.sortOrder }} />
          </div>
        ))}
        <div className="rounded-2xl border-2 border-dashed border-line-strong bg-white p-5">
          <h2 className="mb-3 font-bangla text-xl font-bold">নতুন ক্যাটাগরি</h2>
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
