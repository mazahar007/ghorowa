"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ageGroups, genderLabels, type AgeGroup, type Gender, type Product } from "@/data/catalog";
import { ProductGrid } from "./ProductCard";

type GenderFilter = "all" | Exclude<Gender, "unisex">;

const genderFilters: { id: GenderFilter; label: string }[] = [
  { id: "all", label: "সব" },
  { id: "girls", label: genderLabels.girls },
  { id: "boys", label: genderLabels.boys },
  { id: "baby", label: genderLabels.baby },
];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-11 rounded-full border-[1.5px] px-4 font-semibold ${
        active ? "border-ink bg-ink text-cream" : "border-line-strong bg-white hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Filtered({ products, showAge }: { products: Product[]; showAge: boolean }) {
  const params = useSearchParams();
  const initialAge = ageGroups.find((a) => a.id === params.get("age"))?.id ?? null;
  const [gender, setGender] = useState<GenderFilter>("all");
  const [age, setAge] = useState<AgeGroup | null>(initialAge);

  const visible = products.filter(
    (p) =>
      (gender === "all" || p.gender === gender || (p.gender === "unisex" && gender !== "baby")) &&
      (!age || p.ageGroups.includes(age)),
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div role="group" aria-label="মেয়ে / ছেলে" className="flex flex-wrap gap-2">
          {genderFilters.map((f) => (
            <Pill key={f.id} active={gender === f.id} onClick={() => setGender(f.id)}>
              {f.label}
            </Pill>
          ))}
        </div>
        {showAge && (
          <div role="group" aria-label="বয়স" className="flex flex-wrap gap-2">
            <Pill active={age === null} onClick={() => setAge(null)}>সব বয়স</Pill>
            {ageGroups.map((a) => (
              <Pill key={a.id} active={age === a.id} onClick={() => setAge(a.id)}>
                {a.range}
              </Pill>
            ))}
          </div>
        )}
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

export function ProductFilter({ products, showAge = false }: { products: Product[]; showAge?: boolean }) {
  return (
    <Suspense fallback={<ProductGrid products={products} />}>
      <Filtered products={products} showAge={showAge} />
    </Suspense>
  );
}
