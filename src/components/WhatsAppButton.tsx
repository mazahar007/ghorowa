import { site } from "@/config/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("আসসালামু আলাইকুম, আমি একটা পণ্য সম্পর্কে জানতে চাই।")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp-এ মেসেজ পাঠান"
      className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f4e] text-white shadow-lg transition hover:scale-105 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
