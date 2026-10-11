"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { cart, cartDrawer } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { CloseIcon, PlusIcon } from "./icons";
import { Sheet } from "./Sheet";

export function QuickAdd({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);

  function add(size: string) {
    cart.add({
      slug: product.slug,
      size,
      color,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    setOpen(false);
    cartDrawer.open();
  }

  if (!product.inStock) {
    return (
      <button type="button" disabled className="h-10 w-full rounded-xl bg-sand text-sm font-bold text-muted">
        স্টক শেষ
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (product.sizes.length === 1 && product.colors.length <= 1 ? add(product.sizes[0]) : setOpen(true))}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark"
      >
        <PlusIcon size={16} /> কুইক অ্যাড
      </button>
      {open && (
        <Sheet label={`${product.name} — সাইজ বেছে নিন`} onClose={() => setOpen(false)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bangla text-lg font-bold leading-snug">{product.name}</p>
              <p className="font-bold text-brand-dark">{formatPrice(product.price)}</p>
            </div>
            <button type="button" aria-label="বন্ধ করুন" onClick={() => setOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-sand">
              <CloseIcon />
            </button>
          </div>
          {product.colors.length > 1 && (
            <fieldset className="mt-4">
              <legend className="mb-2 font-bold">রং</legend>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={color === c}
                    onClick={() => setColor(c)}
                    className={`h-11 rounded-xl border-[1.5px] px-4 font-semibold ${color === c ? "border-ink bg-ink text-cream" : "border-line-strong bg-white"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <fieldset className="mt-4">
            <legend className="mb-2 font-bold">সাইজ বেছে নিন — বেছে নিলেই কার্টে যোগ হবে</legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => add(s)}
                  className="h-12 rounded-xl border-[1.5px] border-line-strong bg-white font-bold hover:border-brand hover:bg-cream"
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        </Sheet>
      )}
    </>
  );
}
