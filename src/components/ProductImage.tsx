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
}: {
  product: Pick<Product, "images" | "name">;
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
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
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream text-muted ${className}`}>
      <ShirtIcon size={44} strokeWidth={1.5} />
      <span className="text-xs">ছবি শীঘ্রই</span>
    </div>
  );
}
