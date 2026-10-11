import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "কার্ট" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-bangla text-3xl font-bold">আপনার কার্ট</h1>
      <CartView />
    </div>
  );
}
