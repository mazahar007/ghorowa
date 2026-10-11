"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginCustomer, registerCustomer, updateProfile } from "@/app/(shop)/account/actions";
import { Field, FormMessage, SubmitButton, TextArea, useFormAction } from "@/components/forms";

function useNext() {
  return useSearchParams().get("next") ?? "/account";
}

export function LoginForm() {
  const next = useNext();
  const { state, onSubmit, pending } = useFormAction(loginCustomer);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="মোবাইল নম্বর" name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" required />
      <Field label="পাসওয়ার্ড" name="password" type="password" autoComplete="current-password" required />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>লগইন</SubmitButton>
      <p className="text-center text-sm">
        অ্যাকাউন্ট নেই? <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="font-bold underline">নতুন অ্যাকাউন্ট খুলুন</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const next = useNext();
  const { state, onSubmit, pending } = useFormAction(registerCustomer);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="আপনার নাম" name="name" autoComplete="name" required />
      <Field label="মোবাইল নম্বর" name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" required />
      <Field label="পাসওয়ার্ড" name="password" type="password" autoComplete="new-password" minLength={6} required hint="অন্তত ৬ অক্ষর" />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>অ্যাকাউন্ট খুলুন</SubmitButton>
      <p className="text-center text-sm">
        আগেই অ্যাকাউন্ট আছে? <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="font-bold underline">লগইন করুন</Link>
      </p>
    </form>
  );
}

export function ProfileForm({ name, address, zone }: { name: string; address: string; zone: string }) {
  const { state, onSubmit, pending } = useFormAction(updateProfile);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="নাম" name="name" defaultValue={name} required />
      <TextArea label="ডেলিভারির ঠিকানা" name="address" defaultValue={address} rows={3} />
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1 font-semibold">এলাকা</legend>
        <label className="flex min-h-11 items-center gap-2"><input type="radio" name="zone" value="inside" defaultChecked={zone !== "outside"} className="h-5 w-5 accent-[#C94C20]" /> ঢাকা সিটির ভেতরে</label>
        <label className="flex min-h-11 items-center gap-2"><input type="radio" name="zone" value="outside" defaultChecked={zone === "outside"} className="h-5 w-5 accent-[#C94C20]" /> ঢাকার বাইরে</label>
      </fieldset>
      <FormMessage state={state} />
      <SubmitButton pending={pending} variant="secondary">সেভ করুন</SubmitButton>
    </form>
  );
}
