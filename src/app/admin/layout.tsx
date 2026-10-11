import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "অ্যাডমিন", template: "%s · অ্যাডমিন | Ghorowa" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full flex-1 bg-sand">{children}</div>;
}
