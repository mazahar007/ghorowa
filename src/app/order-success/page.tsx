import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/OrderSuccess";

export const metadata: Metadata = { title: "অর্ডার সম্পন্ন", robots: { index: false } };

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Suspense>
        <OrderSuccess />
      </Suspense>
    </div>
  );
}
