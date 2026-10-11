/**
 * ডাটাবেস তৈরি/আপডেট করে, আর প্রথমবার নমুনা ক্যাটাগরি ও পণ্য ঢোকায়।
 *   DATABASE_URL=... npm run db:setup
 * বারবার চালালেও ক্ষতি নেই — আগে থেকে পণ্য থাকলে নমুনা পণ্য আর ঢোকায় না।
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { count } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { seedCategories, seedProducts } from "./seed-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: false, max: 1 });
  const db = drizzle(client, { schema });

  console.log("→ Running migrations…");
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("→ Seeding categories…");
  await db
    .insert(schema.categories)
    .values(seedCategories.map((c, i) => ({ ...c, sortOrder: i })))
    .onConflictDoNothing({ target: schema.categories.slug });

  const [{ n }] = await db.select({ n: count() }).from(schema.products);
  if (n === 0) {
    console.log("→ Seeding sample products…");
    const cats = await db.select().from(schema.categories);
    const idBySlug = new Map(cats.map((c) => [c.slug, c.id]));
    await db.insert(schema.products).values(
      seedProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        categoryId: idBySlug.get(p.category)!,
        gender: p.gender,
        ageGroups: p.ageGroups,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        sizes: p.sizes,
        colors: p.colors ?? [],
        images: p.images,
        description: p.description,
        details: p.details,
        featured: p.featured ?? false,
        inStock: p.inStock,
      })),
    );
  } else {
    console.log(`→ ${n} products already exist, skipping sample products.`);
  }

  await client.end();
  console.log("✓ Database ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
