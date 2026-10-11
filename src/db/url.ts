/**
 * Supabase থেকে কপি করা ডাটাবেস লিংকে সাধারণ ভুলগুলো ঠিক করে নেয়:
 * আগে-পরে ফাঁকা জায়গা বা উদ্ধৃতিচিহ্ন, ভুল করে সাথে চলে আসা "DATABASE_URL=",
 * পাসওয়ার্ডের চারপাশে রয়ে যাওয়া [ ], আর পাসওয়ার্ডে @ # / ? % এর মতো চিহ্ন।
 */
export function normalizeDatabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^DATABASE_URL\s*=\s*/i, "").trim();
  url = url.replace(/^["']+|["']+$/g, "").trim();

  const match = /^(postgres(?:ql)?:\/\/)([^:/@]+):(.*)@([^@/]+)(\/.*)?$/i.exec(url);
  if (!match) return url;
  const [, scheme, user, rawPassword, hostPort, rest = ""] = match;

  let password = rawPassword;
  if (password.startsWith("[") && password.endsWith("]")) password = password.slice(1, -1);
  try {
    // already percent-encoded passwords stay as they are
    password = encodeURIComponent(decodeURIComponent(password));
  } catch {
    password = encodeURIComponent(password);
  }
  return `${scheme}${user}:${password}@${hostPort}${rest}`;
}
