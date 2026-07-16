CREATE TABLE "sss_global_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"site_title" text DEFAULT 'StarSuperScare Marketplace',
	"site_description" text,
	"favicon_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sss_refunds" ADD COLUMN "proof_image_url" text;