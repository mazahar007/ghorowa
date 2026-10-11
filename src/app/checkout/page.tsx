import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "চেকআউট" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-bangla text-3xl font-bold">অর্ডার সম্পন্ন করুন</h1>
      <CheckoutForm />
    </div>
  );
}
