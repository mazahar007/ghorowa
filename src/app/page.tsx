import Link from "next/link";
import { ageGroups, categories, getFeaturedProducts } from "@/data/catalog";
import { ProductFilter } from "@/components/ProductFilter";
import { CardIcon, ReturnIcon, ShirtIcon, TruckIcon } from "@/components/icons";

const trust = [
  { icon: ShirtIcon, text: "নরম, আরামদায়ক কাপড়" },
  { icon: TruckIcon, text: "সারা দেশে ডেলিভারি" },
  { icon: CardIcon, text: "ক্যাশ অন ডেলিভারি · bKash" },
  { icon: ReturnIcon, text: "সাইজ না মিললে এক্সচেঞ্জ" },
];

const ageFills = ["bg-cream", "bg-[#F6E2CF]", "bg-[#F1D6C2]", "bg-[#ECCBB6]"];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap overflow-hidden rounded-[28px] bg-cream">
          <div className="flex flex-[1_1_420px] flex-col justify-center gap-5 px-6 py-12 sm:px-14 sm:py-16">
            <span className="self-start rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-dark">
              নতুন কিডস কালেকশন
            </span>
            <h1 className="font-bangla text-4xl font-bold leading-tight sm:text-6xl">
              ছোট্ট সোনামণির
              <br />
              <span className="text-brand">আরামের পোশাক</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-soft">
              নরম কাপড়, সুন্দর ডিজাইন — নবজাতক থেকে ১২ বছর পর্যন্ত মেয়ে ও ছেলেদের ড্রেস।
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/category/kids-fashion" className="inline-flex h-13 items-center rounded-xl bg-brand px-7 font-bold text-white hover:bg-brand-dark">
                কিডস ড্রেস দেখুন
              </Link>
              <Link href="#categories" className="inline-flex h-13 items-center rounded-xl border-[1.5px] border-ink px-7 font-bold hover:bg-white">
                সব ক্যাটাগরি
              </Link>
            </div>
          </div>
          {/* কভার ছবি: public/hero.jpg রেখে নিচের div-এর ভেতরে <Image> বসান */}
          <div className="relative flex min-h-80 flex-[1_1_420px] items-center justify-center bg-brand p-8 sm:min-h-[460px]">
            <div className="flex aspect-square w-full max-w-80 flex-col items-center justify-center gap-3 rounded-full bg-cream text-muted">
              <ShirtIcon size={72} strokeWidth={1.25} />
              <span className="px-8 text-center text-sm">কভার ছবি এখানে বসবে</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 font-semibold">
              <Icon size={26} className="shrink-0 text-brand-dark" />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <h2 className="font-bangla text-3xl font-bold">বয়স অনুযায়ী কিনুন</h2>
        <p className="mb-6 mt-1 text-muted">আপনার বাচ্চার বয়স বেছে নিন</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ageGroups.map((a, i) => (
            <Link
              key={a.id}
              href={`/category/kids-fashion?age=${a.id}`}
              className={`flex flex-col gap-1.5 rounded-2xl px-5 py-6 hover:ring-2 hover:ring-brand sm:px-6 sm:py-7 ${ageFills[i]}`}
            >
              <span className="font-bangla text-2xl font-bold sm:text-3xl">{a.range}</span>
              <span className="font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <p className="font-brand text-sm font-semibold tracking-[0.14em] text-brand-dark">KIDS COLLECTION</p>
        <h2 className="mb-6 font-bangla text-3xl font-bold">কিডস ড্রেস</h2>
        <ProductFilter products={getFeaturedProducts()} />
        <div className="mt-8 flex justify-center">
          <Link href="/category/kids-fashion" className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-ink px-7 font-bold hover:bg-white">
            সব কিডস ড্রেস দেখুন
          </Link>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl scroll-mt-6 px-4 pt-20 sm:px-6">
        <h2 className="font-bangla text-3xl font-bold">সব ক্যাটাগরি</h2>
        <p className="mb-6 mt-1 text-muted">পুরো পরিবারের সবকিছু, এক জায়গায় — নতুন ক্যাটাগরি শীঘ্রই আসছে।</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`flex flex-col items-center gap-2.5 rounded-2xl border-2 px-3 py-5 text-center ${
                c.live ? "border-brand bg-cream" : "border-transparent bg-sand hover:border-line-strong"
              }`}
            >
              <span className="font-bold">{c.name}</span>
              {c.live ? (
                <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-xs font-bold text-white">এখন পাওয়া যাচ্ছে</span>
              ) : (
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-muted">শীঘ্রই আসছে</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-center gap-6 rounded-[28px] bg-ink px-6 py-10 text-cream sm:px-14">
          <div className="flex flex-[1_1_380px] flex-col gap-2">
            <h2 className="font-bangla text-3xl font-bold text-white">ঈদ ও উৎসবের কিডস কালেকশন</h2>
            <p className="text-lg">পাঞ্জাবি, পার্টি ড্রেস আর নতুন জামা — সোনামণির উৎসব হোক রঙিন।</p>
          </div>
          <Link href="/category/kids-fashion" className="inline-flex h-13 items-center rounded-xl bg-cream px-7 font-bold text-ink hover:bg-white">
            কালেকশন দেখুন
          </Link>
        </div>
      </section>
    </>
  );
}
