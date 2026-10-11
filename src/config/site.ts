// দোকানের সব সাধারণ তথ্য এখানে। [ ] চিহ্নের মানগুলো আপনার আসল তথ্য দিয়ে বদলান।
export const site = {
  name: "Ghorowa",
  nameBn: "ঘরোয়া",
  tagline: "পুরো পরিবারের সবকিছু, শুরু সোনামণিদের দিয়ে",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  phone: "01XXXXXXXXX", // [আপনার হটলাইন নম্বর]
  whatsapp: "8801XXXXXXXXX", // [WhatsApp নম্বর, দেশের কোড সহ, + ছাড়া]
  email: "hello@example.com", // [আপনার ইমেইল]
  address: "[আপনার ঠিকানা]",
  facebook: "https://facebook.com/", // [ফেসবুক পেজের লিংক]

  // বিকাশ "Send Money" / "Payment" নম্বর
  bkashNumber: "01XXXXXXXXX", // [বিকাশ নম্বর]
  bkashType: "Personal" as "Personal" | "Merchant",

  // ডেলিভারি চার্জ (টাকা) — আপনার কুরিয়ারের রেট অনুযায়ী বদলান
  delivery: {
    insideDhaka: 70,
    outsideDhaka: 130,
  },
  // এই পরিমাণ বা তার বেশি অর্ডারে ফ্রি ডেলিভারি (০ দিলে বন্ধ)
  freeDeliveryFrom: 0,
} as const;

export type Site = typeof site;
