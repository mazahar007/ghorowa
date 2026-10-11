import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/catalog";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { MobileMenu } from "./MobileMenu";
import { AccountLink } from "./AccountLink";
import { PhoneIcon, SearchIcon, UserIcon } from "./icons";

function SearchBox({ className = "" }: { className?: string }) {
  return (
    <form action="/search" role="search" className={`flex h-12 items-center gap-2 rounded-full border-[1.5px] border-line-strong bg-white pl-4 pr-1.5 focus-within:border-brand ${className}`}>
      <SearchIcon size={18} className="shrink-0 text-muted" />
      <input
        name="q"
        type="search"
        aria-label="পণ্য খুঁজুন"
        placeholder="ফ্রক, পাঞ্জাবি, রম্পার খুঁজুন…"
        className="min-w-0 flex-1 bg-transparent outline-none"
      />
      <button type="submit" className="h-9 rounded-full bg-brand px-5 font-bold text-white hover:bg-brand-dark">
        খুঁজুন
      </button>
    </form>
  );
}

export async function Header() {
  const categories = await getCategories();
  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[13px] text-cream sm:text-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-between">
          <span>সারা বাংলাদেশে হোম ডেলিভারি · ক্যাশ অন ডেলিভারি</span>
          <span className="hidden gap-5 sm:flex">
            <Link href="/track" className="hover:underline">অর্ডার ট্র্যাক করুন</Link>
            <a href={`tel:${site.phone}`} className="hover:underline">হটলাইন: {site.phone}</a>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
          <MobileMenu categories={categories} />
          <Logo />
          <SearchBox className="hidden flex-1 md:flex" />
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a href={`tel:${site.phone}`} className="hidden items-center gap-2 rounded-xl px-3 py-2 hover:bg-sand lg:flex">
              <PhoneIcon size={22} className="text-brand-dark" />
              <span className="flex flex-col text-left leading-tight">
                <span className="text-xs text-muted">অর্ডার করতে কল করুন</span>
                <span className="font-bold">{site.phone}</span>
              </span>
            </a>
            <Suspense
              fallback={
                <Link href="/account" aria-label="আমার অ্যাকাউন্ট" className="hidden h-12 w-12 items-center justify-center rounded-xl hover:bg-sand md:flex">
                  <UserIcon />
                </Link>
              }
            >
              <AccountLink />
            </Suspense>
            <CartButton />
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>
        <nav aria-label="ক্যাটাগরি" className="border-t border-line">
          <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] sm:px-5">
            <li>
              <Link href="/offers" className="flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-bold text-brand-dark hover:bg-cream">
                অফার
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold ${
                    c.live ? "bg-brand text-white hover:bg-brand-dark" : "text-soft hover:bg-sand hover:text-ink"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
