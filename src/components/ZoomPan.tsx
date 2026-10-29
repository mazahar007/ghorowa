"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { toBn } from "@/lib/format";
import { MinusIcon, PlusIcon, ResetIcon } from "./icons";

const MIN = 1;
const MAX = 4;

type View = { s: number; x: number; y: number };

/**
 * জুম ইন/আউট: মাউস হুইল, দুই আঙুলে পিঞ্চ, ডাবল ট্যাপ বা +/− বাটন; জুম করা অবস্থায় টেনে সরানো যায়।
 * `fullscreen` হলে পুরো জায়গার স্পর্শ নিজেই সামলায়; না হলে জুম না করা পর্যন্ত পেজ স্ক্রল স্বাভাবিক থাকে।
 */
export function ZoomPan({ children, fullscreen = false, className = "relative" }: { children: ReactNode; fullscreen?: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; s: number } | null>(null);
  const lastTap = useRef(0);
  const downAt = useRef<{ x: number; y: number } | null>(null);

  // keep the zoomed picture from being dragged out of its frame
  function clamp(v: View): View {
    const el = box.current;
    const s = Math.min(MAX, Math.max(MIN, v.s));
    if (!el || s === 1) return { s, x: 0, y: 0 };
    const mx = ((s - 1) * el.clientWidth) / 2;
    const my = ((s - 1) * el.clientHeight) / 2;
    return { s, x: Math.min(mx, Math.max(-mx, v.x)), y: Math.min(my, Math.max(-my, v.y)) };
  }

  /** Zoom to `s`, keeping the point (cx, cy) — measured from the frame's centre — under the finger/cursor. */
  function zoomTo(s: number, cx = 0, cy = 0) {
    setView((v) => {
      const next = Math.min(MAX, Math.max(MIN, s));
      const k = next / v.s;
      return clamp({ s: next, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k });
    });
  }

  function fromCentre(clientX: number, clientY: number) {
    const r = box.current!.getBoundingClientRect();
    return [clientX - r.left - r.width / 2, clientY - r.top - r.height / 2] as const;
  }

  // wheel needs a non-passive listener so the page doesn't scroll while zooming
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!fullscreen && !e.ctrlKey && view.s === 1) return; // plain scroll over the inline stage still scrolls the page
      e.preventDefault();
      const [cx, cy] = fromCentre(e.clientX, e.clientY);
      zoomTo(view.s * Math.exp(-e.deltaY * 0.0025), cx, cy);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const zoomed = view.s > 1.001;

  function toggle(clientX: number, clientY: number) {
    if (zoomed) return setView({ s: 1, x: 0, y: 0 });
    const [cx, cy] = fromCentre(clientX, clientY);
    zoomTo(2.5, cx, cy);
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={box}
        className={`absolute inset-0 ${zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
        style={{ touchAction: fullscreen || zoomed ? "none" : "pan-y" }}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          downAt.current = { x: e.clientX, y: e.clientY };
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), s: view.s };
          }
        }}
        onPointerMove={(e) => {
          const prev = pointers.current.get(e.pointerId);
          if (!prev) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.current.size === 2 && pinch.current) {
            const [a, b] = [...pointers.current.values()];
            const [cx, cy] = fromCentre((a.x + b.x) / 2, (a.y + b.y) / 2);
            zoomTo((pinch.current.s * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist, cx, cy);
          } else if (zoomed) {
            setView((v) => clamp({ ...v, x: v.x + e.clientX - prev.x, y: v.y + e.clientY - prev.y }));
          }
        }}
        onPointerUp={(e) => {
          const down = downAt.current;
          pointers.current.delete(e.pointerId);
          if (pointers.current.size < 2) pinch.current = null;
          // double tap toggles zoom on touch screens (a mouse uses double click below)
          if (e.pointerType === "mouse" || !down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) return;
          const now = Date.now();
          if (now - lastTap.current < 300) {
            toggle(e.clientX, e.clientY);
            lastTap.current = 0;
          } else lastTap.current = now;
        }}
        onDoubleClick={(e) => toggle(e.clientX, e.clientY)}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId);
          pinch.current = null;
        }}
      >
        <div
          className="h-full w-full transition-transform duration-150 ease-out will-change-transform"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
        >
          {children}
        </div>
      </div>

      <div className="glass-card absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-full p-1 text-sm font-bold">
        <button type="button" aria-label="ছোট করুন" disabled={!zoomed} onClick={() => zoomTo(view.s / 1.5)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white disabled:opacity-35">
          <MinusIcon size={18} />
        </button>
        <span aria-live="polite" className="w-12 text-center tabular-nums">{toBn(Math.round(view.s * 100))}%</span>
        <button type="button" aria-label="বড় করুন" disabled={view.s >= MAX} onClick={() => zoomTo(view.s * 1.5)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white disabled:opacity-35">
          <PlusIcon size={18} />
        </button>
        {zoomed && (
          <button type="button" aria-label="আগের মাপে ফিরুন" onClick={() => setView({ s: 1, x: 0, y: 0 })} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white">
            <ResetIcon size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
