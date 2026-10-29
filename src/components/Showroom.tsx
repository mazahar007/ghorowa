"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cart, cartDrawer } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { HangerStack, StageProgress } from "./HangerStack";
import { BagIcon, ChevronIcon } from "./icons";

/** ভাসমান কাচের কার্ড: নাম, দাম, সাইজ আর কার্টে যোগ — স্টেজ ছেড়ে না গিয়েই কেনা যায়। */
function InfoCard({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [hint, setHint] = useState(false);

  function add() {
    if (!size) return setHint(true);
    cart.add({ slug: product.slug, size, color: product.colors[0], name: product.name, price: product.price, image: product.images[0] });
    cartDrawer.open();
  }

  return (
    <div className="glass-card animate-[slide-up_0.5s_ease] rounded-3xl p-5">
      <p className="text-xs font-semibold tracking-wide text-muted">{product.categoryName}</p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h3 className="font-bangla text-xl font-bold leading-snug">{product.name}</h3>
        <p className="shrink-0 text-right">
          <span className="block text-lg font-bold text-brand-dark">{formatPrice(product.price)}</span>
          {product.compareAtPrice && <s className="text-sm text-muted">{formatPrice(product.compareAtPrice)}</s>}
        </p>
      </div>
      {product.description && <p className="mt-2 line-clamp-2 text-sm text-soft">{product.description}</p>}

      {product.inStock ? (
        <>
          <p className="mt-4 mb-2 text-sm font-bold">{hint ? <span role="alert" className="text-brand-dark">আগে সাইজ বেছে নিন</span> : "সাইজ"}</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => { setSize(s); setHint(false); }}
                className={`h-9 min-w-11 rounded-lg px-2.5 text-sm font-semibold transition ${size === s ? "bg-ink text-cream" : "bg-white/80 hover:bg-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" onClick={add} className="mt-4 flex h-12 w-full items-center justify-between rounded-xl bg-ink px-5 font-bold text-cream hover:bg-cocoa-soft">
            কার্টে যোগ করুন <BagIcon size={18} />
          </button>
        </>
      ) : (
        <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-sm font-semibold">এই পণ্যটি এখন স্টকে নেই</p>
      )}
      <Link href={`/product/${product.slug}`} className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-soft hover:text-ink">
        বিস্তারিত দেখুন <ChevronIcon size={16} />
      </Link>
    </div>
  );
}

/**
 * শোরুম: রেলে ঝোলানো পোশাক, সামনেরটা বড় করে দেখায়; পাশে ভাসমান কার্ডে দাম আর সাইজ।
 */
export function Showroom({ products, title, eyebrow, href }: { products: Product[]; title: string; eyebrow: string; href: string }) {
  const [active, setActive] = useState(0);
  const product = products[active];
  if (!product) return null;
  const label = (i: number) => products[i].name;

  return (
    <section aria-labelledby="showroom-title" className="studio-wall relative overflow-hidden rounded-[32px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-5 sm:p-7">
        <div>
          <p className="font-brand text-xs font-semibold tracking-[0.25em] text-brand-dark">{eyebrow}</p>
          <h2 id="showroom-title" className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">{title}</h2>
        </div>
        <Link href={href} className="glass-card pointer-events-auto hidden h-10 items-center rounded-full px-4 text-sm font-bold sm:inline-flex">
          সব কালেকশন
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-end">
        <HangerStack
          count={products.length}
          active={active}
          onChange={setActive}
          itemLabel={label}
          className="mt-20 h-[420px] sm:mt-16 sm:h-[560px] lg:h-[640px]"
          renderItem={(i, isActive) => (
            <Link href={`/product/${products[i].slug}`} tabIndex={isActive ? 0 : -1} className="relative block h-full w-full">
              <ProductImage product={products[i]} stage sizes="(max-width: 1024px) 60vw, 480px" />
            </Link>
          )}
        />

        <div className="relative z-40 px-4 pb-5 sm:px-7 lg:pb-7 lg:pl-0">
          <InfoCard key={product.slug} product={product} />
        </div>
      </div>

      <div className="relative z-40 flex items-center justify-between gap-4 px-5 pb-4 sm:px-7 lg:absolute lg:bottom-3 lg:left-0 lg:pb-3">
        <StageProgress count={products.length} active={active} onChange={setActive} label={label} />
        <Link href={href} className="text-sm font-bold underline sm:hidden">সব কালেকশন</Link>
      </div>
    </section>
  );
}
