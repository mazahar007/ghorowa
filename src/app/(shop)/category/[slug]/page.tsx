import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { ProductFilter } from "@/components/ProductFilter";
import { site } from "@/config/site";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.length ? categories.map((c) => ({ slug: c.slug })) : [{ slug: "kids-fashion" }];
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const products = await getProductsByCategory(category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:underline">হোম</Link> / <span>{category.name}</span>
      </nav>
      <div className="mb-6 rounded-[28px] bg-cream px-6 py-8 sm:px-10">
        <h1 className="font-bangla text-3xl font-bold sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-soft">{category.description}</p>
      </div>

      {category.live && products.length > 0 ? (
        <ProductFilter products={products} showKidsFilters={category.slug === "kids-fashion"} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-line bg-white px-6 py-16 text-center">
          <span className="rounded-full bg-cream px-3.5 py-1.5 text-sm font-bold text-brand-dark">শীঘ্রই আসছে</span>
          <h2 className="font-bangla text-2xl font-bold">এই ক্যাটাগরির পণ্য খুব শীঘ্রই আসছে</h2>
          <p className="max-w-md text-soft">নতুন পণ্য এলে জানতে আমাদের ফেসবুক পেজে চোখ রাখুন। এখন দেখে নিন আমাদের কিডস কালেকশন।</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/category/kids-fashion" className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
              কিডস ফ্যাশন দেখুন
            </Link>
            <a href={site.facebook} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-ink px-6 font-bold hover:bg-cream">
              ফেসবুক পেজ
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
