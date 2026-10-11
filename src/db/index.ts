import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { normalizeDatabaseUrl } from "./url";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

function connect() {
  const url = process.env.DATABASE_URL ? normalizeDatabaseUrl(process.env.DATABASE_URL) : "";
  if (!url) {
    throw new Error("DATABASE_URL is not set. See README → ডাটাবেস সেটআপ.");
  }
  // prepare: false is required for Supabase's transaction pooler (port 6543)
  try {
    new URL(url);
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid link. Copy the Transaction pooler string from Supabase → Connect again and put your database password in place of [YOUR-PASSWORD].",
    );
  }
  return postgres(url, { prepare: false, max: 5 });
}

const client = globalForDb.pg ?? connect();
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });
export { schema };
