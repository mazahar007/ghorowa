import { site } from "@/config/site";

export type DeliveryZone = "inside" | "outside";

export const deliveryZoneLabels: Record<DeliveryZone, string> = {
  inside: "ঢাকা সিটির ভেতরে",
  outside: "ঢাকা সিটির বাইরে",
};

export function deliveryCharge(zone: DeliveryZone, subtotal: number): number {
  if (site.freeDeliveryFrom > 0 && subtotal >= site.freeDeliveryFrom) return 0;
  return zone === "inside" ? site.delivery.insideDhaka : site.delivery.outsideDhaka;
}
