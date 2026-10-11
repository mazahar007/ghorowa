import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-[#E9DCC6]">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-12 px-6 py-14">
        <div className="flex min-w-64 flex-[2] flex-col gap-4">
          <Logo tone="light" />
          <p className="max-w-sm leading-relaxed">{site.tagline}</p>
          <p className="leading-relaxed">
            {site.address}
            <br />
            <a href={`tel:${site.phone}`} className="hover:underline">{site.phone}</a> ·{" "}
            <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
          </p>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-2.5">
          <h2 className="font-bold text-white">শপ</h2>
          <Link href="/category/kids-fashion" className="hover:underline">কিডস ফ্যাশন</Link>
          <Link href="/search?q=" className="hover:underline">সব পণ্য</Link>
          <a href={site.facebook} className="hover:underline" target="_blank" rel="noreferrer">ফেসবুক পেজ</a>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-2.5">
          <h2 className="font-bold text-white">সহায়তা</h2>
          <Link href="/size-guide" className="hover:underline">সাইজ গাইড</Link>
          <Link href="/help#delivery" className="hover:underline">ডেলিভারি</Link>
          <Link href="/help#returns" className="hover:underline">এক্সচেঞ্জ ও রিটার্ন</Link>
          <Link href="/help#contact" className="hover:underline">যোগাযোগ</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-sm">
        © {site.nameBn} · {site.name}
      </div>
    </footer>
  );
}
