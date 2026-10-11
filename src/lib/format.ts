const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** ইংরেজি সংখ্যাকে বাংলা অঙ্কে রূপান্তর করে। */
export function toBn(value: number | string): string {
  return String(value).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

/** ৳১,২৫০ এই ফরম্যাটে দাম দেখায়। */
export function formatPrice(amount: number): string {
  return "৳" + toBn(Math.round(amount).toLocaleString("en-IN"));
}

/** বাংলাদেশি মোবাইল নম্বর (01XXXXXXXXX) যাচাই করে। +880 / 880 সহ দিলেও চলে। */
export function normalizeBdPhone(input: string): string | null {
  const digits = input.replace(/[\s-]/g, "").replace(/^\+?88/, "");
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}
