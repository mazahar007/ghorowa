import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { logoutAdmin } from "../actions";

const nav = [
  { href: "/admin", label: "ড্যাশবোর্ড" },
  { href: "/admin/orders", label: "অর্ডার" },
  { href: "/admin/products", label: "পণ্য" },
  { href: "/admin/categories", label: "ক্যাটাগরি" },
];

async function Guard({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <p className="hidden px-3 text-xs text-muted lg:block">{admin.email}</p>
      {children}
    </>
  );
}

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 border-b border-line bg-white p-3 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r lg:p-5">
        <Link href="/admin" className="mb-2 px-3 font-brand text-lg font-medium tracking-[0.2em]">GHOROWA</Link>
        <nav aria-label="অ্যাডমিন" className="flex gap-1 overflow-x-auto lg:flex-col">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex min-h-11 shrink-0 items-center rounded-xl px-3 font-semibold hover:bg-sand">
              {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex min-h-11 shrink-0 items-center rounded-xl px-3 text-muted hover:bg-sand">
            সাইট দেখুন ↗
          </Link>
        </nav>
        <form action={logoutAdmin} className="lg:mt-auto">
          <button type="submit" className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-muted hover:bg-sand">লগআউট</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white" />}>
          <Guard>{children}</Guard>
        </Suspense>
      </main>
    </div>
  );
}
