/**
 * supabase/setup.sql তৈরি করে — Supabase-এর SQL Editor-এ একবার পেস্ট করে চালালেই
 * টেবিল, নমুনা ডেটা আর ছবির স্টোরেজ বাকেট তৈরি হয়ে যায়।
 *   npm run db:supabase-sql
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { seedCategories, seedProducts } from "./seed-data";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const arr = (xs: string[] = []) => `ARRAY[${xs.map(q).join(", ")}]::text[]`;

const migrations = readdirSync("drizzle")
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((f) => `-- ${f}\n` + readFileSync(`drizzle/${f}`, "utf8").replaceAll("--> statement-breakpoint", ""))
  .join("\n\n");

const categorySql = seedCategories
  .map(
    (c, i) =>
      `INSERT INTO categories (slug, name, description, live, sort_order) VALUES (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${c.live}, ${i}) ON CONFLICT (slug) DO NOTHING;`,
  )
  .join("\n");

const productSql = seedProducts
  .map(
    (p) =>
      `INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT ${q(p.slug)}, ${q(p.name)}, c.id, ${q(p.gender)}, ${arr(p.ageGroups)}, ${p.price}, ${p.compareAtPrice ?? "NULL"}, ${arr(p.sizes)}, ${arr(p.colors)}, ${arr(p.images)}, ${q(p.description)}, ${arr(p.details)}, ${p.featured ?? false}, ${p.inStock}
FROM categories c WHERE c.slug = ${q(p.category)} ON CONFLICT (slug) DO NOTHING;`,
  )
  .join("\n");

const sql = `-- Ghorowa: Supabase setup (generated — do not edit by hand)
-- Supabase → SQL Editor → New query → এই পুরো ফাইল পেস্ট করে Run চাপুন। একবারই চালাতে হবে।

${migrations}

-- Sample data
${categorySql}

${productSql}

-- Public bucket for product photos
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;
`;

mkdirSync("supabase", { recursive: true });
writeFileSync("supabase/setup.sql", sql);
console.log("✓ wrote supabase/setup.sql");
