"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type NavCategory = { slug: string; name: string; live: boolean };

/** Shows a small spinner-dot inside the link while its page is loading, so a tap feels answered. */
function Pending() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={`h-1.5 w-1.5 rounded-full bg-current transition-opacity ${pending ? "animate-pulse opacity-100" : "opacity-0"}`} />;
}

function Items({ categories, current }: { categories: NavCategory[]; current: string | null }) {
  const items = [{ href: "/offers", name: "অফার", live: true }, ...categories.map((c) => ({ href: `/category/${c.slug}`, name: c.name, live: c.live }))];
  return (
    <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] sm:px-5">
      {items.map((item) => {
        const active = current !== null && (current === item.href || current.startsWith(`${item.href}/`));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm transition ${
                active
                  ? "bg-brand font-bold text-white"
                  : item.live
                    ? "font-bold text-brand-dark hover:bg-cream"
                    : "font-semibold text-soft hover:bg-sand hover:text-ink"
              }`}
            >
              {item.name}
              <Pending />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveItems({ categories }: { categories: NavCategory[] }) {
  return <Items categories={categories} current={usePathname()} />;
}

/** ক্যাটাগরি মেনু — যে পেজে আছেন সেটা রঙিন হয়ে থাকে। */
export function CategoryNav({ categories }: { categories: NavCategory[] }) {
  return (
    <nav aria-label="ক্যাটাগরি" className="border-t border-line">
      <Suspense fallback={<Items categories={categories} current={null} />}>
        <ActiveItems categories={categories} />
      </Suspense>
    </nav>
  );
}
