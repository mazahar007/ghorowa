"use client";

import { useEffect, useRef, useState } from "react";
import { cartDrawer, useCart } from "@/lib/cart-store";
import { toBn } from "@/lib/format";
import { BagIcon } from "./icons";

export function CartButton() {
  const { count } = useCart();
  const prev = useRef(count);
  const [bump, setBump] = useState(false);
  // a short pop on the badge when something is added, so the buyer sees it worked
  useEffect(() => {
    if (count > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prev.current = count;
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count]);
  return (
    <button
      type="button"
      onClick={cartDrawer.open}
      aria-label={`কার্ট খুলুন, ${toBn(count)}টি পণ্য`}
      className="relative flex h-12 items-center gap-2 rounded-xl bg-ink px-3.5 font-bold text-cream hover:bg-black sm:px-4"
    >
      <BagIcon />
      <span className="hidden sm:inline">কার্ট</span>
      <span className={`flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-sm text-white transition-transform duration-300 ${bump ? "scale-125" : ""}`}>
        {toBn(count)}
      </span>
    </button>
  );
}
