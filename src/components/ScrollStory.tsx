"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";

export type StoryStep = { eyebrow: string; title: string; text: string };

/**
 * A featured product stays pinned while the reader scrolls past a few short
 * points about it; the product drifts, turns and grows a little with the scroll.
 */
export function ScrollStory({ product, steps }: { product: Product; steps: StoryStep[] }) {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [steps.length]);

  const translate = (progress - 0.5) * 60;
  const rotate = (progress - 0.5) * -8;
  const scale = 0.94 + Math.sin(progress * Math.PI) * 0.08;

  return (
    <section ref={section} aria-label={`${product.name} — বিস্তারিত`} className="relative lg:h-[200vh]">
      <div className="grid gap-8 rounded-[32px] bg-sage/60 px-5 py-10 sm:px-10 lg:sticky lg:top-28 lg:grid-cols-2 lg:items-center lg:py-14">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-6 rounded-full bg-white/70 blur-2xl" aria-hidden="true" />
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-cream shadow-[0_40px_80px_-40px_rgba(43,32,27,0.45)] will-change-transform"
            style={{ transform: `translateY(${translate}px) rotate(${rotate}deg) scale(${scale})` }}
          >
            <ProductImage product={product} sizes="(max-width: 1024px) 90vw, 480px" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-brand text-sm font-semibold tracking-[0.16em] text-brand-dark">FEATURED · {product.categoryName}</p>
          <h2 className="font-bangla text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h2>
          <ol className="flex flex-col gap-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                aria-current={i === active ? "step" : undefined}
                className={`rounded-2xl border p-5 transition duration-500 ${
                  i === active ? "border-line-strong bg-white shadow-sm" : "border-transparent bg-white/40 lg:opacity-55"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-dark">{s.eyebrow}</p>
                <p className="mt-1 text-lg font-bold">{s.title}</p>
                <p className="mt-1 text-soft">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/product/${product.slug}`} className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-bold text-white hover:bg-black">
              দেখুন ও কিনুন
            </Link>
            <span className="text-xl font-bold text-brand-dark">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
