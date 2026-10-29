import Image from "next/image";
import type { Product } from "@/lib/types";
import { ShirtIcon } from "./icons";

/** পণ্যের ছবি; ছবি না থাকলে ব্র্যান্ডের রঙে একটা প্লেসহোল্ডার দেখায়। */
export function ProductImage({
  product,
  index = 0,
  sizes = "(max-width: 640px) 50vw, 280px",
  priority = false,
  className = "",
  stage = false,
}: {
  product: Pick<Product, "images" | "name">;
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** শোরুম স্টেজে ছবি না থাকলে হালকা প্লেসহোল্ডার */
  stage?: boolean;
}) {
  const src = product.images[index];
  if (src) {
    return (
      <Image
        src={src}
        alt={index === 0 ? product.name : ""}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className={`object-cover ${className}`}
      />
    );
  }
  if (stage) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper text-brand/35 ${className}`}>
        <ShirtIcon size={96} strokeWidth={1} />
        <span className="text-sm text-muted">ছবি শীঘ্রই</span>
      </div>
    );
  }
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream text-muted ${className}`}>
      <ShirtIcon size={44} strokeWidth={1.5} />
      <span className="text-xs">ছবি শীঘ্রই</span>
    </div>
  );
}
