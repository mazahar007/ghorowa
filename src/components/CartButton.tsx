"use client";

import { cartDrawer, useCart } from "@/lib/cart-store";
import { toBn } from "@/lib/format";
import { BagIcon } from "./icons";

export function CartButton() {
  const { count } = useCart();
  return (
    <button
      type="button"
      onClick={cartDrawer.open}
      aria-label={`কার্ট খুলুন, ${toBn(count)}টি পণ্য`}
      className="relative flex h-12 items-center gap-2 rounded-xl bg-ink px-3.5 font-bold text-cream hover:bg-black sm:px-4"
    >
      <BagIcon />
      <span className="hidden sm:inline">কার্ট</span>
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-sm text-white">
        {toBn(count)}
      </span>
    </button>
  );
}
