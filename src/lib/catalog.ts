import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import type { AgeGroup, Gender } from "./labels";
import type { Category, Product } from "./types";

/** অ্যাডমিন থেকে পণ্য/ক্যাটাগরি বদলালে এই ট্যাগ দিয়ে ক্যাশ মুছে ফেলা হয়। */
export const CATALOG_TAG = "catalog";

function toCategory(c: typeof schema.categories.$inferSelect): Category {
  return { id: c.id, slug: c.slug, name: c.name, description: c.description, live: c.live };
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");
  const rows = await db
    .select()
    .from(schema.categories)
    .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id));
  return rows.map(toCategory);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

/** সব সক্রিয় পণ্য, নতুনগুলো আগে। */
export async function getActiveProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");
  const rows = await db
    .select({ p: schema.products, c: schema.categories })
    .from(schema.products)
    .innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(eq(schema.products.active, true))
    .orderBy(desc(schema.products.createdAt), desc(schema.products.id));
  return rows.map(({ p, c }) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categorySlug: c.slug,
    categoryName: c.name,
    gender: p.gender as Gender,
    ageGroups: p.ageGroups as AgeGroup[],
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    sizes: p.sizes,
    colors: p.colors,
    images: p.images,
    description: p.description,
    details: p.details,
    featured: p.featured,
    inStock: p.inStock,
    createdAt: p.createdAt.toISOString(),
  }));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getActiveProducts()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getActiveProducts()).filter((p) => p.categorySlug === slug);
}
