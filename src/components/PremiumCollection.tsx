import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { Reveal } from "./Reveal";
import { InteractiveGrid } from "./InteractiveGrid";

/** A calm, darker "new collection" band that gives the page a premium moment. */
export function PremiumCollection({ products }: { products: Product[] }) {
  const [lead, ...rest] = products;
  if (!lead) return null;
  return (
    <section aria-labelledby="premium-title" className="relative overflow-hidden rounded-[32px] bg-cocoa px-5 py-12 text-[#f3e9dd] sm:px-10 sm:py-16">
      <InteractiveGrid cell={56} color="232, 162, 127" />
      <div className="relative">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-brand text-sm font-semibold tracking-[0.2em] text-[#e8a27f]">NEW COLLECTION</p>
            <h2 id="premium-title" className="mt-2 font-bangla text-3xl font-bold text-white sm:text-5xl">নতুন কালেকশন</h2>
            <p className="mt-3 max-w-md text-[#c9b8a6]">বেছে বেছে আনা নতুন ডিজাইন — উৎসব, দাওয়াত আর প্রতিদিনের জন্য।</p>
          </div>
          <Link href="/category/kids-fashion?sort=new" className="inline-flex h-12 items-center rounded-full border border-[#5a463b] px-6 font-bold text-white hover:bg-cocoa-soft">
            সব নতুন পণ্য
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Link href={`/product/${lead.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-cocoa-soft md:aspect-auto md:h-full md:min-h-[520px]">
              <ProductImage product={lead} sizes="(max-width: 768px) 100vw, 640px" className="transition duration-[1200ms] group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                <span className="text-xl font-bold text-white">{lead.name}</span>
                <span className="rounded-full bg-white px-3 py-1.5 font-bold text-ink">{formatPrice(lead.price)}</span>
              </span>
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {rest.slice(0, 4).map((p, i) => (
              <Reveal key={p.slug} delay={120 * (i + 1)}>
                <Link href={`/product/${p.slug}`} className="group block">
                  <span className="relative block aspect-square overflow-hidden rounded-[20px] bg-cocoa-soft">
                    <ProductImage product={p} sizes="(max-width: 768px) 50vw, 300px" className="transition duration-700 group-hover:scale-105" />
                  </span>
                  <span className="mt-2 block font-semibold text-white">{p.name}</span>
                  <span className="text-sm text-[#c9b8a6]">{formatPrice(p.price)}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
