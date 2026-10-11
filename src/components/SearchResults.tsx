"use client";

import { useSearchParams } from "next/navigation";
import { products, categories, genderLabels } from "@/data/catalog";
import { toBn } from "@/lib/format";
import { ProductGrid } from "./ProductCard";

export function SearchResults() {
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const results = q
    ? products.filter((p) => {
        const category = categories.find((c) => c.slug === p.category)?.name ?? "";
        const haystack = [p.name, p.slug.replace(/-/g, " "), p.description, category, genderLabels[p.gender], ...(p.colors ?? [])]
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
