import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { LoginForm, ResetNotice } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <AuthCard title="অ্যাডমিন লগইন">
      <Suspense>
        <ResetNotice />
      </Suspense>
      <LoginForm />
      <Link href="/admin/forgot" className="mt-4 block text-center text-sm font-semibold text-brand-dark underline">
        পাসওয়ার্ড ভুলে গেছেন?
      </Link>
    </AuthCard>
  );
}
