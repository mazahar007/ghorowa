import Link from "next/link";
import { getActiveProducts, getCategories } from "@/lib/catalog";
import { ageGroups } from "@/lib/labels";
import { flashSaleEndsAt, heroSlides } from "@/config/home";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Countdown } from "@/components/Countdown";
import { ProductRail } from "@/components/ProductCard";
import { SectionHeader } from "@/components/Section";
import { BoltIcon, CardIcon, ReturnIcon, ShirtIcon, TruckIcon } from "@/components/icons";

const trust = [
  { icon: TruckIcon, title: "সারা দেশে ডেলিভারি", text: "ঢাকায় ১–২ দিন, বাইরে ২–৪ দিন" },
  { icon: CardIcon, title: "ক্যাশ অন ডেলিভারি", text: "পণ্য হাতে পেয়ে টাকা দিন" },
  { icon: ReturnIcon, title: "সহজ এক্সচেঞ্জ", text: "সাইজ না মিললে বদলে নিন" },
  { icon: ShirtIcon, title: "আরামদায়ক কাপড়", text: "বাচ্চার ত্বকের কথা ভেবে বাছাই" },
];

const ageFills = ["bg-cream", "bg-[#F6E2CF]", "bg-[#F1D6C2]", "bg-[#ECCBB6]"];

export default async function Home() {
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);
  const flash = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price && p.inStock);
  const latest = products.slice(0, 10);
  const featured = products.filter((p) => p.featured).slice(0, 10);
  const byGender = (g: string) => products.filter((p) => p.gender === g || (p.gender === "unisex" && g !== "baby")).slice(0, 10);
  const genderSections = [
    { title: "মেয়েদের পোশাক", eyebrow: "FOR GIRLS", gender: "girls" },
    { title: "ছেলেদের পোশাক", eyebrow: "FOR BOYS", gender: "boys" },
    { title: "বেবি আইটেম", eyebrow: "FOR BABIES", gender: "baby" },
  ].map((s) => ({ ...s, items: byGender(s.gender) }));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pt-5 sm:gap-16 sm:px-6">
      <HeroSlider slides={heroSlides} />

      <section aria-labelledby="cat-title">
        <h2 id="cat-title" className="sr-only">ক্যাটাগরি</h2>
        <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
          {categories.map((c) => (
            <li key={c.slug} className="w-[92px] shrink-0 sm:w-auto">
              <Link href={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 text-center">
                <span className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 transition group-hover:-translate-y-0.5 sm:h-24 sm:w-24 ${c.live ? "border-brand bg-cream text-brand-dark" : "border-transparent bg-sand text-soft"}`}>
                  <CategoryIcon slug={c.slug} />
                  {!c.live && (
                    <span className="absolute -bottom-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-muted shadow-sm">শীঘ্রই</span>
                  )}
                </span>
                <span className="text-[13px] font-semibold leading-tight sm:text-sm">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {flash.length > 0 && (
        <section aria-labelledby="flash-title" className="rounded-[28px] bg-brand p-4 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-white">
            <h2 id="flash-title" className="flex items-center gap-2 font-bangla text-2xl font-bold sm:text-3xl">
              <BoltIcon size={28} /> ফ্ল্যাশ সেল
            </h2>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-semibold sm:inline">শেষ হবে</span>
              <Countdown endsAt={flashSaleEndsAt} />
            </div>
          </div>
          <ProductRail products={flash} />
        </section>
      )}

      <section aria-label="নতুন এসেছে">
        <SectionHeader title="নতুন এসেছে" eyebrow="NEW ARRIVALS" href="/category/kids-fashion?sort=new" />
        <ProductRail products={latest} />
      </section>

      <section aria-label="বয়স অনুযায়ী কিনুন">
        <SectionHeader title="বয়স অনুযায়ী কিনুন" eyebrow="SHOP BY AGE" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ageGroups.map((a, i) => (
            <Link key={a.id} href={`/category/kids-fashion?age=${a.id}`} className={`flex flex-col gap-1.5 rounded-2xl px-5 py-6 transition hover:ring-2 hover:ring-brand sm:px-6 sm:py-8 ${ageFills[i]}`}>
              <span className="font-bangla text-2xl font-bold sm:text-3xl">{a.range}</span>
              <span className="font-medium text-soft">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-label="বেস্ট সেলার">
          <SectionHeader title="বেস্ট সেলার" eyebrow="BEST SELLERS" href="/category/kids-fashion" />
          <ProductRail products={featured} />
        </section>
      )}

      {genderSections.map(
        (s) =>
          s.items.length > 0 && (
            <section key={s.gender} aria-label={s.title}>
              <SectionHeader title={s.title} eyebrow={s.eyebrow} href={`/category/kids-fashion?gender=${s.gender}`} />
              <ProductRail products={s.items} />
            </section>
          ),
      )}

      <section aria-label="কেন ঘরোয়া" className="grid grid-cols-2 gap-3 rounded-[28px] bg-cream p-4 sm:p-6 lg:grid-cols-4">
        {trust.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col gap-2 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-brand-dark">
              <Icon size={22} />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="block text-sm text-muted">{text}</span>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
