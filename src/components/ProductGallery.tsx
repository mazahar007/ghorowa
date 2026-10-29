"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { toBn } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { HangerStack, StageProgress } from "./HangerStack";

/** প্রোডাক্ট পেজের শোরুম স্টেজ: প্রতিটা ছবি রেলে ঝোলানো, সামনেরটা বড় করে দেখায়। */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const count = Math.max(product.images.length, 1);
  const label = (i: number) => `ছবি ${toBn(i + 1)}`;

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-40 lg:self-start">
      <div className="studio-wall relative overflow-hidden rounded-[28px]">
        <HangerStack
          count={count}
          active={active}
          onChange={setActive}
          itemLabel={label}
          className="h-[460px] sm:h-[580px]"
          renderItem={(i) => (
            <div className="relative h-full w-full">
              <ProductImage product={product} index={i} stage sizes="(max-width: 1024px) 70vw, 420px" priority={i === 0} />
            </div>
          )}
        />
        <div className="absolute bottom-2 left-4 z-40">
          <StageProgress count={count} active={active} onChange={setActive} label={label} />
        </div>
      </div>

      {product.images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={label(i)}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={`studio-wall relative aspect-square overflow-hidden rounded-xl border-2 transition ${active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <ProductImage product={product} index={i} stage sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
