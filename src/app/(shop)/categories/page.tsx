import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { CategoryIcon } from "@/components/CategoryIcon";

export const metadata: Metadata = { title: "সব ক্যাটাগরি" };

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-bangla text-3xl font-bold">সব ক্যাটাগরি</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`flex flex-col items-center gap-3 rounded-2xl border-2 px-4 py-6 text-center transition hover:-translate-y-0.5 ${
              c.live ? "border-brand bg-cream" : "border-transparent bg-sand hover:border-line-strong"
            }`}
          >
            <span className={c.live ? "text-brand-dark" : "text-soft"}><CategoryIcon slug={c.slug} size={40} /></span>
            <span className="font-bold">{c.name}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.live ? "bg-brand-dark text-white" : "bg-white text-muted"}`}>
              {c.live ? "এখন পাওয়া যাচ্ছে" : "শীঘ্রই আসছে"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
