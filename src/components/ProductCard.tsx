import Link from "next/link";
import type { Product } from "@/data/catalog";
import { formatPrice, toBn } from "@/lib/format";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-3 transition-shadow hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-xl">
        <ProductImage product={product} />
        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-dark px-2.5 py-1 text-xs font-bold text-white">
            {toBn(discount)}% ছাড়
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-cream">
            স্টক শেষ
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-1">
        <h3 className="text-base font-bold leading-snug">
          <Link href={`/product/${product.slug}`} className="hover:text-brand-dark">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted">সাইজ: {product.sizes.join(", ")}</p>
        <p className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-brand-dark">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <s className="text-sm text-muted">{formatPrice(product.compareAtPrice)}</s>
          )}
        </p>
      </div>
      <Link
        href={`/product/${product.slug}`}
        className="flex h-11 items-center justify-center rounded-xl bg-brand font-bold text-white hover:bg-brand-dark"
      >
        সাইজ বেছে কিনুন
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
