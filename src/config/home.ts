// হোম পেজের কভার স্লাইডার। ছবি দিতে public/banners/ ফোল্ডারে রেখে `image` এ পাথ লিখুন
// (১৬০০×৭০০ সাইজের ছবি ভালো দেখাবে)। ছবি না দিলে ব্র্যান্ডের রঙে ডিজাইন করা ব্যানার দেখাবে।

export type HeroSlide = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  href: string;
  theme: "cream" | "brand" | "ink";
  image?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "নতুন কিডস কালেকশন",
    title: "ছোট্ট সোনামণির",
    highlight: "আরামের পোশাক",
    subtitle: "নরম কাপড়, সুন্দর ডিজাইন — নবজাতক থেকে ১২ বছর।",
    cta: "কিডস ড্রেস দেখুন",
    href: "/category/kids-fashion",
    theme: "cream",
  },
  {
    eyebrow: "উৎসবের অফার",
    title: "ঈদের নতুন জামা,",
    highlight: "সোনামণির হাসি",
    subtitle: "পাঞ্জাবি, পার্টি ড্রেস আর ফ্রকে বিশেষ ছাড়।",
    cta: "অফার দেখুন",
    href: "/offers",
    theme: "brand",
  },
  {
    eyebrow: "GHOROWA · ঘরোয়া",
    title: "পুরো পরিবারের সবকিছু,",
    highlight: "শুরু সোনামণিদের দিয়ে",
    subtitle: "আরও ক্যাটাগরি আসছে খুব শীঘ্রই।",
    cta: "সব ক্যাটাগরি",
    href: "/categories",
    theme: "ink",
  },
];

/**
 * ফ্ল্যাশ সেল কখন শেষ হবে (ISO তারিখ, যেমন "2026-10-20T23:59:00+06:00")।
 * খালি রাখলে প্রতিদিন রাত ১২টা পর্যন্ত কাউন্টডাউন দেখাবে।
 * ছাড়ের দাম (compare-at price) আছে এমন পণ্যগুলো ফ্ল্যাশ সেলে দেখায়।
 */
export const flashSaleEndsAt = "";
