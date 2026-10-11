import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct, getProductsByCategory, products } from "@/data/catalog";
import { formatPrice, toBn } from "@/lib/format";
import { site } from "@/config/site";
import { ProductImage } from "@/components/ProductImage";
import { ProductGrid } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { CardIcon, ReturnIcon, TruckIcon } from "@/components/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-5 text-sm text-muted">
        <Link href="/" className="hover:underline">হোম</Link> /{" "}
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:underline">{category.name}</Link> /{" "}
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <ProductImage product={product} sizes="(max-width: 1024px) 100vw, 600px" priority />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                  <ProductImage product={product} index={i + 1} sizes="150px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="font-bangla text-3xl font-bold leading-snug sm:text-4xl">{product.name}</h1>
          <p className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-dark">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <s className="text-lg text-muted">{formatPrice(product.compareAtPrice)}</s>
                <span className="rounded-full bg-brand-dark px-2.5 py-1 text-sm font-bold text-white">{toBn(discount)}% ছাড়</span>
              </>
            )}
          </p>
          <p className="text-lg leading-relaxed text-soft">{product.description}</p>

          <AddToCart product={product} />

          <ul className="grid gap-2 rounded-2xl border border-line bg-white p-5 text-sm">
            <li className="flex items-center gap-3">
              <TruckIcon size={22} className="shrink-0 text-brand-dark" />
              ঢাকায় ডেলিভারি চার্জ {formatPrice(site.delivery.insideDhaka)}, ঢাকার বাইরে {formatPrice(site.delivery.outsideDhaka)}
            </li>
            <li className="flex items-center gap-3">
              <CardIcon size={22} className="shrink-0 text-brand-dark" />
              ক্যাশ অন ডেলিভারি অথবা bKash-এ পেমেন্ট
            </li>
            <li className="flex items-center gap-3">
              <ReturnIcon size={22} className="shrink-0 text-brand-dark" />
              সাইজ না মিললে এক্সচেঞ্জ —{" "}
              <Link href="/help#returns" className="font-semibold underline">নিয়ম দেখুন</Link>
            </li>
          </ul>

          <div>
            <h2 className="mb-2 font-bangla text-xl font-bold">বিস্তারিত</h2>
            <ul className="list-disc space-y-1 pl-5 text-soft">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-16">
          <h2 className="mb-6 font-bangla text-2xl font-bold">আরও দেখুন</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
