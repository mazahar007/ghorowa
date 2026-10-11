"use client";

import { saveCategory } from "../../actions";
import { Field, FormMessage, SubmitButton, Toggle, useFormAction } from "@/components/forms";

type CategoryInput = { id: number; name: string; description: string; live: boolean; sortOrder: number };

export function CategoryForm({ category }: { category?: CategoryInput }) {
  const { state, onSubmit, pending } = useFormAction(saveCategory);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {category && <input type="hidden" name="id" value={category.id} />}
      <Field label="নাম" name="name" defaultValue={category?.name} required />
      {!category && <Field label="লিংকের নাম (slug)" name="slug" required pattern="[a-zA-Z0-9\-]+" hint="ইংরেজিতে, যেমন winter-collection" />}
      <Field label="ছোট বিবরণ" name="description" defaultValue={category?.description} />
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-28">
          <Field label="ক্রম" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 99} />
        </div>
        <Toggle label="চালু (পণ্য দেখাবে)" name="live" defaultChecked={category?.live ?? false} />
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending}>{category ? "সেভ করুন" : "ক্যাটাগরি যোগ করুন"}</SubmitButton>
    </form>
  );
}
