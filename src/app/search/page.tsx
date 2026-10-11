import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/SearchResults";

export const metadata: Metadata = { title: "পণ্য খুঁজুন" };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Suspense>
        <SearchResults />
      </Suspense>
    </div>
  );
}
