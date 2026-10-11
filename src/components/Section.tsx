import Link from "next/link";
import { ChevronIcon } from "./icons";

export function SectionHeader({ title, eyebrow, href, linkLabel = "সব দেখুন" }: { title: string; eyebrow?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="font-brand text-xs font-semibold tracking-[0.14em] text-brand-dark sm:text-sm">{eyebrow}</p>}
        <h2 className="font-bangla text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 rounded-full border-[1.5px] border-line-strong px-4 py-2 text-sm font-bold hover:border-ink">
          {linkLabel} <ChevronIcon size={16} />
        </Link>
      )}
    </div>
  );
}
