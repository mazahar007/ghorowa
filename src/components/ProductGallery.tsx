"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/types";
import { toBn } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { HangerStack, StageProgress } from "./HangerStack";
import { ZoomPan } from "./ZoomPan";
import { Segmented } from "./Segmented";
import { bodies, defaultBody, Mannequin, type Body, type Side } from "./Mannequin";
import { ChevronIcon, CloseIcon, TurnIcon, ZoomIcon } from "./icons";

/** প্রথম ছবি সামনের দিক, দ্বিতীয় ছবি পেছনের দিক (অ্যাডমিনে এভাবেই সাজাতে বলা আছে)। */
function sideOf(i: number): string | null {
  return i === 0 ? "সামনে" : i === 1 ? "পেছনে" : null;
}

/** পুরো স্ক্রিনে ছবি — জুম ইন/আউট, টেনে সরানো, সামনে/পেছনে বদলানো। */
function ZoomViewer({ product, start, onClose }: { product: Product; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const n = product.images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => (x + 1) % n);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [n, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${product.name} — বড় করে দেখুন`} className="studio-wall fixed inset-0 z-[70] flex animate-[slide-up_.25s_ease-out] flex-col">
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
        <p className="min-w-0 truncate font-bangla font-bold">
          {product.name} <span className="font-normal text-muted">· {sideOf(i) ?? `ছবি ${toBn(i + 1)}`}</span>
        </p>
        <button type="button" aria-label="বন্ধ করুন" onClick={onClose} className="glass-card flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
          <CloseIcon />
        </button>
      </div>

      <ZoomPan key={i} fullscreen className="relative flex-1">
        <div className="relative h-full w-full">
          <Image src={product.images[i]} alt={product.name} fill sizes="100vw" draggable={false} className="object-contain" priority />
        </div>
      </ZoomPan>

      {n > 1 && (
        <div className="flex items-center justify-center gap-2 p-3 sm:p-4">
          <button type="button" aria-label="আগের ছবি" onClick={() => setI((i - 1 + n) % n)} className="glass-card flex h-11 w-11 items-center justify-center rounded-full">
            <ChevronIcon dir="left" />
          </button>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((src, k) => (
              <button
                key={src}
                type="button"
                aria-label={sideOf(k) ?? `ছবি ${toBn(k + 1)}`}
                aria-current={k === i}
                onClick={() => setI(k)}
                className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-ink" : "border-transparent opacity-60"}`}
              >
                <Image src={src} alt="" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
          <button type="button" aria-label="পরের ছবি" onClick={() => setI((i + 1) % n)} className="glass-card flex h-11 w-11 items-center justify-center rounded-full">
            <ChevronIcon />
          </button>
        </div>
      )}
    </div>
  );
}

/** ম্যানিকিনের গায়ে পণ্য — শরীরের ধরন বেছে নিন, সামনে/পেছনে ঘুরিয়ে দেখুন, জুম করুন। */
function TryOn({ product }: { product: Product }) {
  const [body, setBody] = useState<Body>(() => defaultBody(product));
  const [side, setSide] = useState<Side>("front");
  const hasBack = product.images.length > 1;
  const garment = side === "back" && hasBack ? product.images[1] : product.images[0];

  return (
    <div className="relative h-[460px] overflow-hidden rounded-[28px] sm:h-[580px]">
      <ZoomPan className="absolute inset-0">
        <div className="studio-wall h-full w-full px-6 pb-16 pt-16">
          <div key={`${body}-${side}`} className="h-full w-full animate-[turn_.55s_cubic-bezier(0.22,1,0.36,1)]">
            <Mannequin body={body} side={side} garment={garment} />
          </div>
        </div>
      </ZoomPan>

      <div className="absolute left-3 right-3 top-3 z-10 flex justify-center">
        <Segmented label="কার গায়ে দেখবেন" value={body} onChange={setBody} options={bodies} />
      </div>

      <div className="absolute bottom-3 left-3 z-10">
        <button
          type="button"
          onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
          className="glass-card flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold"
        >
          <TurnIcon size={18} /> {side === "front" ? "পেছনে ঘুরান" : "সামনে ঘুরান"}
        </button>
      </div>

      {!product.images[0] ? (
        <p className="absolute inset-x-0 top-16 z-10 text-center text-sm text-muted">ছবি এলে এখানে পরিয়ে দেখানো হবে</p>
      ) : (
        side === "back" && !hasBack && (
          <p className="absolute inset-x-0 top-16 z-10 text-center text-xs text-muted">পেছনের ছবি নেই — সামনের ছবিই দেখানো হচ্ছে</p>
        )
      )}
    </div>
  );
}

/** প্রোডাক্ট পেজের শোরুম স্টেজ: ছবি (রেলে ঝোলানো, জুম করা যায়) আর "পরলে কেমন" ম্যানিকিন ভিউ। */
export function ProductGallery({ product }: { product: Product }) {
  const [mode, setMode] = useState<"photos" | "tryon">("photos");
  const [active, setActive] = useState(0);
  const [zoomAt, setZoomAt] = useState<number | null>(null);
  const count = Math.max(product.images.length, 1);
  const hasImages = product.images.length > 0;
  const label = (i: number) => sideOf(i) ?? `ছবি ${toBn(i + 1)}`;

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-40 lg:self-start">
      <div className="flex">
        <Segmented
          label="কীভাবে দেখবেন"
          value={mode}
          onChange={setMode}
          options={[
            { id: "photos", label: "ছবি" },
            { id: "tryon", label: "পরলে কেমন দেখায়" },
          ]}
        />
      </div>

      {mode === "photos" ? (
        <>
          <div className="studio-wall relative overflow-hidden rounded-[28px]">
            <HangerStack
              count={count}
              active={active}
              onChange={setActive}
              itemLabel={label}
              className="h-[460px] sm:h-[580px]"
              renderItem={(i, isActive) =>
                hasImages && isActive ? (
                  <button type="button" aria-label={`${label(i)} — বড় করে দেখুন`} onClick={() => setZoomAt(i)} className="relative block h-full w-full cursor-zoom-in">
                    <ProductImage product={product} index={i} stage sizes="(max-width: 1024px) 70vw, 420px" priority={i === 0} />
                  </button>
                ) : (
                  <div className="relative h-full w-full">
                    <ProductImage product={product} index={i} stage sizes="(max-width: 1024px) 70vw, 420px" />
                  </div>
                )
              }
            />
            {product.images.length > 1 && (
              <div className="absolute left-3 top-3 z-40">
                <Segmented
                  label="কোন দিক দেখবেন"
                  value={active === 1 ? "back" : active === 0 ? "front" : "other"}
                  onChange={(v) => setActive(v === "back" ? 1 : 0)}
                  options={[
                    { id: "front", label: "সামনে" },
                    { id: "back", label: "পেছনে" },
                  ]}
                />
              </div>
            )}
            {hasImages && (
              <button type="button" aria-label="বড় করে দেখুন" onClick={() => setZoomAt(active)} className="glass-card absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-full">
                <ZoomIcon size={20} />
              </button>
            )}
            <div className="absolute bottom-2 left-4 z-40">
              <StageProgress count={count} active={active} onChange={setActive} label={label} />
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={label(i)}
                  aria-pressed={active === i}
                  onClick={() => setActive(i)}
                  className={`studio-wall relative aspect-square overflow-hidden rounded-xl border-2 transition ${active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <ProductImage product={product} index={i} stage sizes="120px" />
                  {sideOf(i) && <span className="absolute inset-x-1 bottom-1 rounded bg-paper/90 text-center text-[11px] font-bold">{sideOf(i)}</span>}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <TryOn product={product} />
      )}

      {/* portalled: the sticky gallery column would otherwise trap it under the site header */}
      {zoomAt !== null && createPortal(<ZoomViewer product={product} start={zoomAt} onClose={() => setZoomAt(null)} />, document.body)}
    </div>
  );
}
