import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin";
import { deleteProduct } from "../../../actions";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "পণ্য এডিট" };

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[product], categories] = await Promise.all([
    db.select().from(schema.products).where(eq(schema.products.id, id)),
    db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
  ]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bangla text-3xl font-bold">{product.name}</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          gender: product.gender,
          ageGroups: product.ageGroups,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          sizes: product.sizes,
          colors: product.colors,
          images: product.images,
          description: product.description,
          details: product.details,
          featured: product.featured,
          active: product.active,
          inStock: product.inStock,
        }}
      />
      <form action={deleteProduct} className="rounded-2xl border-2 border-dashed border-line-strong p-5">
        <input type="hidden" name="id" value={product.id} />
        <p className="mb-3 text-sm text-soft">
          পণ্য মুছে ফেললে আর ফেরত আনা যাবে না। শুধু সাইট থেকে সরাতে চাইলে উপরে “সাইটে দেখাবে” বন্ধ করুন।
        </p>
        <button type="submit" className="h-11 rounded-xl border-[1.5px] border-brand-dark px-5 font-bold text-brand-dark hover:bg-cream">
          পণ্যটি মুছে ফেলুন
        </button>
      </form>
    </div>
  );
}
