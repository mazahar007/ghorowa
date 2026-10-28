import { Suspense } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { ResetForm } from "./ResetForm";

export const metadata = { title: "নতুন পাসওয়ার্ড" };

export default function ResetPage() {
  return (
    <AuthCard title="নতুন পাসওয়ার্ড দিন">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}
