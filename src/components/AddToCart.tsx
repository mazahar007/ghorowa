"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/catalog";
import { cart } from "@/lib/cart-store";
import { toBn } from "@/lib/format";
import { CheckIcon } from "./icons";

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-11 min-w-14 rounded-xl border-[1.5px] px-4 font-semibold ${
        selected ? "border-ink bg-ink text-cream" : "border-line-strong bg-white hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  function add(goToCheckout: boolean) {
    if (!size) {
      setError(true);
      return;
    }
    cart.add({ slug: product.slug, size, color }, qty);
    if (goToCheckout) {
      router.push("/checkout");
    } else {
      setAdded(true);
    }
  }

  if (!product.inStock) {
    return <p className="rounded-xl bg-sand px-5 py-4 font-semibold">দুঃখিত, এই পণ্যটি এখন স্টকে নেই।</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 flex w-full items-center justify-between font-bold">
          সাইজ বেছে নিন
          <Link href="/size-guide" className="text-sm font-semibold text-brand-dark underline">সাইজ গাইড</Link>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <Choice key={s} selected={size === s} onClick={() => { setSize(s); setError(false); setAdded(false); }}>
              {s}
            </Choice>
          ))}
        </div>
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-brand-dark">অনুগ্রহ করে একটা সাইজ বেছে নিন।</p>}
      </fieldset>

      {product.colors && product.colors.length > 0 && (
        <fieldset>
          <legend className="mb-2 font-bold">রং</legend>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <Choice key={c} selected={color === c} onClick={() => { setColor(c); setAdded(false); }}>
                {c}
              </Choice>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-3">
        <span className="font-bold">পরিমাণ</span>
        <div className="flex items-center rounded-xl border-[1.5px] border-line-strong bg-white">
          <button type="button" aria-label="কমান" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 text-xl">−</button>
          <span aria-live="polite" className="w-8 text-center font-bold">{toBn(qty)}</span>
          <button type="button" aria-label="বাড়ান" onClick={() => setQty((q) => Math.min(20, q + 1))} className="h-11 w-11 text-xl">+</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => add(false)} className="h-13 flex-1 rounded-xl border-[1.5px] border-ink bg-white px-6 font-bold hover:bg-cream">
          কার্টে যোগ করুন
        </button>
        <button type="button" onClick={() => add(true)} className="h-13 flex-1 rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
          এখনই কিনুন
        </button>
      </div>

      {added && (
        <p role="status" className="flex flex-wrap items-center gap-2 rounded-xl bg-cream px-4 py-3 font-semibold">
          <CheckIcon size={18} className="text-brand-dark" /> কার্টে যোগ হয়েছে।
          <Link href="/cart" className="underline">কার্ট দেখুন</Link>
        </p>
      )}
    </div>
  );
}
