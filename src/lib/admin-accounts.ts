import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * অ্যাডমিন অ্যাকাউন্ট ডাটাবেসে থাকে। Vercel-এর ADMIN_EMAIL / ADMIN_PASSWORD
 * "মাস্টার পাসওয়ার্ড" হিসেবে সবসময় কাজ করে — সব পথ বন্ধ হলে এটাই শেষ উপায়।
 */

// Same statements as drizzle/0002_admin_accounts.sql, so projects set up from
// supabase/setup.sql before this feature existed get the tables automatically.
const ADMIN_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS "admins" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "password_hash" text NOT NULL,
    "password_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "admins_email_unique" UNIQUE("email"))`,
  `CREATE TABLE IF NOT EXISTS "admin_reset_tokens" (
    "id" serial PRIMARY KEY NOT NULL,
    "admin_id" integer NOT NULL REFERENCES "public"."admins"("id") ON DELETE cascade,
    "token_hash" text NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "admin_reset_tokens_token_hash_unique" UNIQUE("token_hash"))`,
  `CREATE INDEX IF NOT EXISTS "admin_reset_tokens_admin_idx" ON "admin_reset_tokens" USING btree ("admin_id")`,
  `ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE "admin_reset_tokens" ENABLE ROW LEVEL SECURITY`,
];

let tablesReady: Promise<void> | null = null;
export function ensureAdminTables() {
  tablesReady ??= (async () => {
    for (const statement of ADMIN_TABLES_SQL) await db.execute(sql.raw(statement));
  })().catch((err) => {
    tablesReady = null;
    throw err;
  });
  return tablesReady;
}

const RESET_TTL_MS = 30 * 60 * 1000;
const RESET_COOLDOWN_MS = 2 * 60 * 1000;
export const MIN_ADMIN_PASSWORD = 10;

const norm = (email: string) => email.trim().toLowerCase();
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function matchesEnvMaster(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword) return false;
  return safeEqual(norm(email), norm(envEmail)) && safeEqual(password, envPassword);
}

async function findAdmin(email: string) {
  const [row] = await db.select().from(schema.admins).where(eq(schema.admins.email, norm(email)));
  return row;
}

/** The owner's account, created from ADMIN_EMAIL / ADMIN_PASSWORD the first time it is needed. */
async function ensureOwnerAccount() {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword) return undefined;
  const existing = await findAdmin(envEmail);
  if (existing) return existing;
  const [created] = await db
    .insert(schema.admins)
    .values({ email: norm(envEmail), passwordHash: await bcrypt.hash(envPassword, 10) })
    .onConflictDoNothing({ target: schema.admins.email })
    .returning();
  return created ?? (await findAdmin(envEmail));
}

export type AdminSession = { id: number; email: string; pwv: number };

const toSession = (a: typeof schema.admins.$inferSelect): AdminSession => ({
  id: a.id,
  email: a.email,
  pwv: a.passwordChangedAt.getTime(),
});

export async function verifyAdminLogin(email: string, password: string): Promise<AdminSession | null> {
  await ensureAdminTables();
  await ensureOwnerAccount();
  const admin = await findAdmin(email);
  if (admin && (await bcrypt.compare(password, admin.passwordHash))) return toSession(admin);
  // Master password from Vercel always works, so the owner can never be locked out.
  if (admin && matchesEnvMaster(email, password)) return toSession(admin);
  return null;
}

/** Re-checks a signed-in session against the database (a password change logs everyone out). */
export async function isSessionCurrent(id: number, pwv: number) {
  await ensureAdminTables();
  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.id, id));
  return Boolean(admin && admin.passwordChangedAt.getTime() === pwv);
}

export async function setAdminPassword(adminId: number, password: string) {
  const [updated] = await db
    .update(schema.admins)
    .set({ passwordHash: await bcrypt.hash(password, 10), passwordChangedAt: new Date() })
    .where(eq(schema.admins.id, adminId))
    .returning();
  await db.delete(schema.adminResetTokens).where(eq(schema.adminResetTokens.adminId, adminId));
  return toSession(updated);
}

export async function checkAdminPassword(adminId: number, password: string) {
  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.id, adminId));
  if (!admin) return false;
  return (await bcrypt.compare(password, admin.passwordHash)) || matchesEnvMaster(admin.email, password);
}

/**
 * Creates a one-time reset link for the admin with this email. Returns null (and does
 * nothing) when the email is unknown or a link was sent in the last two minutes.
 */
export async function createResetToken(email: string) {
  await ensureAdminTables();
  await ensureOwnerAccount();
  const admin = await findAdmin(email);
  if (!admin) return null;
  const [recent] = await db
    .select({ createdAt: schema.adminResetTokens.createdAt })
    .from(schema.adminResetTokens)
    .where(eq(schema.adminResetTokens.adminId, admin.id))
    .orderBy(desc(schema.adminResetTokens.createdAt))
    .limit(1);
  if (recent && Date.now() - recent.createdAt.getTime() < RESET_COOLDOWN_MS) return null;

  const token = randomBytes(32).toString("base64url");
  await db.insert(schema.adminResetTokens).values({
    adminId: admin.id,
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  return { token, email: admin.email };
}

/** Finds the admin for a still-valid, unused reset token. */
export async function findResetToken(token: string) {
  if (!token || token.length > 100) return null;
  await ensureAdminTables();
  const [row] = await db
    .select()
    .from(schema.adminResetTokens)
    .where(
      and(
        eq(schema.adminResetTokens.tokenHash, sha256(token)),
        isNull(schema.adminResetTokens.usedAt),
        gt(schema.adminResetTokens.expiresAt, new Date()),
      ),
    );
  return row ?? null;
}
