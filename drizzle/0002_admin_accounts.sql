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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL REFERENCES "public"."admins"("id") ON DELETE cascade,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_reset_tokens_admin_idx" ON "admin_reset_tokens" USING btree ("admin_id");
--> statement-breakpoint
ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "admin_reset_tokens" ENABLE ROW LEVEL SECURITY;
