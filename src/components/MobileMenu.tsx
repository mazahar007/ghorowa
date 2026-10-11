"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/data/catalog";
import { CloseIcon, MenuIcon } from "./icons";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
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
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <nav aria-label="ক্যাটাগরি" className="relative flex h-full w-80 max-w-[85%] flex-col gap-1 overflow-y-auto bg-paper p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bangla text-xl font-bold">ক্যাটাগরি</span>
              <button
                type="button"
                aria-label="মেনু বন্ধ করুন"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-sand"
              >
                <CloseIcon />
              </button>
            </div>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between rounded-xl px-3 font-medium hover:bg-sand"
              >
                {c.name}
                {c.live ? (
                  <span className="rounded-full bg-brand-dark px-2 py-0.5 text-xs font-bold text-white">এখন পাওয়া যাচ্ছে</span>
                ) : (
                  <span className="text-xs text-muted">শীঘ্রই</span>
                )}
              </Link>
            ))}
            <hr className="my-3 border-line" />
            <Link href="/help" onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-3 hover:bg-sand">সাহায্য ও যোগাযোগ</Link>
            <Link href="/size-guide" onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-3 hover:bg-sand">সাইজ গাইড</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
