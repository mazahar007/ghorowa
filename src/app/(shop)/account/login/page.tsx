import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "লগইন", robots: { index: false } };

export default function Page() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h1 className="mb-1 font-bangla text-3xl font-bold">লগইন</h1>
        <p className="mb-6 text-soft">অ্যাকাউন্টে আপনার সব অর্ডার ও ডেলিভারির অবস্থা দেখতে পাবেন।</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
