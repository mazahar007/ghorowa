"use client";

import Link from "next/link";
import { cart, useCart } from "@/lib/cart-store";
import { formatPrice, toBn } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { TrashIcon } from "./icons";

export function CartView() {
  const { items, subtotal, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[28px] bg-cream px-6 py-16 text-center">
        <p className="font-bangla text-2xl font-bold">কার্ট এখনো খালি</p>
        <p className="text-soft">পছন্দের পণ্য বেছে কার্টে যোগ করুন।</p>
        <Link href="/category/kids-fashion" className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const key = { slug: item.slug, size: item.size, color: item.color };
          return (
            <li key={`${item.slug}-${item.size}-${item.color ?? ""}`} className="flex gap-4 rounded-2xl border border-line bg-white p-3">
              <Link href={`/product/${item.slug}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl">
                <ProductImage product={{ name: item.name, images: item.image ? [item.image] : [] }} sizes="96px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/product/${item.slug}`} className="font-bold hover:text-brand-dark">{item.name}</Link>
                <p className="text-sm text-muted">
                  সাইজ: {item.size}
                  {item.color && <> · রং: {item.color}</>}
                </p>
                <p className="font-bold text-brand-dark">{formatPrice(item.price)}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center rounded-xl border-[1.5px] border-line-strong">
                    <button type="button" aria-label="কমান" onClick={() => cart.setQty(key, item.qty - 1)} className="h-11 w-11 text-xl">−</button>
                    <span className="w-8 text-center font-bold">{toBn(item.qty)}</span>
                    <button type="button" aria-label="বাড়ান" onClick={() => cart.setQty(key, item.qty + 1)} className="h-11 w-11 text-xl">+</button>
                  </div>
                  <button type="button" onClick={() => cart.remove(key)} className="flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-sand hover:text-ink">
                    <TrashIcon size={18} /> সরান
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="flex h-fit flex-col gap-4 rounded-2xl bg-cream p-6">
        <h2 className="font-bangla text-xl font-bold">অর্ডারের হিসাব</h2>
        <div className="flex justify-between">
          <span>পণ্য ({toBn(count)}টি)</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-sm text-soft">ডেলিভারি চার্জ চেকআউটে যোগ হবে।</p>
        <Link href="/checkout" className="flex h-13 items-center justify-center rounded-xl bg-brand font-bold text-white hover:bg-brand-dark">
          অর্ডার করতে এগিয়ে যান
        </Link>
        <Link href="/category/kids-fashion" className="text-center font-semibold underline">আরও কেনাকাটা করুন</Link>
      </aside>
    </div>
  );
}
