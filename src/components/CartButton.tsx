"use client";

import Link from "next/link";
import { useCartDetails } from "@/lib/cart-store";
import { toBn } from "@/lib/format";
import { BagIcon } from "./icons";

export function CartButton() {
  const { count } = useCartDetails();
  return (
    <Link
      href="/cart"
      aria-label={`কার্ট, ${toBn(count)}টি পণ্য`}
      className="flex h-12 items-center gap-2 rounded-xl bg-ink px-3.5 font-bold text-cream hover:bg-black sm:gap-2.5 sm:px-4"
    >
      <BagIcon />
      <span>
        <span className="hidden sm:inline">কার্ট · </span>
        {toBn(count)}
      </span>
    </Link>
  );
}
