CREATE TABLE "sss_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_order_archives" (
	"id" uuid PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"archived_at" timestamp with time zone DEFAULT now() NOT NULL,
	"original_created_at" timestamp with time zone NOT NULL,
	"data_snapshot" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_outbox_archives" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"state" text NOT NULL,
	"error_details" text,
	"retry_count" integer NOT NULL,
	"archived_at" timestamp with time zone DEFAULT now() NOT NULL,
	"original_created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_tracking_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"order_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_tracking_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "sss_brands" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "sss_brands" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "sss_brands" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "sss_invoices" ADD COLUMN "pdf_object_key" text;--> statement-breakpoint
ALTER TABLE "sss_invoices" ADD COLUMN "snapshot_data" jsonb;--> statement-breakpoint
ALTER TABLE "sss_shipment_events" ADD COLUMN "external_event_id" text;--> statement-breakpoint
ALTER TABLE "sss_support_tickets" ADD COLUMN "category" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "sss_support_tickets" ADD COLUMN "order_id" uuid;--> statement-breakpoint
ALTER TABLE "sss_tokens" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "sss_tracking_tokens" ADD CONSTRAINT "sss_tracking_tokens_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_support_tickets" ADD CONSTRAINT "sss_support_tickets_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_shipment_events" ADD CONSTRAINT "sss_shipment_events_external_event_id_unique" UNIQUE("external_event_id");