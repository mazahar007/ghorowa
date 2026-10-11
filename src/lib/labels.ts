export type Gender = "girls" | "boys" | "baby" | "unisex";
export type AgeGroup = "0-12m" | "1-3y" | "4-7y" | "8-12y";

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

export const orderStatusLabels: Record<string, string> = {
  new: "নতুন",
  confirmed: "কনফার্মড",
  shipped: "পাঠানো হয়েছে",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
  returned: "ফেরত",
};

export const paymentMethodLabels: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  bkash_manual: "বিকাশ (সেন্ড মানি)",
  bkash_online: "বিকাশ (অনলাইন)",
};

export const paymentStatusLabels: Record<string, string> = {
  unpaid: "বাকি",
  pending: "অপেক্ষমাণ",
  paid: "পরিশোধিত",
  failed: "ব্যর্থ",
};
