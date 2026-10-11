"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ageGroups, genderLabels, type AgeGroup } from "@/lib/labels";
import type { Product } from "@/lib/types";
import { toBn } from "@/lib/format";
import { ProductGrid } from "./ProductCard";

type GenderFilter = "all" | "girls" | "boys" | "baby";
type Sort = "new" | "price-asc" | "price-desc" | "discount";

const genderFilters: { id: GenderFilter; label: string }[] = [
  { id: "all", label: "সব" },
  { id: "girls", label: genderLabels.girls },
  { id: "boys", label: genderLabels.boys },
  { id: "baby", label: genderLabels.baby },
];

const sorts: { id: Sort; label: string }[] = [
  { id: "new", label: "নতুন আগে" },
  { id: "price-asc", label: "দাম: কম থেকে বেশি" },
  { id: "price-desc", label: "দাম: বেশি থেকে কম" },
  { id: "discount", label: "বেশি ছাড়" },
];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-10 shrink-0 rounded-full border-[1.5px] px-4 text-sm font-semibold ${
        active ? "border-ink bg-ink text-cream" : "border-line-strong bg-white hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Filtered({ products, showKidsFilters }: { products: Product[]; showKidsFilters: boolean }) {
  const params = useSearchParams();
  const [gender, setGender] = useState<GenderFilter>(
    genderFilters.find((g) => g.id === params.get("gender"))?.id ?? "all",
  );
  const [age, setAge] = useState<AgeGroup | null>(ageGroups.find((a) => a.id === params.get("age"))?.id ?? null);
  const [sort, setSort] = useState<Sort>(sorts.find((s) => s.id === params.get("sort"))?.id ?? "new");

  const visible = products
    .filter(
      (p) =>
        (gender === "all" || p.gender === gender || (p.gender === "unisex" && gender !== "baby")) &&
        (!age || p.ageGroups.includes(age)),
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "discount") return (b.compareAtPrice ?? b.price) - b.price - ((a.compareAtPrice ?? a.price) - a.price);
      return b.createdAt.localeCompare(a.createdAt);
    });

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        {showKidsFilters && (
          <>
            <div role="group" aria-label="মেয়ে / ছেলে" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              {genderFilters.map((f) => (
                <Pill key={f.id} active={gender === f.id} onClick={() => setGender(f.id)}>{f.label}</Pill>
              ))}
            </div>
            <div role="group" aria-label="বয়স" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              <Pill active={age === null} onClick={() => setAge(null)}>সব বয়স</Pill>
              {ageGroups.map((a) => (
                <Pill key={a.id} active={age === a.id} onClick={() => setAge(a.id)}>{a.range}</Pill>
              ))}
            </div>
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-sm text-muted">{toBn(visible.length)}টি পণ্য</p>
          <label className="flex items-center gap-2 text-sm font-semibold">
            সাজান
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 rounded-xl border-[1.5px] border-line-strong bg-white px-3 font-normal"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {visible.length > 0 ? (
        <ProductGrid products={visible} />
      ) : (
        <p className="rounded-2xl bg-sand px-6 py-10 text-center text-muted">
          এই ফিল্টারে কোনো পণ্য পাওয়া যায়নি। অন্য ফিল্টার বেছে দেখুন।
        </p>
      )}
    </>
  );
}

export function ProductFilter({ products, showKidsFilters = false }: { products: Product[]; showKidsFilters?: boolean }) {
  return (
    <Suspense fallback={<ProductGrid products={products} />}>
      <Filtered products={products} showKidsFilters={showKidsFilters} />
    </Suspense>
  );
}
