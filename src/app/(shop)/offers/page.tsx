import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/catalog";
import { flashSaleEndsAt } from "@/config/home";
import { Countdown } from "@/components/Countdown";
import { ProductGrid } from "@/components/ProductCard";
import { BoltIcon } from "@/components/icons";

export const metadata: Metadata = { title: "অফার" };

export default async function OffersPage() {
  const deals = (await getActiveProducts()).filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-brand px-6 py-8 text-white sm:px-10">
        <div>
          <h1 className="flex items-center gap-2 font-bangla text-3xl font-bold sm:text-4xl"><BoltIcon size={32} /> চলতি অফার</h1>
          <p className="mt-2 text-cream">সীমিত সময়ের জন্য বিশেষ ছাড়</p>
        </div>
        <Countdown endsAt={flashSaleEndsAt} />
      </div>
      {deals.length > 0 ? (
        <ProductGrid products={deals} />
      ) : (
        <p className="rounded-2xl bg-sand px-6 py-10 text-center text-muted">এই মুহূর্তে কোনো অফার নেই। শীঘ্রই আসছে!</p>
      )}
    </div>
  );
}
