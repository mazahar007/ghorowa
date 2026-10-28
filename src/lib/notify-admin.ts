import "server-only";

/**
 * অ্যাডমিনকে পাসওয়ার্ড রিসেট লিংক পাঠায়।
 *  - RESEND_API_KEY থাকলে ইমেইলে (resend.com, ফ্রি প্ল্যান যথেষ্ট)
 *  - না থাকলে TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID থাকলে টেলিগ্রামে
 * কোনোটাই না থাকলে false ফেরত দেয়।
 */
export async function sendAdminResetLink(to: string, link: string): Promise<boolean> {
  const text = `ঘরোয়া অ্যাডমিন পাসওয়ার্ড রিসেট করতে এই লিংকে যান (৩০ মিনিট কাজ করবে):\n${link}\n\nআপনি না চাইলে এই মেসেজ উপেক্ষা করুন — পাসওয়ার্ড বদলাবে না।`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          // onboarding@resend.dev only delivers to the Resend account's own address; set
          // EMAIL_FROM to an address on a domain verified in Resend to send anywhere.
          from: process.env.EMAIL_FROM ?? "Ghorowa <onboarding@resend.dev>",
          to: [to],
          subject: "ঘরোয়া অ্যাডমিন: পাসওয়ার্ড রিসেট",
          text,
          html: `<p>ঘরোয়া অ্যাডমিন পাসওয়ার্ড রিসেট করতে নিচের বাটনে চাপুন। লিংকটা ৩০ মিনিট কাজ করবে।</p>
  <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#b5502a;color:#fff;border-radius:999px;text-decoration:none;font-weight:bold">নতুন পাসওয়ার্ড দিন</a></p>
  <p style="color:#6e625a">আপনি রিসেট না চাইলে এই ইমেইল উপেক্ষা করুন — পাসওয়ার্ড বদলাবে না।</p>`,
        }),
      });
      if (res.ok) return true;
      console.error("Reset email failed", res.status, await res.text());
    } catch (err) {
      console.error("Reset email failed", err);
    }
  }

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text }),
      });
      if (res.ok) return true;
      console.error("Reset Telegram message failed", res.status);
    } catch (err) {
      console.error("Reset Telegram message failed", err);
    }
  }
  return false;
}

export function resetChannelConfigured() {
  return Boolean(process.env.RESEND_API_KEY || (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID));
}
