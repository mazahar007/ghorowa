import "server-only";
import { redirect } from "next/navigation";
import { getAdminClaims } from "./auth";
import { isSessionCurrent } from "./admin-accounts";

/** প্রতিটি অ্যাডমিন পেজ, ডেটা ফাংশন ও অ্যাকশনের শুরুতে ডাকতে হবে। */
export async function requireAdmin() {
  const admin = await getAdminClaims();
  // a password change (or reset) invalidates every older login
  if (!admin || !(await isSessionCurrent(admin.id, admin.pwv))) redirect("/admin/login");
  return admin;
}
