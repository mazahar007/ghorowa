import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { QuickAdd } from "./QuickAdd";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const saving = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream">
        <ProductImage product={product} priority={priority} className="transition duration-500 group-hover:scale-105" />
        {product.images[1] && (
          <ProductImage product={product} index={1} className="opacity-0 transition duration-500 group-hover:opacity-100" />
        )}
        <span className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {saving > 0 && (
            <span className="rounded-full bg-brand-dark px-2.5 py-1 text-xs font-bold text-white">
              {formatPrice(saving)} ছাড়
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-cream">স্টক শেষ</span>
          )}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-3.5">
        <h3 className="line-clamp-2 min-h-[2.75em] text-[15px] font-semibold leading-snug">
          <Link href={`/product/${product.slug}`} className="hover:text-brand-dark">
            {product.name}
          </Link>
        </h3>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold text-brand-dark">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <s className="text-sm text-muted">{formatPrice(product.compareAtPrice)}</s>
          )}
        </p>
        <div className="mt-auto pt-2">
          <QuickAdd product={product} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 2} />
      ))}
    </div>
  );
}

/** Desktop shows exactly one row: 3 / 4 / 5 cards as the grid widens. */
function railVisibility(i: number) {
  if (i < 3) return "";
  if (i === 3) return "sm:hidden lg:block";
  if (i === 4) return "sm:hidden xl:block";
  return "sm:hidden";
}

/** মোবাইলে আড়াআড়ি স্ক্রল; বড় স্ক্রিনে এক সারির গ্রিড (বাকি পণ্য "সব দেখুন"-এ)। */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p, i) => (
        <div key={p.slug} className={`w-[46%] shrink-0 snap-start sm:w-auto ${railVisibility(i)}`}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
