"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-40 lg:self-start">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream">
        <ProductImage product={product} index={active} sizes="(max-width: 1024px) 100vw, 600px" priority />
      </div>
      {product.images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`ছবি ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 ${active === i ? "border-brand" : "border-transparent"}`}
            >
              <ProductImage product={product} index={i} sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
