import Link from "next/link";
import { categories } from "@/data/catalog";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { MobileMenu } from "./MobileMenu";
import { SearchIcon } from "./icons";

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 bg-ink px-4 py-2 text-center text-sm text-cream">
        <span>সারা বাংলাদেশে হোম ডেলিভারি</span>
        <a href={`tel:${site.phone}`} className="hover:underline">হটলাইন: {site.phone}</a>
        <span className="hidden sm:inline">ক্যাশ অন ডেলিভারি</span>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-3 sm:gap-x-6 px-4 py-3 sm:px-6">
        <MobileMenu />
        <Logo />
        <form action="/search" role="search" className="order-last flex h-12 w-full items-center gap-2 rounded-xl border-[1.5px] border-line-strong bg-white pl-4 pr-1.5 md:order-none md:w-auto md:flex-1">
          <SearchIcon size={18} className="text-muted" />
          <label htmlFor="q" className="sr-only">পণ্য খুঁজুন</label>
          <input
            id="q"
            name="q"
            type="search"
            placeholder="ফ্রক, পাঞ্জাবি, রম্পার খুঁজুন…"
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
          <button type="submit" className="h-9 rounded-lg bg-brand px-4 font-bold text-white hover:bg-brand-dark">
            খুঁজুন
          </button>
        </form>
        <div className="ml-auto md:ml-0">
          <CartButton />
        </div>
      </div>

      <nav aria-label="ক্যাটাগরি" className="mx-auto hidden max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-6 pb-3 font-medium md:flex">
        {categories.map((c) =>
          c.live ? (
            <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-full bg-brand px-3.5 py-1.5 font-bold text-white hover:bg-brand-dark">
              {c.name}
            </Link>
          ) : (
            <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-brand-dark">
              {c.name}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}
