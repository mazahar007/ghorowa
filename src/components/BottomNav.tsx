"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { cartDrawer, useCart } from "@/lib/cart-store";
import { toBn } from "@/lib/format";
import { BagIcon, GridIcon, HomeIcon, UserIcon } from "./icons";

function WithPathname() {
  return <BottomNavView pathname={usePathname()} />;
}

/** মোবাইলের নিচে স্থায়ী নেভিগেশন বার। */
export function BottomNav() {
  // usePathname needs request data on pages whose path isn't known at build time
  return (
    <Suspense fallback={<BottomNavView pathname={null} />}>
      <WithPathname />
    </Suspense>
  );
}

function BottomNavView({ pathname }: { pathname: string | null }) {
  const { count } = useCart();
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold";
  const active = (href: string) => (pathname === href ? "text-brand-dark" : "text-soft");

  return (
    <nav aria-label="দ্রুত নেভিগেশন" className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <Link href="/" className={`${item} ${active("/")}`}>
        <HomeIcon size={22} /> হোম
      </Link>
      <Link href="/categories" className={`${item} ${active("/categories")}`}>
        <GridIcon size={22} /> ক্যাটাগরি
      </Link>
      <button type="button" onClick={cartDrawer.open} className={`${item} text-soft`}>
        <span className="relative">
          <BagIcon size={22} />
          {count > 0 && (
            <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">
              {toBn(count)}
            </span>
          )}
        </span>
        কার্ট
      </button>
      <Link href="/account" className={`${item} ${active("/account")}`}>
        <UserIcon size={22} /> অ্যাকাউন্ট
      </Link>
    </nav>
  );
}
