"use client";

import { useRef, type ReactNode } from "react";
import { toBn } from "@/lib/format";
import { ChevronIcon } from "./icons";

/** How each item sits relative to the active one: the active piece hangs in front, earlier ones peek out behind it. */
function placement(offset: number) {
  if (offset === 0) return { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 30, filter: "none" };
  if (offset === -1) return { transform: "translateX(-30%) scale(0.86)", opacity: 0.9, zIndex: 20, filter: "brightness(0.94) saturate(0.9)" };
  if (offset === -2) return { transform: "translateX(-52%) scale(0.74)", opacity: 0.65, zIndex: 10, filter: "brightness(0.9) saturate(0.8)" };
  // the next piece waits off to the right and slides in to the front
  if (offset > 0) return { transform: "translateX(55%) scale(0.92)", opacity: 0, zIndex: 25, filter: "none" };
  return { transform: "translateX(-64%) scale(0.66)", opacity: 0, zIndex: 0, filter: "none" };
}

/** The rack wraps around, so there are always pieces hanging behind the front one. */
function rackOffset(i: number, active: number, count: number) {
  const d = (((i - active) % count) + count) % count;
  if (d === 0) return 0;
  if (count === 2 || d === count - 1) return -1;
  if (d === count - 2 && count >= 4) return -2;
  return d === 1 ? 1 : -3;
}

function Hanger() {
  return (
    <svg viewBox="0 0 120 40" aria-hidden className="absolute bottom-[calc(100%-6px)] left-1/2 h-auto w-[40%] -translate-x-1/2 text-[#b9a68f]">
      <path d="M60 22c0-4 5-4 5-9a5 5 0 0 0-10 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 22 8 36h104z" fill="#e9dccb" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * পোশাকগুলো রেলে ঝোলানো থাকে: সামনেরটা বড়, আগেরগুলো পেছনে উঁকি দেয়।
 * তীর, সোয়াইপ, কিবোর্ড বা পেছনের পোশাকে চাপ দিয়ে বদলানো যায়।
 */
export function HangerStack({
  count,
  active,
  onChange,
  renderItem,
  itemLabel,
  hangers = true,
  className = "",
}: {
  count: number;
  active: number;
  onChange: (i: number) => void;
  renderItem: (i: number, isActive: boolean) => ReactNode;
  itemLabel: (i: number) => string;
  hangers?: boolean;
  className?: string;
}) {
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);
  const go = (i: number) => onChange((i + count) % count);

  return (
    <div
      className={`relative touch-pan-y select-none ${className}`}
      onPointerDown={(e) => {
        startX.current = e.clientX;
        swiped.current = false;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) {
          swiped.current = true;
          go(active + (dx < 0 ? 1 : -1));
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      // a swipe must not also open the product it started on
      onClickCapture={(e) => {
        if (swiped.current) {
          e.preventDefault();
          e.stopPropagation();
          swiped.current = false;
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      {/* the rail */}
      {hangers && (
        <span aria-hidden className="absolute left-[8%] right-[30%] top-[5%] h-[6px] rounded-full bg-gradient-to-b from-[#d9cbb8] to-[#b9a68f] shadow-sm" />
      )}

      {/* soft floor shadow under the front piece */}
      <span aria-hidden className="absolute bottom-[9%] left-1/2 h-[5%] w-[46%] -translate-x-1/2 rounded-[50%] bg-[#2b201b]/15 blur-xl" />

      {Array.from({ length: count }, (_, i) => {
        const offset = rackOffset(i, active, count);
        const style = placement(offset);
        const isActive = offset === 0;
        const peeking = offset === -1 || offset === -2;
        return (
          <div
            key={i}
            aria-hidden={!isActive}
            inert={!isActive && !peeking}
            className="absolute bottom-[12%] left-[20%] right-[20%] top-[12%] transition-[transform,opacity,filter] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform sm:left-[27%] sm:right-[27%]"
            style={{ ...style, transformOrigin: "50% 0%", pointerEvents: isActive || peeking ? "auto" : "none" }}
          >
            {hangers && <Hanger />}
            <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-paper shadow-[0_24px_50px_-20px_rgba(43,32,27,0.45)] ring-1 ring-black/5">
              {renderItem(i, isActive)}
            </div>
            {peeking && (
              <button
                type="button"
                tabIndex={-1}
                aria-label={itemLabel(i)}
                onClick={() => go(i)}
                className="absolute inset-0 cursor-pointer"
              />
            )}
          </div>
        );
      })}

      {count > 1 && (
        <div className="glass-card absolute bottom-[1.5%] left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 text-sm font-bold">
          <button type="button" aria-label="আগেরটা" onClick={() => go(active - 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white">
            <ChevronIcon dir="left" size={18} />
          </button>
          <span aria-live="polite" className="min-w-14 text-center tabular-nums">
            {toBn(active + 1)} / {toBn(count)}
          </span>
          <button type="button" aria-label="পরেরটা" onClick={() => go(active + 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white">
            <ChevronIcon size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/** স্টেজের নিচে অগ্রগতির দাগ — কোনটা দেখছেন আর মোট কয়টা। */
export function StageProgress({ count, active, onChange, label }: { count: number; active: number; onChange: (i: number) => void; label: (i: number) => string }) {
  if (count < 2) return null;
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={label(i)}
          aria-current={i === active}
          onClick={() => onChange(i)}
          className="group flex h-8 items-center"
        >
          <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === active ? "w-10 bg-ink" : "w-5 bg-ink/20 group-hover:bg-ink/40"}`} />
        </button>
      ))}
    </div>
  );
}
