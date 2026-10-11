import type { Metadata } from "next";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "সাহায্য ও যোগাযোগ" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-bangla text-3xl font-bold">সাহায্য ও যোগাযোগ</h1>

      <section id="delivery" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 font-bangla text-2xl font-bold">ডেলিভারি</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-soft">
          <li>ঢাকা সিটির ভেতরে ডেলিভারি চার্জ {formatPrice(site.delivery.insideDhaka)}, সাধারণত ১–২ দিনে পৌঁছায়।</li>
          <li>ঢাকার বাইরে ডেলিভারি চার্জ {formatPrice(site.delivery.outsideDhaka)}, সাধারণত ২–৪ দিনে পৌঁছায়।</li>
          <li>অর্ডারের পর আমরা ফোন করে কনফার্ম করি, তারপর কুরিয়ারে পাঠাই।</li>
        </ul>
      </section>

      <section id="returns" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 font-bangla text-2xl font-bold">এক্সচেঞ্জ ও রিটার্ন</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-soft">
          <li>সাইজ না মিললে পণ্য হাতে পাওয়ার [৩] দিনের মধ্যে এক্সচেঞ্জ করা যাবে।</li>
          <li>পণ্য অবশ্যই না-ধোয়া, ট্যাগসহ ও আগের অবস্থায় থাকতে হবে।</li>
          <li>ত্রুটিপূর্ণ বা ভুল পণ্য পেলে ডেলিভারি ম্যানের সামনেই জানান — আমরা বিনা খরচে বদলে দেব।</li>
        </ul>
        <p className="mt-3 text-sm text-muted">[এই নিয়মগুলো আপনার আসল পলিসি অনুযায়ী বদলে নিন]</p>
      </section>

      <section id="contact" className="scroll-mt-6">
        <h2 className="mb-3 font-bangla text-2xl font-bold">যোগাযোগ</h2>
        <ul className="space-y-1.5 text-soft">
          <li>ফোন: <a href={`tel:${site.phone}`} className="font-semibold text-ink underline">{site.phone}</a></li>
          <li>WhatsApp: <a href={`https://wa.me/${site.whatsapp}`} className="font-semibold text-ink underline">মেসেজ পাঠান</a></li>
          <li>ইমেইল: <a href={`mailto:${site.email}`} className="font-semibold text-ink underline">{site.email}</a></li>
          <li>ঠিকানা: {site.address}</li>
        </ul>
      </section>
    </div>
  );
}
