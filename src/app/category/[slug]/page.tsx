import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, getProductsByCategory } from "@/data/catalog";
import { ProductFilter } from "@/components/ProductFilter";
import { site } from "@/config/site";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const category = getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:underline">হোম</Link> / <span>{category.name}</span>
      </nav>
      <h1 className="font-bangla text-3xl font-bold sm:text-4xl">{category.name}</h1>
      <p className="mb-8 mt-2 text-muted">{category.description}</p>

      {category.live && products.length > 0 ? (
        <ProductFilter products={products} showAge={category.slug === "kids-fashion"} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[28px] bg-cream px-6 py-16 text-center">
          <span className="rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-dark">শীঘ্রই আসছে</span>
          <h2 className="font-bangla text-2xl font-bold">এই ক্যাটাগরির পণ্য খুব শীঘ্রই আসছে</h2>
          <p className="max-w-md text-soft">
            নতুন পণ্য এলে জানতে আমাদের ফেসবুক পেজে চোখ রাখুন। এখন দেখে নিন আমাদের কিডস কালেকশন।
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/category/kids-fashion" className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
              কিডস ফ্যাশন দেখুন
            </Link>
            <a href={site.facebook} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-ink px-6 font-bold hover:bg-white">
              ফেসবুক পেজ
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
