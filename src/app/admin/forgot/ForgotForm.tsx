"use client";

import { requestAdminReset } from "../actions";
import { Field, FormMessage, SubmitButton, useFormAction } from "@/components/forms";

export function ForgotForm() {
  const { state, onSubmit, pending } = useFormAction(requestAdminReset);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="অ্যাডমিন ইমেইল" name="email" type="email" autoComplete="username" required />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>রিসেট লিংক পাঠান</SubmitButton>
    </form>
  );
}
