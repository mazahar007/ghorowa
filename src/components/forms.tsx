"use client";

import { startTransition, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { EyeIcon, EyeOffIcon } from "./icons";

type ActionState = { error?: string; ok?: string } | undefined;

/**
 * React 19 form actions reset the form after submit, which would wipe what the
 * admin typed when validation fails. Submitting through onSubmit keeps the inputs.
 */
export function useFormAction(fn: (state: ActionState, fd: FormData) => Promise<ActionState>) {
  const [state, dispatch, pending] = useActionState(fn, undefined);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return { state, onSubmit, pending };
}

export const inputClass =
  "w-full rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 py-2.5 outline-none focus:border-ink";

export function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; name: string }) {
  const [shown, setShown] = useState(false);
  const isPassword = props.type === "password";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-semibold">{label}</span>
      {isPassword ? (
        <span className="relative">
          <input {...props} type={shown ? "text" : "password"} className={`${inputClass} h-12 py-0 pr-14`} />
          <button
            type="button"
            aria-label={shown ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            aria-pressed={shown}
            onClick={() => setShown((v) => !v)}
            className="absolute right-1 top-1 flex h-10 w-12 items-center justify-center rounded-lg text-muted hover:bg-sand hover:text-ink"
          >
            {shown ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </span>
      ) : (
        <input {...props} className={`${inputClass} h-12 py-0`} />
      )}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; name: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-semibold">{label}</span>
      <textarea {...props} className={inputClass} />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-5 w-5 accent-[#C94C20]" />
      <span className="font-semibold">{label}</span>
    </label>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  pending: pendingProp,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "border-[1.5px] border-ink bg-white hover:bg-cream",
    danger: "border-[1.5px] border-brand-dark bg-white text-brand-dark hover:bg-cream",
  };
  return (
    <button type="submit" disabled={pending} className={`h-12 rounded-xl px-6 font-bold disabled:opacity-60 ${styles[variant]}`}>
      {pending ? "অপেক্ষা করুন…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: { error?: string; ok?: string } | undefined }) {
  if (state?.error) return <p role="alert" className="rounded-xl bg-[#fbe9e2] px-4 py-3 font-semibold text-brand-dark">{state.error}</p>;
  if (state?.ok) return <p role="status" className="rounded-xl bg-[#e6f4ea] px-4 py-3 font-semibold text-[#17703d]">{state.ok}</p>;
  return null;
}
