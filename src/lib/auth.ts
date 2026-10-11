import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const ADMIN_COOKIE = "gh_admin";
const CUSTOMER_COOKIE = "gh_customer";
const ADMIN_TTL = 60 * 60 * 12; // 12 ঘণ্টা
const CUSTOMER_TTL = 60 * 60 * 24 * 60; // ৬০ দিন

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (at least 32 characters)");
  return new TextEncoder().encode(s);
}

async function sign(payload: Record<string, unknown>, ttl: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(secret());
}

async function verify(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

async function setCookie(name: string, value: string, maxAge: number) {
  (await cookies()).set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

// ── Admin ────────────────────────────────────────────────

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** অ্যাডমিনের ইমেইল/পাসওয়ার্ড এনভায়রনমেন্ট ভেরিয়েবল থেকে মিলিয়ে দেখে। */
export function checkAdminCredentials(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword) return false;
  return safeEqual(email.trim().toLowerCase(), envEmail.trim().toLowerCase()) && safeEqual(password, envPassword);
}

export async function startAdminSession(email: string) {
  await setCookie(ADMIN_COOKIE, await sign({ role: "admin", email }, ADMIN_TTL), ADMIN_TTL);
}

export async function getAdmin(): Promise<{ email: string } | null> {
  const payload = await verify((await cookies()).get(ADMIN_COOKIE)?.value);
  return payload?.role === "admin" && typeof payload.email === "string" ? { email: payload.email } : null;
}

export async function endAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

// ── Customer ─────────────────────────────────────────────

export async function startCustomerSession(customerId: number) {
  await setCookie(CUSTOMER_COOKIE, await sign({ role: "customer", cid: customerId }, CUSTOMER_TTL), CUSTOMER_TTL);
}

export async function getCustomerId(): Promise<number | null> {
  const payload = await verify((await cookies()).get(CUSTOMER_COOKIE)?.value);
  return payload?.role === "customer" && typeof payload.cid === "number" ? payload.cid : null;
}

export async function endCustomerSession() {
  (await cookies()).delete(CUSTOMER_COOKIE);
}
