"use client";

import { useSearchParams } from "next/navigation";
import { loginAdmin } from "../actions";
import { Field, FormMessage, SubmitButton, useFormAction } from "@/components/forms";

export function LoginForm() {
  const { state, onSubmit, pending } = useFormAction(loginAdmin);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="ইমেইল" name="email" type="email" autoComplete="username" required />
      <Field label="পাসওয়ার্ড" name="password" type="password" autoComplete="current-password" required />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>লগইন</SubmitButton>
    </form>
  );
}

export function ResetNotice() {
  if (useSearchParams().get("reset") !== "1") return null;
  return <div className="mb-4"><FormMessage state={{ ok: "নতুন পাসওয়ার্ড সেট হয়েছে। এখন লগইন করুন।" }} /></div>;
}
