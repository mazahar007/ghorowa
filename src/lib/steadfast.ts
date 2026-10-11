import "server-only";

/**
 * Steadfast Courier API — পার্সেল বুকিং ও স্ট্যাটাস।
 * Steadfast প্যানেল → API থেকে চাবি নিয়ে দিন: STEADFAST_API_KEY, STEADFAST_SECRET_KEY
 * (STEADFAST_BASE_URL ঐচ্ছিক, ডিফল্ট https://portal.packzy.com/api/v1)
 */

const baseUrl = () => process.env.STEADFAST_BASE_URL ?? "https://portal.packzy.com/api/v1";

export function steadfastEnabled() {
  return Boolean(process.env.STEADFAST_API_KEY && process.env.STEADFAST_SECRET_KEY);
}

function headers() {
  return {
    "Api-Key": process.env.STEADFAST_API_KEY ?? "",
    "Secret-Key": process.env.STEADFAST_SECRET_KEY ?? "",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function createSteadfastParcel(o: {
  invoice: string;
  name: string;
  phone: string;
  address: string;
  codAmount: number;
  note?: string;
}) {
  const res = await fetch(`${baseUrl()}/create_order`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      invoice: o.invoice,
      recipient_name: o.name,
      recipient_phone: o.phone,
      recipient_address: o.address,
      cod_amount: o.codAmount,
      note: o.note ?? "",
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    status?: number;
    message?: string;
    errors?: Record<string, string[]>;
    consignment?: { consignment_id?: number | string; tracking_code?: string; status?: string };
  };
  if (!res.ok || data.status !== 200 || !data.consignment?.consignment_id) {
    const detail = data.errors ? Object.values(data.errors).flat().join(", ") : data.message;
    throw new Error(`Steadfast: ${detail ?? `HTTP ${res.status}`}`);
  }
  return {
    consignmentId: String(data.consignment.consignment_id),
    trackingCode: data.consignment.tracking_code ?? "",
    status: data.consignment.status ?? "in_review",
  };
}

export async function getSteadfastStatus(consignmentId: string) {
  const res = await fetch(`${baseUrl()}/status_by_cid/${encodeURIComponent(consignmentId)}`, { headers: headers() });
  const data = (await res.json().catch(() => ({}))) as { status?: number; delivery_status?: string; message?: string };
  if (!res.ok || !data.delivery_status) throw new Error(`Steadfast: ${data.message ?? `HTTP ${res.status}`}`);
  return data.delivery_status;
}

export function steadfastTrackingUrl(trackingCode: string) {
  return `https://steadfast.com.bd/t/${encodeURIComponent(trackingCode)}`;
}
