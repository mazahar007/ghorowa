"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/config/home";
import { ChevronIcon, ShirtIcon } from "./icons";

const themes = {
  cream: { bg: "bg-cream", text: "text-ink", hl: "text-brand", sub: "text-soft", btn: "bg-brand text-white hover:bg-brand-dark", art: "bg-brand", disc: "bg-cream text-muted" },
  brand: { bg: "bg-brand", text: "text-white", hl: "text-cream", sub: "text-cream", btn: "bg-ink text-cream hover:bg-black", art: "bg-brand-dark", disc: "bg-cream text-muted" },
  ink: { bg: "bg-ink", text: "text-white", hl: "text-[#F2A27F]", sub: "text-[#E9DCC6]", btn: "bg-brand text-white hover:bg-brand-dark", art: "bg-[#3A2A22]", disc: "bg-[#4A372D] text-[#E9DCC6]" },
};

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const next = (i + slides.length) % slides.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const el = track.current;
      if (!el) return;
      const i = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: ((i + 1) % slides.length) * el.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="অফার ও কালেকশন"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto rounded-[28px] [scrollbar-width:none]">
        {slides.map((s, i) => {
          const t = themes[s.theme];
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              className={`flex w-full shrink-0 snap-start flex-wrap ${t.bg}`}
            >
              <div className="flex flex-[1_1_380px] flex-col justify-center gap-4 px-6 py-10 sm:px-14 sm:py-14">
                <span className={`font-brand text-sm font-semibold tracking-[0.14em] ${t.hl}`}>{s.eyebrow}</span>
                <h2 className={`font-bangla text-[34px] font-bold leading-tight sm:text-6xl ${t.text}`}>
                  {s.title}
                  <br />
                  <span className={t.hl}>{s.highlight}</span>
                </h2>
                <p className={`max-w-md text-lg ${t.sub}`}>{s.subtitle}</p>
                <Link href={s.href} tabIndex={i === index ? 0 : -1} className={`mt-2 inline-flex h-13 items-center self-start rounded-xl px-7 font-bold ${t.btn}`}>
                  {s.cta}
                </Link>
              </div>
              <div className={`relative hidden min-h-[420px] flex-[1_1_380px] items-center justify-center sm:flex ${t.art}`}>
                {s.image ? (
                  <Image src={s.image} alt="" fill sizes="(max-width: 1280px) 50vw, 640px" priority={i === 0} className="object-cover" />
                ) : (
                  <div className={`flex aspect-square w-72 flex-col items-center justify-center gap-3 rounded-full ${t.disc}`}>
                    <ShirtIcon size={72} strokeWidth={1.25} />
                    <span className="text-sm">ব্যানারের ছবি এখানে</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" aria-label="আগের স্লাইড" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white lg:flex">
            <ChevronIcon dir="left" />
          </button>
          <button type="button" aria-label="পরের স্লাইড" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white lg:flex">
            <ChevronIcon />
          </button>
          <div className="mt-3 flex justify-center gap-1">
            {slides.map((_, i) => (
              <button key={i} type="button" aria-label={`স্লাইড ${i + 1}`} aria-current={i === index} onClick={() => go(i)} className="flex h-6 w-8 items-center justify-center">
                <span className={`block h-2 rounded-full transition-all ${i === index ? "w-6 bg-brand" : "w-2 bg-line-strong"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
