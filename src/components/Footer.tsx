import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";

const payments = ["ক্যাশ অন ডেলিভারি", "bKash", "Nagad"];

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-[#E9DCC6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <Logo tone="light" />
          <p className="max-w-sm leading-relaxed">{site.tagline}</p>
          <p className="leading-relaxed">{site.address}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="mb-1 font-bold text-white">শপ</h2>
          <Link href="/category/kids-fashion" className="hover:underline">কিডস ফ্যাশন</Link>
          <Link href="/offers" className="hover:underline">অফার</Link>
          <Link href="/categories" className="hover:underline">সব ক্যাটাগরি</Link>
          <Link href="/search" className="hover:underline">সব পণ্য</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="mb-1 font-bold text-white">সহায়তা</h2>
          <Link href="/track" className="hover:underline">অর্ডার ট্র্যাক</Link>
          <Link href="/size-guide" className="hover:underline">সাইজ গাইড</Link>
          <Link href="/help#delivery" className="hover:underline">ডেলিভারি</Link>
          <Link href="/help#returns" className="hover:underline">এক্সচেঞ্জ ও রিটার্ন</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="mb-1 font-bold text-white">যোগাযোগ</h2>
          <a href={`tel:${site.phone}`} className="text-lg font-bold text-white hover:underline">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
          <a href={site.facebook} target="_blank" rel="noreferrer" className="hover:underline">ফেসবুক পেজ</a>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="পেমেন্ট মাধ্যম">
            {payments.map((p) => (
              <li key={p} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-sm">
        © {site.nameBn} · {site.name}
      </div>
    </footer>
  );
}
