import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "নতুন পণ্য" };

export default async function NewProduct() {
  await requireAdmin();
  const categories = await db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder));
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bangla text-3xl font-bold">নতুন পণ্য</h1>
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
