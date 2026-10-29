"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { cart, cartDrawer } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { HangerStack, StageProgress } from "./HangerStack";
import { Segmented } from "./Segmented";
import { bodies, defaultBody, Mannequin, type Body, type Side } from "./Mannequin";
import { BagIcon, ChevronIcon, TurnIcon } from "./icons";
import { toBn } from "@/lib/format";

/** অন্তত একটা পণ্যে ছবি থাকলেই "পরিয়ে দেখুন" বাটন দেখায় (ছবি ছাড়া পণ্য ম্যানিকিনে আসে না)। */
const TRY_ON_MIN_PRODUCTS = 1;

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

/** ম্যানিকিনের গায়ে সামনের পণ্য; সোয়াইপ বা তীরে পরের পণ্য, শরীর বদলানো আর ঘুরিয়ে দেখা যায়। */
function TryOnStage({
  products,
  active,
  onChange,
  className,
}: {
  products: Product[];
  active: number;
  onChange: (i: number) => void;
  className: string;
}) {
  const product = products[active];
  const [chosenBody, setBody] = useState<Body | null>(null);
  const [side, setSide] = useState<Side>("front");
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);
  const body = chosenBody ?? defaultBody(product);
  const garment = side === "back" && product.images[1] ? product.images[1] : product.images[0];
  const go = (i: number) => {
    setSide("front");
    onChange((i + products.length) % products.length);
  };

  return (
    <div
      className={`relative touch-pan-y select-none ${className}`}
      onPointerDown={(e) => {
        startX.current = e.clientX;
        swiped.current = false;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) {
          swiped.current = true;
          go(active + (dx < 0 ? 1 : -1));
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      // a swipe must not also open the product it started on
      onClickCapture={(e) => {
        if (swiped.current) {
          e.preventDefault();
          e.stopPropagation();
          swiped.current = false;
        }
      }}
    >
      <div className="absolute inset-x-3 top-0 z-10 flex justify-center">
        <Segmented label="কার গায়ে দেখবেন" value={body} onChange={setBody} options={bodies} />
      </div>

      <Link href={`/product/${product.slug}`} aria-label={`${product.name} — বিস্তারিত`} className="absolute inset-x-0 bottom-16 top-14 block" draggable={false}>
        <div key={`${product.slug}-${body}-${side}`} className="h-full w-full animate-[turn_.55s_cubic-bezier(0.22,1,0.36,1)]">
          <Mannequin body={body} side={side} garment={garment} />
        </div>
      </Link>

      <div className="absolute inset-x-3 bottom-2 z-10 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
          className="glass-card flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold"
        >
          <TurnIcon size={18} /> {side === "front" ? "পেছনে ঘুরান" : "সামনে ঘুরান"}
        </button>
        {products.length > 1 && (
          <div className="glass-card flex items-center gap-1 rounded-full p-1 text-sm font-bold">
            <button type="button" aria-label="আগের পোশাক" onClick={() => go(active - 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white">
              <ChevronIcon dir="left" size={18} />
            </button>
            <span aria-live="polite" className="min-w-14 text-center tabular-nums">
              {toBn(active + 1)} / {toBn(products.length)}
            </span>
            <button type="button" aria-label="পরের পোশাক" onClick={() => go(active + 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white">
              <ChevronIcon size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * শোরুম: রেলে ঝোলানো পোশাক, সামনেরটা বড় করে দেখায়; পাশে ভাসমান কার্ডে দাম আর সাইজ।
 */
export function Showroom({ products, title, eyebrow, href }: { products: Product[]; title: string; eyebrow: string; href: string }) {
  const [mode, setMode] = useState<"rack" | "tryon">("rack");
  const [active, setActive] = useState(0);
  // only products with a photo can be put on the mannequin; the switch stays hidden until enough have one
  const photographed = products.filter((p) => p.images.length > 0);
  const tryOnReady = photographed.length >= TRY_ON_MIN_PRODUCTS;
  const list = mode === "tryon" && tryOnReady ? photographed : products;
  const product = list[active];
  if (!product) return null;
  const label = (i: number) => list[i].name;

  // keep the same piece in front when switching between the rack and the mannequin
  function switchMode(next: "rack" | "tryon") {
    const nextList = next === "tryon" ? photographed : products;
    setActive(Math.max(0, nextList.findIndex((p) => p.slug === product.slug)));
    setMode(next);
  }

  return (
    <section aria-labelledby="showroom-title" className="studio-wall relative overflow-hidden rounded-[32px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex flex-wrap items-start justify-between gap-3 p-5 sm:p-7">
        <div>
          <p className="font-brand text-xs font-semibold tracking-[0.25em] text-brand-dark">{eyebrow}</p>
          <h2 id="showroom-title" className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">{title}</h2>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {tryOnReady && (
            <Segmented
              label="কীভাবে দেখবেন"
              value={mode}
              onChange={switchMode}
              options={[
                { id: "rack", label: "রেলে দেখুন" },
                { id: "tryon", label: "পরিয়ে দেখুন" },
              ]}
            />
          )}
          <Link href={href} className="glass-card hidden h-11 items-center rounded-full px-4 text-sm font-bold sm:inline-flex">
            সব কালেকশন
          </Link>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-end">
        {mode === "tryon" && tryOnReady ? (
          <TryOnStage
            products={list}
            active={active}
            onChange={setActive}
            className="mt-36 h-[440px] sm:mt-24 sm:h-[540px] lg:mt-28 lg:h-[600px]"
          />
        ) : (
          <HangerStack
            count={list.length}
            active={active}
            onChange={setActive}
            itemLabel={label}
            className={`${tryOnReady ? "mt-36 sm:mt-16" : "mt-20 sm:mt-16"} h-[420px] sm:h-[560px] lg:h-[640px]`}
            renderItem={(i, isActive) => (
              <Link href={`/product/${list[i].slug}`} tabIndex={isActive ? 0 : -1} className="relative block h-full w-full">
                <ProductImage product={list[i]} stage sizes="(max-width: 1024px) 60vw, 480px" />
              </Link>
            )}
          />
        )}

        <div className="relative z-40 px-4 pb-5 sm:px-7 lg:pb-7 lg:pl-0">
          <InfoCard key={product.slug} product={product} />
        </div>
      </div>

      <div className="relative z-40 flex items-center justify-between gap-4 px-5 pb-4 sm:px-7 lg:absolute lg:bottom-3 lg:left-0 lg:pb-3">
        <StageProgress count={list.length} active={active} onChange={setActive} label={label} />
        <Link href={href} className="text-sm font-bold underline sm:hidden">সব কালেকশন</Link>
      </div>
    </section>
  );
}
