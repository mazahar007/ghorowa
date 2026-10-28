-- Ghorowa: Supabase setup (generated — do not edit by hand)
-- Supabase → SQL Editor → New query → এই পুরো ফাইল পেস্ট করে Run চাপুন। একবারই চালাতে হবে।

-- 0000_init.sql
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"live" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"password_hash" text NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"zone" text DEFAULT 'inside' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_phone_unique" UNIQUE("phone")
);

CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"product_slug" text NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"color" text,
	"qty" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"line_total" integer NOT NULL
);

CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"customer_id" integer,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"zone" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"payment_method" text NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"bkash_sender" text,
	"bkash_trx_id" text,
	"bkash_payment_id" text,
	"subtotal" integer NOT NULL,
	"delivery" integer NOT NULL,
	"total" integer NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"courier" text,
	"courier_consignment_id" text,
	"courier_tracking_code" text,
	"courier_status" text,
	"admin_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_code_unique" UNIQUE("code")
);

CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category_id" integer NOT NULL,
	"gender" text DEFAULT 'unisex' NOT NULL,
	"age_groups" text[] DEFAULT '{}' NOT NULL,
	"price" integer NOT NULL,
	"compare_at_price" integer,
	"sizes" text[] DEFAULT '{}' NOT NULL,
	"colors" text[] DEFAULT '{}' NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"details" text[] DEFAULT '{}' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");
CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
CREATE INDEX "orders_phone_idx" ON "orders" USING btree ("phone");
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");

-- 0001_enable_rls.sql
-- Supabase exposes the public schema through its Data API. Enabling RLS with
-- no policies blocks that API completely; the website connects directly as the
-- database owner, which bypasses RLS.
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;


-- 0002_admin_accounts.sql
-- Written to be safe to run more than once: the site also runs it on first admin login
-- (see src/lib/admin-accounts.ts), so existing Supabase projects need no manual step.
CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "admin_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL REFERENCES "public"."admins"("id") ON DELETE cascade,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);

CREATE INDEX IF NOT EXISTS "admin_reset_tokens_admin_idx" ON "admin_reset_tokens" USING btree ("admin_id");

ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "admin_reset_tokens" ENABLE ROW LEVEL SECURITY;


-- Sample data
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('kids-fashion', 'কিডস ফ্যাশন', 'নবজাতক থেকে ১২ বছর পর্যন্ত মেয়ে ও ছেলেদের পোশাক', true, 0) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('women-fashion', 'মেয়েদের ফ্যাশন', 'শাড়ি, থ্রি-পিস, কুর্তি ও আরও অনেক কিছু', false, 1) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('men-fashion', 'ছেলেদের ফ্যাশন', 'পাঞ্জাবি, শার্ট, টি-শার্ট ও প্যান্ট', false, 2) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('toys', 'খেলনা', 'শিশুদের নিরাপদ ও শিক্ষামূলক খেলনা', false, 3) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('beauty-care', 'বিউটি ও কেয়ার', 'স্কিন কেয়ার, বেবি কেয়ার ও পার্সোনাল কেয়ার', false, 4) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('home-kitchen', 'হোম ও কিচেন', 'ঘর সাজানো ও রান্নাঘরের প্রয়োজনীয় জিনিস', false, 5) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('grocery', 'গ্রোসারি', 'খাঁটি ও নিত্যপ্রয়োজনীয় খাদ্যপণ্য', false, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (slug, name, description, live, sort_order) VALUES ('gadgets', 'গ্যাজেট', 'মোবাইল এক্সেসরিজ ও স্মার্ট গ্যাজেট', false, 7) ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'cotton-summer-frock', 'কটন সামার ফ্রক', c.id, 'girls', ARRAY['1-3y', '4-7y']::text[], 650, 850, ARRAY['2Y', '3Y', '4Y', '5Y']::text[], ARRAY['হলুদ', 'গোলাপি', 'আকাশি']::text[], ARRAY[]::text[], 'গরমে আরামদায়ক ১০০% সুতি কাপড়ের হালকা ফ্রক। প্রতিদিন পরার জন্য উপযোগী।', ARRAY['কাপড়: ১০০% কটন', 'হাত ও মেশিনে ধোয়া যায়', 'নরম সেলাই, ত্বকে আরামদায়ক']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'boys-panjabi-set', 'ছেলেদের পাঞ্জাবি সেট', c.id, 'boys', ARRAY['4-7y', '8-12y']::text[], 1250, NULL, ARRAY['3Y', '4Y', '6Y', '8Y', '10Y']::text[], ARRAY['সাদা', 'অফ-হোয়াইট', 'নেভি']::text[], ARRAY[]::text[], 'ঈদ ও উৎসবের জন্য পাঞ্জাবি ও পায়জামার সেট। সূক্ষ্ম এমব্রয়ডারি করা।', ARRAY['কাপড়: কটন ব্লেন্ড', 'সেটে আছে: পাঞ্জাবি + পায়জামা', 'শুকনো জায়গায় ইস্ত্রি করুন']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'baby-cotton-romper', 'বেবি কটন রম্পার', c.id, 'baby', ARRAY['0-12m']::text[], 450, NULL, ARRAY['0-3M', '3-6M', '6-9M', '9-12M']::text[], ARRAY['সাদা', 'হালকা সবুজ']::text[], ARRAY[]::text[], 'নবজাতকের নরম ত্বকের জন্য সুতি রম্পার। স্ন্যাপ বাটন থাকায় পরানো সহজ।', ARRAY['কাপড়: অর্গানিক কটন', 'স্ন্যাপ বাটন', 'ট্যাগ ছাড়া, ত্বকে ঘষা লাগে না']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'girls-party-dress', 'গার্লস পার্টি ড্রেস', c.id, 'girls', ARRAY['4-7y', '8-12y']::text[], 1650, 1950, ARRAY['4Y', '6Y', '8Y', '10Y']::text[], ARRAY['লাল', 'মেরুন']::text[], ARRAY[]::text[], 'জন্মদিন ও বিয়ের অনুষ্ঠানের জন্য ঘের-ওয়ালা পার্টি ড্রেস, ভেতরে নরম সুতি লাইনিং।', ARRAY['বাইরে: নেট ও সাটিন', 'ভেতরে: কটন লাইনিং', 'পেছনে চেইন']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'tshirt-shorts-set', 'টি-শার্ট ও শর্টস সেট', c.id, 'boys', ARRAY['1-3y', '4-7y']::text[], 550, 700, ARRAY['2Y', '3Y', '4Y', '6Y']::text[], ARRAY['নেভি', 'সবুজ']::text[], ARRAY[]::text[], 'খেলাধুলা ও বাসায় পরার জন্য আরামদায়ক টি-শার্ট ও শর্টসের সেট।', ARRAY['কাপড়: সিঙ্গেল জার্সি কটন', 'ইলাস্টিক কোমর', 'রং সহজে ওঠে না']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'newborn-gift-set', 'নিউবর্ন গিফট সেট', c.id, 'baby', ARRAY['0-12m']::text[], 1450, NULL, ARRAY['0-3M', '3-6M']::text[], ARRAY[]::text[], ARRAY[]::text[], 'নবজাতককে উপহার দেওয়ার জন্য ৫ পিসের সেট — রম্পার, টুপি, মোজা, বিব ও কাঁথা।', ARRAY['৫ পিস', 'গিফট বক্সে প্যাক করা', 'কাপড়: সুতি']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'kids-pajama-set', 'কিডস পায়জামা সেট', c.id, 'unisex', ARRAY['4-7y', '8-12y']::text[], 750, NULL, ARRAY['4Y', '6Y', '8Y', '10Y', '12Y']::text[], ARRAY['আকাশি', 'গোলাপি']::text[], ARRAY[]::text[], 'রাতে ঘুমানোর জন্য নরম ও ঢিলেঢালা পায়জামা সেট।', ARRAY['কাপড়: কটন জার্সি', 'ফুল হাতা', 'ইলাস্টিক কোমর']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, category_id, gender, age_groups, price, compare_at_price, sizes, colors, images, description, details, featured, in_stock)
SELECT 'boys-hoodie', 'বয়েজ হুডি', c.id, 'boys', ARRAY['4-7y', '8-12y']::text[], 950, NULL, ARRAY['5Y', '7Y', '9Y', '11Y']::text[], ARRAY['ধূসর', 'নেভি']::text[], ARRAY[]::text[], 'শীতের জন্য ভেতরে নরম ফ্লিসের হুডি, সামনে পকেট সহ।', ARRAY['কাপড়: ফ্লিস কটন', 'জিপার ছাড়া, মাথায় টুপি', 'মেশিনে ধোয়া যায়']::text[], true, true
FROM categories c WHERE c.slug = 'kids-fashion' ON CONFLICT (slug) DO NOTHING;

-- Public bucket for product photos
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;
