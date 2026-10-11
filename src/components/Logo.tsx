import Image from "next/image";
import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="Ghorowa — হোম" className="flex shrink-0 items-center gap-2.5 no-underline sm:gap-3">
      <Image src="/logo.svg" alt="" width={36} height={48} priority className="h-10 w-auto sm:h-11" />
      <span className={`flex flex-col leading-none ${tone === "light" ? "text-cream" : "text-ink"}`}>
        <span className="font-brand text-lg font-medium tracking-[0.16em] sm:text-[22px] sm:tracking-[0.22em]">GHOROWA</span>
        <span className="mt-1 font-bangla text-sm">ঘরোয়া</span>
      </span>
    </Link>
  );
}
