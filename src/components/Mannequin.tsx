"use client";

import { useId } from "react";

/**
 * চোখ-মুখ ছাড়া ম্যানিকিন, যার গায়ে পণ্যের ছবি বসিয়ে "পরলে কেমন দেখায়" দেখানো হয়।
 * সাদা বা স্বচ্ছ ব্যাকগ্রাউন্ডের ছবিতে সবচেয়ে ভালো মেলে (সাদা ব্যাকগ্রাউন্ড কেটে বাদ যায়)।
 */

export type Body = "baby" | "kid" | "woman" | "man";
export type Side = "front" | "back";

export const bodies: { id: Body; label: string }[] = [
  { id: "baby", label: "শিশু" },
  { id: "kid", label: "বাচ্চা" },
  { id: "woman", label: "মহিলা" },
  { id: "man", label: "পুরুষ" },
];

type Shape = {
  head: number; // head radius
  shoulder: number; // half widths
  waist: number;
  hip: number;
  torso: number; // shoulder → hip
  leg: number;
  arm: number;
  limb: number; // arm thickness
  hair: "none" | "short" | "long";
};

const shapes: Record<Body, Shape> = {
  baby: { head: 30, shoulder: 34, waist: 33, hip: 31, torso: 78, leg: 72, arm: 66, limb: 17, hair: "none" },
  kid: { head: 24, shoulder: 36, waist: 30, hip: 30, torso: 100, leg: 128, arm: 98, limb: 13, hair: "short" },
  woman: { head: 20, shoulder: 39, waist: 26, hip: 39, torso: 122, leg: 172, arm: 132, limb: 11, hair: "long" },
  man: { head: 21, shoulder: 49, waist: 37, hip: 38, torso: 128, leg: 168, arm: 138, limb: 14, hair: "short" },
};

const GROUND = 440;

export function Mannequin({ body, side, garment }: { body: Body; side: Side; garment?: string }) {
  const s = shapes[body];
  const hipY = GROUND - s.leg;
  const shoulderY = hipY - s.torso;
  const neckLen = s.head * 0.45;
  const headCy = shoulderY - neckLen - s.head * 0.8;
  const top = headCy - s.head - 14;
  const neckW = s.head * 0.36;

  const L = (dx: number) => 100 - dx;
  const R = (dx: number) => 100 + dx;
  const torso = [
    `M ${L(s.shoulder)} ${shoulderY + 8}`,
    `Q ${L(s.shoulder)} ${shoulderY} ${L(s.shoulder - 12)} ${shoulderY - 2}`,
    `L ${R(s.shoulder - 12)} ${shoulderY - 2}`,
    `Q ${R(s.shoulder)} ${shoulderY} ${R(s.shoulder)} ${shoulderY + 8}`,
    `C ${R(s.shoulder)} ${shoulderY + s.torso * 0.35} ${R(s.waist)} ${shoulderY + s.torso * 0.45} ${R(s.waist)} ${shoulderY + s.torso * 0.62}`,
    `C ${R(s.waist)} ${shoulderY + s.torso * 0.8} ${R(s.hip)} ${hipY - s.torso * 0.12} ${R(s.hip)} ${hipY}`,
    `L ${L(s.hip)} ${hipY}`,
    `C ${L(s.hip)} ${hipY - s.torso * 0.12} ${L(s.waist)} ${shoulderY + s.torso * 0.8} ${L(s.waist)} ${shoulderY + s.torso * 0.62}`,
    `C ${L(s.waist)} ${shoulderY + s.torso * 0.45} ${L(s.shoulder)} ${shoulderY + s.torso * 0.35} ${L(s.shoulder)} ${shoulderY + 8}`,
    "Z",
  ].join(" ");

  const spread = s.arm * 0.16;
  const legX = s.hip * 0.48;
  const legW = s.limb * 1.45;

  // the photo sits from just under the collar, a bit wider than the shoulders so sleeves land on the arms
  const gw = s.shoulder * 2 * 2;
  const gx = 100 - gw / 2;
  const gy = shoulderY - s.head * 0.55;
  const gh = gw * 1.25;

  const hairColor = "#5b4636";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const skin = `skin${uid}`;
  const cutout = `cutout${uid}`;

  return (
    <svg viewBox={`0 ${top} 200 ${GROUND + 8 - top}`} className="h-full w-full" role="img" aria-label="ম্যানিকিন">
      <defs>
        <linearGradient id={skin} x1="0" x2="1">
          <stop offset="0" stopColor="#d9c8b2" />
          <stop offset="0.45" stopColor="#efe4d6" />
          <stop offset="1" stopColor="#d4c2aa" />
        </linearGradient>
        {/* turns a pure-white photo background transparent (alpha = 60 − 20·(R+G+B)), keeping any PNG transparency;
            shaded white fabric stays solid because it is never pure white */}
        <filter id={cutout} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -20 -20 -20 0 60" result="keyed" />
          <feComposite in="keyed" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx="100" cy={GROUND + 2} rx={s.hip * 1.5} ry="5" fill="#2b201b" opacity="0.12" />

      {/* long hair falls behind the shoulders */}
      {s.hair === "long" && (
        <path
          d={`M ${L(s.head * 1.05)} ${headCy} Q ${L(s.head * 1.25)} ${shoulderY + s.torso * 0.25} ${L(s.head * 0.9)} ${shoulderY + s.torso * 0.3} L ${R(s.head * 0.9)} ${shoulderY + s.torso * 0.3} Q ${R(s.head * 1.25)} ${shoulderY + s.torso * 0.25} ${R(s.head * 1.05)} ${headCy} Z`}
          fill={hairColor}
        />
      )}

      <g fill={`url(#${skin})`} stroke={`url(#${skin})`} strokeLinecap="round">
        {/* legs */}
        <path d={`M ${L(legX)} ${hipY - 6} L ${L(legX + 2)} ${GROUND - legW / 2}`} strokeWidth={legW} />
        <path d={`M ${R(legX)} ${hipY - 6} L ${R(legX + 2)} ${GROUND - legW / 2}`} strokeWidth={legW} />
        {/* arms */}
        <path d={`M ${L(s.shoulder - s.limb * 0.5)} ${shoulderY + s.limb * 0.4} L ${L(s.shoulder + spread)} ${shoulderY + s.arm}`} strokeWidth={s.limb} />
        <path d={`M ${R(s.shoulder - s.limb * 0.5)} ${shoulderY + s.limb * 0.4} L ${R(s.shoulder + spread)} ${shoulderY + s.arm}`} strokeWidth={s.limb} />
        {/* neck, torso, head — no face on purpose */}
        <rect x={100 - neckW} y={headCy + s.head * 0.6} width={neckW * 2} height={neckLen + s.head * 0.5} stroke="none" />
        <path d={torso} stroke="none" />
        <ellipse cx="100" cy={headCy} rx={s.head * 0.84} ry={s.head} stroke="none" />
      </g>

      {/* hair: a cap from the front, the whole head from behind */}
      {s.hair !== "none" && (
        <path
          d={
            side === "back"
              ? `M ${L(s.head * 0.86)} ${headCy + s.head * 0.15} A ${s.head * 0.86} ${s.head * 1.02} 0 1 1 ${R(s.head * 0.86)} ${headCy + s.head * 0.15} Q 100 ${headCy + s.head * (s.hair === "long" ? 1.2 : 0.75)} ${L(s.head * 0.86)} ${headCy + s.head * 0.15} Z`
              : `M ${L(s.head * 0.86)} ${headCy - s.head * 0.05} A ${s.head * 0.86} ${s.head * 1.02} 0 0 1 ${R(s.head * 0.86)} ${headCy - s.head * 0.05} Q 100 ${headCy - s.head * 0.62} ${L(s.head * 0.86)} ${headCy - s.head * 0.05} Z`
          }
          fill={hairColor}
        />
      )}

      {garment && (
        <image
          href={garment}
          x={gx}
          y={gy}
          width={gw}
          height={gh}
          preserveAspectRatio="xMidYMin meet"
          filter={`url(#${cutout})`}
        />
      )}
    </svg>
  );
}

/** পণ্যের বয়স/লিঙ্গ দেখে কোন শরীরে আগে দেখাবে। */
export function defaultBody(product: { gender: string; ageGroups: string[] }): Body {
  if (product.gender === "baby" || (product.ageGroups.length > 0 && product.ageGroups.every((a) => a === "0-12m"))) return "baby";
  return "kid";
}
