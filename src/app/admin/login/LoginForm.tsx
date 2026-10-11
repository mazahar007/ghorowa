"use client";

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
