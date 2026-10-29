"use client";

import Image from "next/image";
import { useState } from "react";
import { saveProduct } from "../../actions";
import { Field, FormMessage, SubmitButton, TextArea, Toggle, inputClass, useFormAction } from "@/components/forms";
import { ageGroups, genderLabels } from "@/lib/labels";

type ProductInput = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  gender: string;
  ageGroups: string[];
  price: number;
  compareAtPrice: number | null;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  details: string[];
  featured: boolean;
  active: boolean;
  inStock: boolean;
};

/** ব্রাউজারেই ছবি ছোট করে (সর্বোচ্চ ১৬০০px, WebP) — আপলোড দ্রুত হয়, সাইটও দ্রুত চলে। */
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

export function ProductForm({ categories, product }: { categories: { id: number; name: string }[]; product?: ProductInput }) {
  const { state, onSubmit, pending } = useFormAction(saveProduct);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []).slice(0, 8);
    setBusy(true);
    const shrunk = await Promise.all(files.map(shrink));
    const dt = new DataTransfer();
    shrunk.forEach((f) => dt.items.add(f));
    input.files = dt.files;
    setPreviews(shrunk.map((f) => URL.createObjectURL(f)));
    setBusy(false);
  }

  const move = (i: number, d: number) =>
    setImages((xs) => {
      const next = [...xs];
      const j = i + d;
      if (j < 0 || j >= next.length) return xs;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 sm:p-6">
        <Field label="পণ্যের নাম *" name="name" defaultValue={product?.name} required />
        <Field
          label="লিংকের নাম (slug) *"
          name="slug"
          defaultValue={product?.slug}
          required
          pattern="[a-zA-Z0-9\-]+"
          hint="ইংরেজিতে, শব্দের মাঝে হাইফেন — যেমন cotton-summer-frock। সাইটে লিংক হবে /product/cotton-summer-frock"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="দাম (৳) *" name="price" type="number" min={1} defaultValue={product?.price} required />
          <Field label="ছাড়ের আগের দাম (৳)" name="compareAtPrice" type="number" min={1} defaultValue={product?.compareAtPrice ?? ""} hint="ছাড় না থাকলে খালি রাখুন" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="সাইজ *" name="sizes" defaultValue={product?.sizes.join(", ")} required hint="কমা দিয়ে আলাদা করুন — যেমন 2Y, 3Y, 4Y" />
          <Field label="রং" name="colors" defaultValue={product?.colors.join(", ")} hint="কমা দিয়ে আলাদা করুন — যেমন লাল, নীল" />
        </div>
        <TextArea label="বিবরণ" name="description" rows={3} defaultValue={product?.description} />
        <TextArea label="বিস্তারিত (প্রতি লাইনে একটা পয়েন্ট)" name="details" rows={4} defaultValue={product?.details.join("\n")} hint="যেমন: কাপড়: ১০০% কটন" />

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-semibold">ছবি</legend>
          <p className="-mt-1 text-sm text-muted">
            ১ম ছবি = সামনের দিক, ২য় ছবি = পেছনের দিক। সাদা বা স্বচ্ছ (PNG) ব্যাকগ্রাউন্ডে শুধু পোশাকের ছবি দিলে &quot;পরলে কেমন দেখায়&quot; ম্যানিকিনে সবচেয়ে সুন্দর বসে।
          </p>
          {images.length > 0 && (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {images.map((src, i) => (
                <li key={src} className="flex flex-col gap-1.5">
                  <input type="hidden" name="images" value={src} />
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-cream">
                    <Image src={src} alt="" fill sizes="140px" className="object-cover" />
                    {i < 2 && <span className="absolute left-1 top-1 rounded bg-ink px-1.5 text-[10px] font-bold text-cream">{i === 0 ? "সামনে · প্রধান" : "পেছনে"}</span>}
                  </span>
                  <span className="flex gap-1">
                    <button type="button" aria-label="আগে নিন" onClick={() => move(i, -1)} className="h-9 flex-1 rounded-lg bg-sand">←</button>
                    <button type="button" aria-label="পরে নিন" onClick={() => move(i, 1)} className="h-9 flex-1 rounded-lg bg-sand">→</button>
                    <button type="button" aria-label="ছবি সরান" onClick={() => setImages((xs) => xs.filter((x) => x !== src))} className="h-9 flex-1 rounded-lg bg-sand text-brand-dark">✕</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line-strong p-6 text-center hover:bg-cream">
            <span className="font-semibold">{busy ? "ছবি তৈরি হচ্ছে…" : "নতুন ছবি বেছে নিন"}</span>
            <span className="text-xs text-muted">একসাথে ৮টা পর্যন্ত · ছবি আপনা-আপনি ছোট হয়ে যাবে</span>
            <input type="file" name="newImages" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={onFiles} className="sr-only" />
          </label>
          {previews.length > 0 && (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5" aria-label="নতুন ছবি">
              {previews.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                <li key={src}><img src={src} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" /></li>
              ))}
            </ul>
          )}
        </fieldset>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold">ক্যাটাগরি *</span>
            <select name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} className={`${inputClass} h-12`}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold">কার জন্য *</span>
            <select name="gender" defaultValue={product?.gender ?? "unisex"} className={`${inputClass} h-12`}>
              {Object.entries(genderLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="mb-1 font-semibold">বয়স</legend>
            {ageGroups.map((a) => (
              <label key={a.id} className="flex min-h-10 items-center gap-3">
                <input type="checkbox" name="ageGroups" value={a.id} defaultChecked={product?.ageGroups.includes(a.id)} className="h-5 w-5 accent-[#C94C20]" />
                {a.range}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-white p-5">
          <Toggle label="সাইটে দেখাবে" name="active" defaultChecked={product?.active ?? true} />
          <Toggle label="স্টকে আছে" name="inStock" defaultChecked={product?.inStock ?? true} />
          <Toggle label="বেস্ট সেলার হিসেবে দেখাবে" name="featured" defaultChecked={product?.featured ?? false} />
        </div>
        <FormMessage state={state} />
        <SubmitButton pending={pending || busy}>{product ? "পরিবর্তন সেভ করুন" : "পণ্য যোগ করুন"}</SubmitButton>
      </div>
    </form>
  );
}
