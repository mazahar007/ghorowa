import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { ForgotForm } from "./ForgotForm";

export const metadata = { title: "পাসওয়ার্ড ভুলে গেছেন" };

export default function ForgotPage() {
  return (
    <AuthCard title="পাসওয়ার্ড ভুলে গেছেন?">
      <p className="mb-5 text-sm text-soft">অ্যাডমিন ইমেইল দিন। পাসওয়ার্ড নতুন করে দেওয়ার একটা লিংক পাঠানো হবে।</p>
      <ForgotForm />
      <Link href="/admin/login" className="mt-4 block text-center text-sm font-semibold underline">লগইনে ফিরে যান</Link>
    </AuthCard>
  );
}
