import Link from "next/link";
import { getCustomerId } from "@/lib/auth";
import { UserIcon } from "./icons";

export async function AccountLink() {
  const loggedIn = Boolean(await getCustomerId());
  return (
    <Link
      href={loggedIn ? "/account" : "/account/login"}
      aria-label={loggedIn ? "আমার অ্যাকাউন্ট" : "লগইন"}
      className="hidden h-12 items-center gap-2 rounded-xl px-3 hover:bg-sand md:flex"
    >
      <UserIcon />
      <span className="hidden text-sm font-semibold lg:inline">{loggedIn ? "আমার অ্যাকাউন্ট" : "লগইন"}</span>
    </Link>
  );
}
