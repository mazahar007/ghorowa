"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { CheckIcon } from "./icons";

export function OrderSuccess() {
  const params = useSearchParams();
  const id = params.get("id");
  const total = Number(params.get("total"));

  return (
    <div className="flex flex-col items-center gap-5 rounded-[28px] bg-cream px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
        <CheckIcon size={34} />
      </span>
      <h1 className="font-bangla text-3xl font-bold">ধন্যবাদ! আপনার অর্ডার পেয়েছি</h1>
      {id && (
        <p className="text-lg">
          অর্ডার নম্বর: <b>{id}</b>
          {Number.isFinite(total) && total > 0 && <> · মোট {formatPrice(total)}</>}
        </p>
      )}
      <p className="max-w-md text-soft">
        খুব শীঘ্রই আমাদের প্রতিনিধি আপনাকে ফোন করে অর্ডার কনফার্ম করবেন। কোনো প্রশ্ন থাকলে কল করুন{" "}
        <a href={`tel:${site.phone}`} className="font-semibold underline">{site.phone}</a>।
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
          হোমে ফিরে যান
        </Link>
        <a
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`আমার অর্ডার নম্বর ${id ?? ""}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-ink px-6 font-bold hover:bg-white"
        >
          WhatsApp-এ যোগাযোগ
        </a>
      </div>
    </div>
  );
}
