import type { Metadata, Viewport } from "next";
import { DM_Sans, Hind_Siliguri, Jost } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} (${site.nameBn}) — কিডস ফ্যাশন ও পরিবারের সবকিছু`,
    template: `%s | ${site.name}`,
  },
  description: "বাচ্চাদের আরামদায়ক পোশাক — নবজাতক থেকে ১২ বছর। সারা বাংলাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি।",
  openGraph: { siteName: site.name, locale: "bn_BD", type: "website" },
};

export const viewport: Viewport = { themeColor: "#C94C20" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${dmSans.variable} ${hind.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
