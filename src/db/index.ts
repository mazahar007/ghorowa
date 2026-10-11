import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See README → ডাটাবেস সেটআপ.");
  }
  // prepare: false is required for Supabase's transaction pooler (port 6543)
  return postgres(url, { prepare: false, max: 5 });
}

const client = globalForDb.pg ?? connect();
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });
export { schema };
