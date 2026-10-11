import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentCustomer } from "@/lib/customers";
import { bkashOnlineEnabled } from "@/lib/order";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "চেকআউট", robots: { index: false } };

async function Checkout() {
  const customer = await getCurrentCustomer();
  return <CheckoutForm customer={customer} bkashOnline={bkashOnlineEnabled()} />;
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-bangla text-3xl font-bold">অর্ডার সম্পন্ন করুন</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-sand" />}>
        <Checkout />
      </Suspense>
    </div>
  );
}
