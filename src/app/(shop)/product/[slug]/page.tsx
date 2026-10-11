import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveProducts, getProduct, getProductsByCategory } from "@/lib/catalog";
import { formatPrice, toBn } from "@/lib/format";
import { site } from "@/config/site";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductRail } from "@/components/ProductCard";
import { SectionHeader } from "@/components/Section";
import { AddToCart } from "@/components/AddToCart";
import { CardIcon, ReturnIcon, TruckIcon, WhatsAppIcon } from "@/components/icons";

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const related = (await getProductsByCategory(product.categorySlug)).filter((p) => p.slug !== product.slug).slice(0, 10);
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const waText = `আসসালামু আলাইকুম, আমি "${product.name}" (${formatPrice(product.price)}) অর্ডার করতে চাই।\n${site.url}/product/${product.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-5 text-sm text-muted">
        <Link href="/" className="hover:underline">হোম</Link> /{" "}
        <Link href={`/category/${product.categorySlug}`} className="hover:underline">{product.categoryName}</Link> /{" "}
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery product={product} />

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-bangla text-3xl font-bold leading-snug sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-sm text-muted">{product.inStock ? "স্টকে আছে" : "স্টক শেষ"}</p>
          </div>
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

          <a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#1f8f4e] font-bold text-[#17703d] hover:bg-[#eaf6ef]"
          >
            <WhatsAppIcon size={22} /> WhatsApp-এ অর্ডার করুন
          </a>

          <ul className="grid gap-3 rounded-2xl border border-line bg-white p-5 text-sm">
            <li className="flex items-center gap-3">
              <TruckIcon size={22} className="shrink-0 text-brand-dark" />
              ঢাকায় ডেলিভারি {formatPrice(site.delivery.insideDhaka)}, ঢাকার বাইরে {formatPrice(site.delivery.outsideDhaka)}
            </li>
            <li className="flex items-center gap-3">
              <CardIcon size={22} className="shrink-0 text-brand-dark" />
              ক্যাশ অন ডেলিভারি অথবা বিকাশে পেমেন্ট
            </li>
            <li className="flex items-center gap-3">
              <ReturnIcon size={22} className="shrink-0 text-brand-dark" />
              <span>
                সাইজ না মিললে এক্সচেঞ্জ — <Link href="/help#returns" className="font-semibold underline">নিয়ম দেখুন</Link>
              </span>
            </li>
          </ul>

          {product.details.length > 0 && (
            <div>
              <h2 className="mb-2 font-bangla text-xl font-bold">বিস্তারিত</h2>
              <ul className="list-disc space-y-1 pl-5 text-soft">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-16">
          <SectionHeader title="আরও দেখুন" href={`/category/${product.categorySlug}`} />
          <ProductRail products={related} />
        </section>
      )}
    </div>
  );
}
