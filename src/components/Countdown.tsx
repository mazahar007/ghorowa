"use client";

import { useEffect, useState } from "react";
import { toBn } from "@/lib/format";

function target(endsAt: string) {
  if (endsAt) return new Date(endsAt).getTime();
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target(endsAt) - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    { v: Math.floor(s / 3600), l: "ঘণ্টা" },
    { v: Math.floor((s % 3600) / 60), l: "মিনিট" },
    { v: s % 60, l: "সেকেন্ড" },
  ];

  return (
    <div className="flex items-center gap-1.5" aria-label="অফার শেষ হতে বাকি" role="timer">
      {parts.map((p, i) => (
        <span key={p.l} className="flex items-center gap-1.5">
          <span className="flex min-w-12 flex-col items-center rounded-lg bg-white px-2 py-1 text-ink shadow-sm">
            <span className="text-lg font-bold leading-tight tabular-nums">{left === null ? "--" : toBn(String(p.v).padStart(2, "0"))}</span>
            <span className="text-[10px] text-muted">{p.l}</span>
          </span>
          {i < 2 && <span className="font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}
