import Image from "next/image";
import type { Product } from "@/data/catalog";
import { ShirtIcon } from "./icons";

/** পণ্যের ছবি; ছবি না থাকলে ব্র্যান্ডের রঙে একটা প্লেসহোল্ডার দেখায়। */
export function ProductImage({
  product,
  index = 0,
  sizes = "(max-width: 640px) 50vw, 280px",
  priority = false,
}: {
  product: Product;
  index?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const src = product.images[index];
  if (src) {
    return (
      <Image
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream text-muted">
      <ShirtIcon size={48} strokeWidth={1.5} />
      <span className="text-xs">ছবি শীঘ্রই</span>
    </div>
  );
}
