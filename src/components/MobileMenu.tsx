"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { Sheet } from "./Sheet";
import { CloseIcon, MenuIcon } from "./icons";

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="মেনু খুলুন"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-line-strong bg-white"
      >
        <MenuIcon />
      </button>
      {open && (
        <Sheet label="মেনু" side="left" onClose={close}>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-bangla text-xl font-bold">ক্যাটাগরি</span>
            <button type="button" aria-label="মেনু বন্ধ করুন" onClick={close} className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-sand">
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="ক্যাটাগরি" className="flex flex-col gap-1">
            <Link href="/offers" onClick={close} className="flex min-h-12 items-center rounded-xl px-3 font-bold text-brand-dark hover:bg-sand">অফার</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} onClick={close} className="flex min-h-12 items-center justify-between rounded-xl px-3 font-medium hover:bg-sand">
                {c.name}
                {c.live ? (
                  <span className="rounded-full bg-brand-dark px-2 py-0.5 text-xs font-bold text-white">এখন পাওয়া যাচ্ছে</span>
                ) : (
                  <span className="text-xs text-muted">শীঘ্রই</span>
                )}
              </Link>
            ))}
            <hr className="my-3 border-line" />
            <Link href="/account" onClick={close} className="flex min-h-12 items-center rounded-xl px-3 hover:bg-sand">আমার অ্যাকাউন্ট ও অর্ডার</Link>
            <Link href="/size-guide" onClick={close} className="flex min-h-12 items-center rounded-xl px-3 hover:bg-sand">সাইজ গাইড</Link>
            <Link href="/help" onClick={close} className="flex min-h-12 items-center rounded-xl px-3 hover:bg-sand">সাহায্য ও যোগাযোগ</Link>
          </nav>
        </Sheet>
      )}
    </div>
  );
}
