import "server-only";

/**
 * bKash Tokenized Checkout (v1.2.0-beta)।
 * মার্চেন্ট অ্যাকাউন্ট থেকে পাওয়া ক্রেডেনশিয়াল এনভায়রনমেন্টে দিন:
 *   BKASH_BASE_URL  (sandbox: https://tokenized.sandbox.bka.sh/v1.2.0-beta
 *                    live:    https://tokenized.pay.bka.sh/v1.2.0-beta)
 *   BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, BKASH_PASSWORD
 */

const baseUrl = () => process.env.BKASH_BASE_URL ?? "https://tokenized.sandbox.bka.sh/v1.2.0-beta";

let cached: { token: string; expiresAt: number } | null = null;

async function grantToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) return cached.token;
  const res = await fetch(`${baseUrl()}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: process.env.BKASH_USERNAME ?? "",
      password: process.env.BKASH_PASSWORD ?? "",
    },
    body: JSON.stringify({ app_key: process.env.BKASH_APP_KEY, app_secret: process.env.BKASH_APP_SECRET }),
  });
  const data = (await res.json()) as { id_token?: string; expires_in?: number; statusMessage?: string };
  if (!res.ok || !data.id_token) throw new Error(`bKash grant token failed: ${data.statusMessage ?? res.status}`);
  // renew a few minutes before bKash's expiry (usually 3600s)
  cached = { token: data.id_token, expiresAt: Date.now() + ((data.expires_in ?? 3600) - 300) * 1000 };
  return data.id_token;
}

async function call<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const token = await grantToken();
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": process.env.BKASH_APP_KEY ?? "",
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

export async function createBkashPayment(opts: { amount: number; invoice: string; payerReference: string; callbackURL: string }) {
  const data = await call<{ paymentID?: string; bkashURL?: string; statusCode?: string; statusMessage?: string }>(
    "/tokenized/checkout/create",
    {
      mode: "0011",
      payerReference: opts.payerReference,
      callbackURL: opts.callbackURL,
      amount: opts.amount.toFixed(2),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: opts.invoice,
    },
  );
  if (!data.paymentID || !data.bkashURL) throw new Error(`bKash create failed: ${data.statusMessage ?? "unknown"}`);
  return { paymentID: data.paymentID, bkashURL: data.bkashURL };
}

export async function executeBkashPayment(paymentID: string) {
  const data = await call<{
    transactionStatus?: string;
    trxID?: string;
    customerMsisdn?: string;
    amount?: string;
    merchantInvoiceNumber?: string;
    statusMessage?: string;
  }>("/tokenized/checkout/execute", { paymentID });
  return data;
}

export async function queryBkashPayment(paymentID: string) {
  return call<{ transactionStatus?: string; trxID?: string; customerMsisdn?: string; amount?: string; merchantInvoiceNumber?: string }>(
    "/tokenized/checkout/payment/status",
    { paymentID },
  );
}
