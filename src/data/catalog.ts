// ─────────────────────────────────────────────────────────────
// পণ্য ও ক্যাটাগরির তালিকা।
// নতুন পণ্য যোগ করতে `products` তালিকায় একটা নতুন অবজেক্ট যোগ করুন।
// নতুন ক্যাটাগরি চালু করতে সেই ক্যাটাগরির `live: true` করে দিন।
//
// ⚠ নিচের সব পণ্য, দাম ও বিবরণ নমুনা — আসল তথ্য দিয়ে বদলাতে হবে।
// ছবি: public/products/ ফোল্ডারে রেখে `images` এ "/products/ছবির-নাম.jpg" লিখুন।
// ─────────────────────────────────────────────────────────────

export type Gender = "girls" | "boys" | "baby" | "unisex";
export type AgeGroup = "0-12m" | "1-3y" | "4-7y" | "8-12y";

export type Category = {
  slug: string;
  name: string;
  description: string;
  live: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  gender: Gender;
  ageGroups: AgeGroup[];
  price: number;
  /** ছাড়ের আগের দাম (না থাকলে বাদ দিন) */
  compareAtPrice?: number;
  sizes: string[];
  colors?: string[];
  images: string[];
  description: string;
  details: string[];
  featured?: boolean;
  inStock: boolean;
};

export const categories: Category[] = [
  { slug: "kids-fashion", name: "কিডস ফ্যাশন", description: "নবজাতক থেকে ১২ বছর পর্যন্ত মেয়ে ও ছেলেদের পোশাক", live: true },
  { slug: "women-fashion", name: "মেয়েদের ফ্যাশন", description: "শাড়ি, থ্রি-পিস, কুর্তি ও আরও অনেক কিছু", live: false },
  { slug: "men-fashion", name: "ছেলেদের ফ্যাশন", description: "পাঞ্জাবি, শার্ট, টি-শার্ট ও প্যান্ট", live: false },
  { slug: "toys", name: "খেলনা", description: "শিশুদের নিরাপদ ও শিক্ষামূলক খেলনা", live: false },
  { slug: "beauty-care", name: "বিউটি ও কেয়ার", description: "স্কিন কেয়ার, বেবি কেয়ার ও পার্সোনাল কেয়ার", live: false },
  { slug: "home-kitchen", name: "হোম ও কিচেন", description: "ঘর সাজানো ও রান্নাঘরের প্রয়োজনীয় জিনিস", live: false },
  { slug: "grocery", name: "গ্রোসারি", description: "খাঁটি ও নিত্যপ্রয়োজনীয় খাদ্যপণ্য", live: false },
  { slug: "gadgets", name: "গ্যাজেট", description: "মোবাইল এক্সেসরিজ ও স্মার্ট গ্যাজেট", live: false },
];

export const genderLabels: Record<Gender, string> = {
  girls: "মেয়ে",
  boys: "ছেলে",
  baby: "বেবি",
  unisex: "সবার জন্য",
};

export const ageGroups: { id: AgeGroup; range: string; label: string }[] = [
  { id: "0-12m", range: "০–১২ মাস", label: "নবজাতক ও বেবি" },
  { id: "1-3y", range: "১–৩ বছর", label: "টডলার" },
  { id: "4-7y", range: "৪–৭ বছর", label: "ছোট্ট সোনামণি" },
  { id: "8-12y", range: "৮–১২ বছর", label: "বড় বাচ্চা" },
];

export const products: Product[] = [
  {
    slug: "cotton-summer-frock",
    name: "কটন সামার ফ্রক",
    category: "kids-fashion",
    gender: "girls",
    ageGroups: ["1-3y", "4-7y"],
    price: 650,
    compareAtPrice: 850,
    sizes: ["2Y", "3Y", "4Y", "5Y"],
    colors: ["হলুদ", "গোলাপি", "আকাশি"],
    images: [],
    description: "গরমে আরামদায়ক ১০০% সুতি কাপড়ের হালকা ফ্রক। প্রতিদিন পরার জন্য উপযোগী।",
    details: ["কাপড়: ১০০% কটন", "হাত ও মেশিনে ধোয়া যায়", "নরম সেলাই, ত্বকে আরামদায়ক"],
    featured: true,
    inStock: true,
  },
  {
    slug: "boys-panjabi-set",
    name: "ছেলেদের পাঞ্জাবি সেট",
    category: "kids-fashion",
    gender: "boys",
    ageGroups: ["4-7y", "8-12y"],
    price: 1250,
    sizes: ["3Y", "4Y", "6Y", "8Y", "10Y"],
    colors: ["সাদা", "অফ-হোয়াইট", "নেভি"],
    images: [],
    description: "ঈদ ও উৎসবের জন্য পাঞ্জাবি ও পায়জামার সেট। সূক্ষ্ম এমব্রয়ডারি করা।",
    details: ["কাপড়: কটন ব্লেন্ড", "সেটে আছে: পাঞ্জাবি + পায়জামা", "শুকনো জায়গায় ইস্ত্রি করুন"],
    featured: true,
    inStock: true,
  },
  {
    slug: "baby-cotton-romper",
    name: "বেবি কটন রম্পার",
    category: "kids-fashion",
    gender: "baby",
    ageGroups: ["0-12m"],
    price: 450,
    sizes: ["0-3M", "3-6M", "6-9M", "9-12M"],
    colors: ["সাদা", "হালকা সবুজ"],
    images: [],
    description: "নবজাতকের নরম ত্বকের জন্য সুতি রম্পার। স্ন্যাপ বাটন থাকায় পরানো সহজ।",
    details: ["কাপড়: অর্গানিক কটন", "স্ন্যাপ বাটন", "ট্যাগ ছাড়া, ত্বকে ঘষা লাগে না"],
    featured: true,
    inStock: true,
  },
  {
    slug: "girls-party-dress",
    name: "গার্লস পার্টি ড্রেস",
    category: "kids-fashion",
    gender: "girls",
    ageGroups: ["4-7y", "8-12y"],
    price: 1650,
    compareAtPrice: 1950,
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    colors: ["লাল", "মেরুন"],
    images: [],
    description: "জন্মদিন ও বিয়ের অনুষ্ঠানের জন্য ঘের-ওয়ালা পার্টি ড্রেস, ভেতরে নরম সুতি লাইনিং।",
    details: ["বাইরে: নেট ও সাটিন", "ভেতরে: কটন লাইনিং", "পেছনে চেইন"],
    featured: true,
    inStock: true,
  },
  {
    slug: "tshirt-shorts-set",
    name: "টি-শার্ট ও শর্টস সেট",
    category: "kids-fashion",
    gender: "boys",
    ageGroups: ["1-3y", "4-7y"],
    price: 550,
    compareAtPrice: 700,
    sizes: ["2Y", "3Y", "4Y", "6Y"],
    colors: ["নেভি", "সবুজ"],
    images: [],
    description: "খেলাধুলা ও বাসায় পরার জন্য আরামদায়ক টি-শার্ট ও শর্টসের সেট।",
    details: ["কাপড়: সিঙ্গেল জার্সি কটন", "ইলাস্টিক কোমর", "রং সহজে ওঠে না"],
    featured: true,
    inStock: true,
  },
  {
    slug: "newborn-gift-set",
    name: "নিউবর্ন গিফট সেট",
    category: "kids-fashion",
    gender: "baby",
    ageGroups: ["0-12m"],
    price: 1450,
    sizes: ["0-3M", "3-6M"],
    images: [],
    description: "নবজাতককে উপহার দেওয়ার জন্য ৫ পিসের সেট — রম্পার, টুপি, মোজা, বিব ও কাঁথা।",
    details: ["৫ পিস", "গিফট বক্সে প্যাক করা", "কাপড়: সুতি"],
    featured: true,
    inStock: true,
  },
  {
    slug: "kids-pajama-set",
    name: "কিডস পায়জামা সেট",
    category: "kids-fashion",
    gender: "unisex",
    ageGroups: ["4-7y", "8-12y"],
    price: 750,
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["আকাশি", "গোলাপি"],
    images: [],
    description: "রাতে ঘুমানোর জন্য নরম ও ঢিলেঢালা পায়জামা সেট।",
    details: ["কাপড়: কটন জার্সি", "ফুল হাতা", "ইলাস্টিক কোমর"],
    featured: true,
    inStock: true,
  },
  {
    slug: "boys-hoodie",
    name: "বয়েজ হুডি",
    category: "kids-fashion",
    gender: "boys",
    ageGroups: ["4-7y", "8-12y"],
    price: 950,
    sizes: ["5Y", "7Y", "9Y", "11Y"],
    colors: ["ধূসর", "নেভি"],
    images: [],
    description: "শীতের জন্য ভেতরে নরম ফ্লিসের হুডি, সামনে পকেট সহ।",
    details: ["কাপড়: ফ্লিস কটন", "জিপার ছাড়া, মাথায় টুপি", "মেশিনে ধোয়া যায়"],
    featured: true,
    inStock: true,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}
