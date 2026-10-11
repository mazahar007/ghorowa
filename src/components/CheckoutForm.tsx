"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { site } from "@/config/site";
import { cart, useCartDetails } from "@/lib/cart-store";
import { formatPrice, toBn } from "@/lib/format";
import { deliveryCharge, deliveryZoneLabels, type DeliveryZone } from "@/lib/shipping";
import type { PaymentMethod } from "@/lib/order";

const inputClass =
  "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white px-4 outline-none focus:border-ink";

function Radio({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 ${
        checked ? "border-ink bg-cream" : "border-line-strong bg-white"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="h-5 w-5 accent-[#C94C20]" />
      <span className="flex flex-1 flex-wrap items-center justify-between gap-2">{children}</span>
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal } = useCartDetails();
  const [zone, setZone] = useState<DeliveryZone>("inside");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delivery = deliveryCharge(zone, subtotal);
  const total = subtotal + delivery;

  if (items.length === 0 && !submitting) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[28px] bg-cream px-6 py-16 text-center">
        <p className="font-bangla text-2xl font-bold">কার্টে কোনো পণ্য নেই</p>
        <Link href="/category/kids-fashion" className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      phone: form.get("phone"),
      address: form.get("address"),
      note: form.get("note"),
      zone,
      payment,
      bkashSender: form.get("bkashSender"),
      bkashTrxId: form.get("bkashTrxId"),
      items: items.map(({ slug, size, color, qty }) => ({ slug, size, color, qty })),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: { id?: string; total?: number; error?: string } = await res.json();
      if (!res.ok || !data.id) {
        setError(data.error ?? "অর্ডার পাঠানো যায়নি। আবার চেষ্টা করুন।");
        setSubmitting(false);
        return;
      }
      router.replace(`/order-success?id=${encodeURIComponent(data.id)}&total=${data.total ?? total}`);
      cart.clear();
    } catch {
      setError("ইন্টারনেট সংযোগে সমস্যা। আবার চেষ্টা করুন।");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 font-bangla text-xl font-bold">ডেলিভারির তথ্য</legend>
          <div>
            <label htmlFor="name" className="mb-1.5 block font-semibold">আপনার নাম *</label>
            <input id="name" name="name" required minLength={2} autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block font-semibold">মোবাইল নম্বর *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              pattern="(\+?88)?01[3-9][0-9]{8}"
              title="১১ সংখ্যার মোবাইল নম্বর, যেমন 01712345678"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="address" className="mb-1.5 block font-semibold">পূর্ণ ঠিকানা *</label>
            <textarea
              id="address"
              name="address"
              required
              minLength={8}
              rows={3}
              autoComplete="street-address"
              placeholder="বাসা/রোড নম্বর, এলাকা, থানা, জেলা"
              className={`${inputClass} h-auto py-3`}
            />
          </div>
          <div role="radiogroup" aria-label="ডেলিভারি এলাকা" className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(deliveryZoneLabels) as DeliveryZone[]).map((z) => (
              <Radio key={z} name="zone" value={z} checked={zone === z} onChange={() => setZone(z)}>
                <span className="font-semibold">{deliveryZoneLabels[z]}</span>
                <span className="text-sm">{formatPrice(deliveryCharge(z, subtotal))}</span>
              </Radio>
            ))}
          </div>
          <div>
            <label htmlFor="note" className="mb-1.5 block font-semibold">নোট (ঐচ্ছিক)</label>
            <input id="note" name="note" placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়" className={inputClass} />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 font-bangla text-xl font-bold">পেমেন্ট</legend>
          <Radio name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")}>
            <span className="font-semibold">ক্যাশ অন ডেলিভারি</span>
            <span className="text-sm text-muted">পণ্য হাতে পেয়ে টাকা দিন</span>
          </Radio>
          <Radio name="payment" value="bkash" checked={payment === "bkash"} onChange={() => setPayment("bkash")}>
            <span className="font-semibold">bKash</span>
            <span className="text-sm text-muted">আগে পেমেন্ট করুন</span>
          </Radio>
          {payment === "bkash" && (
            <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
              <ol className="list-decimal space-y-1 pl-5 text-soft">
                <li>বিকাশ অ্যাপ থেকে <b>{site.bkashType === "Merchant" ? "Payment" : "Send Money"}</b> বেছে নিন।</li>
                <li>
                  নম্বর: <b className="text-ink">{site.bkashNumber}</b> ({site.bkashType})
                </li>
                <li>
                  টাকার পরিমাণ: <b className="text-ink">{formatPrice(total)}</b>
                </li>
                <li>পেমেন্টের পর নিচে আপনার বিকাশ নম্বর ও ট্রানজেকশন আইডি দিন।</li>
              </ol>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="bkashSender" className="mb-1.5 block font-semibold">যে নম্বর থেকে পাঠিয়েছেন *</label>
                  <input id="bkashSender" name="bkashSender" type="tel" required inputMode="numeric" placeholder="01XXXXXXXXX" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="bkashTrxId" className="mb-1.5 block font-semibold">ট্রানজেকশন আইডি *</label>
                  <input id="bkashTrxId" name="bkashTrxId" required placeholder="যেমন 9BG7XXXXXX" className={`${inputClass} uppercase`} />
                </div>
              </div>
            </div>
          )}
        </fieldset>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-2xl bg-cream p-6 lg:sticky lg:top-6">
        <h2 className="font-bangla text-xl font-bold">আপনার অর্ডার</h2>
        <ul className="flex flex-col gap-2 border-b border-line-strong pb-4 text-sm">
          {items.map((i) => (
            <li key={`${i.slug}-${i.size}-${i.color ?? ""}`} className="flex justify-between gap-3">
              <span>
                {i.product.name} <span className="text-muted">({i.size}) × {toBn(i.qty)}</span>
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between"><span>পণ্যের দাম</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between"><span>ডেলিভারি চার্জ</span><span>{formatPrice(delivery)}</span></div>
        <div className="flex justify-between border-t border-line-strong pt-3 text-lg font-bold">
          <span>সর্বমোট</span><span>{formatPrice(total)}</span>
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-white px-4 py-3 font-semibold text-brand-dark">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="h-13 rounded-xl bg-brand font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "অর্ডার পাঠানো হচ্ছে…" : "অর্ডার কনফার্ম করুন"}
        </button>
        <p className="text-center text-xs text-soft">অর্ডারের পর আমরা ফোন করে কনফার্ম করব।</p>
      </aside>
    </form>
  );
}
