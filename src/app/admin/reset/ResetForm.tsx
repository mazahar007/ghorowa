"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetAdminPassword } from "../actions";
import { Field, FormMessage, SubmitButton, useFormAction } from "@/components/forms";

export function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const { state, onSubmit, pending } = useFormAction(resetAdminPassword);
  if (!token) {
    return (
      <p className="text-soft">
        লিংকটা সম্পূর্ণ নয়। <Link href="/admin/forgot" className="font-semibold underline">আবার রিসেট চেয়ে নিন</Link>।
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <Field label="নতুন পাসওয়ার্ড" name="password" type="password" autoComplete="new-password" minLength={10} required hint="অন্তত ১০ অক্ষর" />
      <Field label="আবার লিখুন" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>পাসওয়ার্ড সেভ করুন</SubmitButton>
    </form>
  );
}
