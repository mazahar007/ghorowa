import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-bangla text-3xl font-bold">পেজটি পাওয়া যায়নি</h1>
      <p className="text-soft">আপনি যে পেজটি খুঁজছেন সেটা সরিয়ে ফেলা হয়েছে বা ঠিকানাটা ভুল।</p>
      <Link href="/" className="inline-flex h-12 items-center rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark">
        হোমে ফিরে যান
      </Link>
    </div>
  );
}
