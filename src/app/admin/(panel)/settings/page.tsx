import { requireAdmin } from "@/lib/admin";
import { resetChannelConfigured } from "@/lib/notify-admin";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata = { title: "সেটিংস" };

export default async function AdminSettings() {
  const admin = await requireAdmin();
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="font-bangla text-3xl font-bold">সেটিংস</h1>
      <section className="rounded-2xl bg-white p-5 sm:p-6">
        <h2 className="mb-1 font-bangla text-xl font-bold">পাসওয়ার্ড বদলান</h2>
        <p className="mb-5 text-sm text-muted">লগইন ইমেইল: {admin.email}</p>
        <ChangePasswordForm />
      </section>
      <section className="rounded-2xl bg-white p-5 text-sm text-soft sm:p-6">
        <h2 className="mb-2 font-bangla text-lg font-bold text-ink">পাসওয়ার্ড ভুলে গেলে</h2>
        <p>
          {resetChannelConfigured()
            ? "লগইন পেজের “পাসওয়ার্ড ভুলে গেছেন?” থেকে রিসেট লিংক চাইতে পারবেন।"
            : "রিসেট লিংক পাঠানোর জন্য RESEND_API_KEY (ইমেইল) বা Telegram বট সেট করা নেই।"}{" "}
          আর সব উপায় বন্ধ হলে Vercel-এ রাখা ADMIN_PASSWORD (মাস্টার পাসওয়ার্ড) দিয়ে সবসময় লগইন করা যায়।
        </p>
      </section>
    </div>
  );
}
