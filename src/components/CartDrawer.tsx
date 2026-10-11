"use client";

import Link from "next/link";
import { cart, cartDrawer, useCart, useCartDrawerOpen } from "@/lib/cart-store";
import { formatPrice, toBn } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { Sheet } from "./Sheet";
import { CloseIcon, TrashIcon } from "./icons";

export function CartDrawer() {
  const open = useCartDrawerOpen();
  const { items, count, subtotal } = useCart();
  if (!open) return null;

  return (
    <Sheet label="শপিং কার্ট" side="right" onClose={cartDrawer.close}>
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 className="font-bangla text-xl font-bold">শপিং কার্ট ({toBn(count)})</h2>
        <button type="button" aria-label="কার্ট বন্ধ করুন" onClick={cartDrawer.close} className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-sand">
          <CloseIcon />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="font-bangla text-lg font-bold">কার্ট এখনো খালি</p>
          <Link href="/category/kids-fashion" onClick={cartDrawer.close} className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-1 flex-col divide-y divide-line">
            {items.map((item) => {
              const key = { slug: item.slug, size: item.size, color: item.color };
              return (
                <li key={`${item.slug}-${item.size}-${item.color ?? ""}`} className="flex gap-3 py-4">
                  <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl">
                    <ProductImage product={{ name: item.name, images: item.image ? [item.image] : [] }} sizes="80px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link href={`/product/${item.slug}`} onClick={cartDrawer.close} className="line-clamp-2 font-semibold leading-snug hover:text-brand-dark">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted">
                      সাইজ {item.size}
                      {item.color && <> · {item.color}</>}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-lg border border-line-strong">
                        <button type="button" aria-label="কমান" onClick={() => cart.setQty(key, item.qty - 1)} className="h-11 w-10 text-lg">−</button>
                        <span className="w-6 text-center font-bold">{toBn(item.qty)}</span>
                        <button type="button" aria-label="বাড়ান" onClick={() => cart.setQty(key, item.qty + 1)} className="h-11 w-10 text-lg">+</button>
                      </div>
                      <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                      <button type="button" aria-label="সরান" onClick={() => cart.remove(key)} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-sand hover:text-ink">
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="sticky bottom-0 -mx-5 -mb-5 mt-2 flex flex-col gap-3 border-t border-line bg-paper p-5">
            <div className="flex justify-between text-lg font-bold">
              <span>সাবটোটাল</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={cartDrawer.close} className="flex h-13 items-center justify-center rounded-xl bg-brand font-bold text-white hover:bg-brand-dark">
              অর্ডার করুন
            </Link>
            <Link href="/cart" onClick={cartDrawer.close} className="text-center text-sm font-semibold underline">
              পুরো কার্ট দেখুন
            </Link>
          </div>
        </>
      )}
    </Sheet>
  );
}
