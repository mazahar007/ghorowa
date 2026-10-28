import Link from "next/link";
import type { HeroSlide } from "@/config/home";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { InteractiveGrid } from "./InteractiveGrid";
import { ProductImage } from "./ProductImage";
import { CardIcon, ReturnIcon, TruckIcon } from "./icons";

export function Hero({ slide, product }: { slide: HeroSlide; product?: Product }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-[#fdfbf7] via-paper to-cream">
      <InteractiveGrid />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-soft blur-3xl" aria-hidden="true" />
      <div className="relative grid items-center gap-10 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-brand-dark backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            {slide.eyebrow}
          </span>
          <h1 className="font-bangla text-[40px] font-bold leading-[1.12] tracking-tight sm:text-6xl">
            {slide.title}
            <br />
            <span className="text-brand">{slide.highlight}</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-soft">{slide.subtitle}</p>
          <div className="mt-1 flex flex-wrap gap-3">
            <Link href={slide.href} className="inline-flex h-13 items-center rounded-full bg-brand px-7 font-bold text-white shadow-[0_8px_24px_-8px_rgba(181,80,42,0.55)] transition hover:-translate-y-0.5 hover:bg-brand-dark">
              {slide.cta}
            </Link>
            <Link href="/categories" className="inline-flex h-13 items-center rounded-full border-[1.5px] border-line-strong bg-white/70 px-7 font-bold backdrop-blur hover:border-ink">
              সব ক্যাটাগরি
            </Link>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-soft">
            <li className="flex items-center gap-2"><TruckIcon size={18} className="text-brand" /> সারা দেশে ডেলিভারি</li>
            <li className="flex items-center gap-2"><CardIcon size={18} className="text-brand" /> ক্যাশ অন ডেলিভারি</li>
            <li className="flex items-center gap-2"><ReturnIcon size={18} className="text-brand" /> সহজ এক্সচেঞ্জ</li>
          </ul>
        </div>

        {product && (
          <Link
            href={`/product/${product.slug}`}
            className="group relative mx-auto w-full max-w-sm animate-[float_7s_ease-in-out_infinite] rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-[0_30px_60px_-30px_rgba(43,32,27,0.35)] backdrop-blur"
          >
            <span className="relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-cream">
              <ProductImage product={product} sizes="(max-width: 1024px) 90vw, 400px" priority className="transition duration-700 group-hover:scale-105" />
            </span>
            <span className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">এই সপ্তাহের পছন্দ</span>
                <span className="block font-bold leading-snug">{product.name}</span>
              </span>
              <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1.5 font-bold text-brand-dark">{formatPrice(product.price)}</span>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
