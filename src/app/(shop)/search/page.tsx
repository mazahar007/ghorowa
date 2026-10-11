import type { Metadata } from "next";
import { Suspense } from "react";
import { getActiveProducts } from "@/lib/catalog";
import { genderLabels } from "@/lib/labels";
import { toBn } from "@/lib/format";
import { ProductGrid } from "@/components/ProductCard";
import { PageSkeleton } from "@/components/PageSkeleton";

export const metadata: Metadata = { title: "পণ্য খুঁজুন" };

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().toLowerCase().slice(0, 80);
  const products = await getActiveProducts();
  const results = q
    ? products.filter((p) => {
        const haystack = [p.name, p.slug.replace(/-/g, " "), p.description, p.categoryName, genderLabels[p.gender], ...p.colors]
          .join(" ")
          .toLowerCase();
        return q.split(/\s+/).every((word) => haystack.includes(word));
      })
    : products;

  return (
    <>
      <h1 className="mb-2 font-bangla text-3xl font-bold">{q ? `"${q}" এর ফলাফল` : "সব পণ্য"}</h1>
      <p className="mb-8 text-muted">{toBn(results.length)}টি পণ্য পাওয়া গেছে</p>
      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <p className="rounded-2xl bg-sand px-6 py-10 text-center text-muted">
          কিছু পাওয়া যায়নি। অন্য শব্দ দিয়ে খুঁজে দেখুন, যেমন &quot;ফ্রক&quot; বা &quot;পাঞ্জাবি&quot;।
        </p>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Suspense fallback={<PageSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
