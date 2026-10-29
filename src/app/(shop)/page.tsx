import Link from "next/link";
import { getActiveProducts, getCategories } from "@/lib/catalog";
import { ageGroups } from "@/lib/labels";
import { flashSaleEndsAt, heroSlides } from "@/config/home";
import { Hero } from "@/components/Hero";
import { ScrollStory, type StoryStep } from "@/components/ScrollStory";
import { Showroom } from "@/components/Showroom";
import { Reveal } from "@/components/Reveal";
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

const ageFills = ["bg-cream", "bg-brand-soft", "bg-sage", "bg-[#efe6f1]"];

const storySteps: StoryStep[] = [
  { eyebrow: "কাপড়", title: "নরম, নিঃশ্বাস নেওয়া কাপড়", text: "বাচ্চার ত্বকে আরাম দেয়, গরমেও স্বস্তি।" },
  { eyebrow: "মাপ", title: "বয়স অনুযায়ী ঠিক মাপ", text: "সাইজ গাইড দেখে নিশ্চিন্তে বেছে নিন, না মিললে এক্সচেঞ্জ।" },
  { eyebrow: "ডেলিভারি", title: "দরজায় পৌঁছে যায়", text: "সারা দেশে হোম ডেলিভারি, পণ্য হাতে পেয়ে টাকা দিন।" },
];

export default async function Home() {
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);
  const flash = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price && p.inStock);
  const latest = products.slice(0, 10);
  const featured = products.filter((p) => p.featured).slice(0, 10);
  const spotlight = featured[0] ?? products[0];
  const story = featured[1] ?? products[1] ?? spotlight;
  const byGender = (g: string) => products.filter((p) => p.gender === g || (p.gender === "unisex" && g !== "baby")).slice(0, 10);
  const genderSections = [
    { title: "মেয়েদের পোশাক", eyebrow: "FOR GIRLS", gender: "girls" },
    { title: "ছেলেদের পোশাক", eyebrow: "FOR BOYS", gender: "boys" },
    { title: "বেবি আইটেম", eyebrow: "FOR BABIES", gender: "baby" },
  ].map((s) => ({ ...s, items: byGender(s.gender) }));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pt-5 sm:gap-16 sm:px-6">
      <Hero slide={heroSlides[0]} product={spotlight} />

      {heroSlides.length > 1 && (
        <section aria-label="অফার" className="grid gap-4 md:grid-cols-2">
          {heroSlides.slice(1, 3).map((s, i) => (
            <Reveal key={s.href} delay={i * 120}>
              <Link
                href={s.href}
                className={`group flex h-full flex-col justify-between gap-6 rounded-[28px] p-7 transition hover:-translate-y-0.5 sm:p-9 ${
                  s.theme === "ink" ? "bg-cocoa text-[#f3e9dd]" : "bg-brand-soft text-ink"
                }`}
              >
                <span>
                  <span className={`text-sm font-semibold ${s.theme === "ink" ? "text-[#e8a27f]" : "text-brand-dark"}`}>{s.eyebrow}</span>
                  <span className="mt-2 block font-bangla text-2xl font-bold leading-snug sm:text-3xl">
                    {s.title} <span className={s.theme === "ink" ? "text-[#e8a27f]" : "text-brand-dark"}>{s.highlight}</span>
                  </span>
                  <span className={`mt-2 block ${s.theme === "ink" ? "text-[#c9b8a6]" : "text-soft"}`}>{s.subtitle}</span>
                </span>
                <span className="inline-flex items-center gap-2 font-bold">
                  {s.cta} <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </section>
      )}

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
        <section aria-labelledby="flash-title" className="rounded-[28px] bg-brand-soft p-4 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-brand-dark">
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

      <Showroom products={latest.slice(0, 6)} eyebrow="GHOROWA SHOWROOM" title="শোরুম ঘুরে দেখুন" href="/category/kids-fashion?sort=new" />

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

      {story && <ScrollStory product={story} steps={storySteps} />}

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
