import "server-only";
import { redirect } from "next/navigation";
import { getAdmin } from "./auth";

/** প্রতিটি অ্যাডমিন পেজ, ডেটা ফাংশন ও অ্যাকশনের শুরুতে ডাকতে হবে। */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
