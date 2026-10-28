"use client";

import { changeAdminPassword } from "../../actions";
import { Field, FormMessage, SubmitButton, useFormAction } from "@/components/forms";

export function ChangePasswordForm() {
  const { state, onSubmit, pending } = useFormAction(changeAdminPassword);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="বর্তমান পাসওয়ার্ড" name="current" type="password" autoComplete="current-password" required />
      <Field label="নতুন পাসওয়ার্ড" name="password" type="password" autoComplete="new-password" minLength={10} required hint="অন্তত ১০ অক্ষর" />
      <Field label="নতুন পাসওয়ার্ড আবার" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>পাসওয়ার্ড বদলান</SubmitButton>
    </form>
  );
}
