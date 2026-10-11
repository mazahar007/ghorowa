import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getCustomerId } from "./auth";

export type CustomerProfile = {
  id: number;
  name: string;
  phone: string;
  address: string;
  zone: "inside" | "outside";
};

/** লগইন করা কাস্টমার (না থাকলে null)। কুকি পড়ে, তাই <Suspense>-এর ভেতরে ব্যবহার করুন। */
export async function getCurrentCustomer(): Promise<CustomerProfile | null> {
  const id = await getCustomerId();
  if (!id) return null;
  const [c] = await db
    .select({
      id: schema.customers.id,
      name: schema.customers.name,
      phone: schema.customers.phone,
      address: schema.customers.address,
      zone: schema.customers.zone,
    })
    .from(schema.customers)
    .where(eq(schema.customers.id, id));
  return c ? { ...c, zone: c.zone === "outside" ? "outside" : "inside" } : null;
}
