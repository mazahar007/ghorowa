"use client";

import { useEffect } from "react";

/** মোবাইলে নিচ থেকে ওঠা শিট, বড় স্ক্রিনে মাঝখানে ডায়ালগ। */
export function Sheet({
  label,
  onClose,
  side = "bottom",
  children,
}: {
  label: string;
  onClose: () => void;
  side?: "bottom" | "right" | "left";
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const panel =
    side === "right"
      ? "right-0 top-0 h-full w-[420px] max-w-[92%] animate-[slide-in-right_.25s_ease-out]"
      : side === "left"
        ? "left-0 top-0 h-full w-80 max-w-[85%] animate-[slide-in-left_.25s_ease-out]"
        : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl animate-[slide-up_.25s_ease-out]";

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" aria-label="বন্ধ করুন" tabIndex={-1} className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={label} className={`absolute flex flex-col overflow-y-auto bg-paper p-5 shadow-2xl ${panel}`}>
        {children}
      </div>
    </div>
  );
}
