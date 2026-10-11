"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { db, schema } from "@/db";
import { endCustomerSession, getCustomerId, startCustomerSession } from "@/lib/auth";
import { normalizeBdPhone } from "@/lib/format";

export type FormState = { error?: string; ok?: string } | undefined;

const text = (fd: FormData, key: string, max = 300) => String(fd.get(key) ?? "").trim().slice(0, max);

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export async function registerCustomer(_: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name", 80);
  const phone = normalizeBdPhone(text(fd, "phone", 20));
  const password = String(fd.get("password") ?? "");
  if (name.length < 2) return { error: "আপনার নাম লিখুন।" };
  if (!phone) return { error: "সঠিক মোবাইল নম্বর লিখুন (যেমন 01712345678)।" };
  if (password.length < 6) return { error: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" };

  const [existing] = await db.select({ id: schema.customers.id }).from(schema.customers).where(eq(schema.customers.phone, phone));
  if (existing) return { error: "এই নম্বরে আগেই অ্যাকাউন্ট আছে — লগইন করুন।" };

  const [customer] = await db
    .insert(schema.customers)
    .values({ name, phone, passwordHash: await bcrypt.hash(password, 10) })
    .returning({ id: schema.customers.id });
  // আগে গেস্ট হিসেবে এই নম্বরে দেওয়া অর্ডারগুলো অ্যাকাউন্টে যুক্ত করে দিই
  await db.update(schema.orders).set({ customerId: customer.id }).where(eq(schema.orders.phone, phone));
  await startCustomerSession(customer.id);
  redirect(safeNext(text(fd, "next")));
}

export async function loginCustomer(_: FormState, fd: FormData): Promise<FormState> {
  const phone = normalizeBdPhone(text(fd, "phone", 20));
  const password = String(fd.get("password") ?? "");
  await new Promise((r) => setTimeout(r, 300));
  const [customer] = phone ? await db.select().from(schema.customers).where(eq(schema.customers.phone, phone)) : [];
  if (!customer || !(await bcrypt.compare(password, customer.passwordHash))) {
    return { error: "মোবাইল নম্বর বা পাসওয়ার্ড ভুল।" };
  }
  await startCustomerSession(customer.id);
  redirect(safeNext(text(fd, "next")));
}

export async function logoutCustomer() {
  await endCustomerSession();
  redirect("/");
}

export async function updateProfile(_: FormState, fd: FormData): Promise<FormState> {
  const id = await getCustomerId();
  if (!id) redirect("/account/login");
  const name = text(fd, "name", 80);
  const address = text(fd, "address", 300);
  const zone = fd.get("zone") === "outside" ? "outside" : "inside";
  if (name.length < 2) return { error: "আপনার নাম লিখুন।" };
  await db.update(schema.customers).set({ name, address, zone }).where(eq(schema.customers.id, id));
  refresh();
  return { ok: "সেভ হয়েছে — পরের অর্ডারে ঠিকানা আপনা-আপনি বসে যাবে।" };
}
