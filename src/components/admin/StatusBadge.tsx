import { orderStatusLabels, paymentStatusLabels } from "@/lib/labels";

const orderColors: Record<string, string> = {
  new: "bg-[#fde7da] text-brand-dark",
  confirmed: "bg-[#e3ecfb] text-[#1f4fa3]",
  shipped: "bg-[#efe6fb] text-[#5b2ea6]",
  delivered: "bg-[#e6f4ea] text-[#17703d]",
  cancelled: "bg-sand text-muted",
  returned: "bg-sand text-muted",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${orderColors[status] ?? "bg-sand"}`}>
      {orderStatusLabels[status] ?? status}
    </span>
  );
}

export function PaymentBadge({ status }: { status: string }) {
  const color = status === "paid" ? "text-[#17703d]" : status === "failed" ? "text-brand-dark" : "text-muted";
  return <span className={`text-xs font-bold ${color}`}>{paymentStatusLabels[status] ?? status}</span>;
}
