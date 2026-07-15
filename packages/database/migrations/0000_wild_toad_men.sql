CREATE TABLE "sss_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text DEFAULT 'shipping' NOT NULL,
	"label" text,
	"recipient_name" text NOT NULL,
	"phone" text NOT NULL,
	"address_line1" text NOT NULL,
	"address_line2" text,
	"district" text,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'ID' NOT NULL,
	"is_primary_shipping" boolean DEFAULT false,
	"is_primary_billing" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_type" text NOT NULL,
	"reference_id" uuid NOT NULL,
	"object_key" text NOT NULL,
	"file_name" text,
	"mime_type" text,
	"size_bytes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sss_cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"selected" integer DEFAULT 1 NOT NULL,
	"save_for_later" integer DEFAULT 0 NOT NULL,
	"price_observation" bigint,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"guest_token_hash" text,
	"status" text DEFAULT 'active' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sss_customer_payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_token" text NOT NULL,
	"display_metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_digital_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"object_key" text NOT NULL,
	"version" text,
	"checksum" text,
	"download_limit" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_digital_entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"download_limit" integer,
	"expires_at" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_idempotency_keys" (
	"key" text PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"response" jsonb,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_inventory_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"available" integer DEFAULT 0 NOT NULL,
	"reserved" integer DEFAULT 0 NOT NULL,
	"damaged" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "available_check" CHECK ("sss_inventory_levels"."available" >= 0),
	CONSTRAINT "reserved_check" CHECK ("sss_inventory_levels"."reserved" >= 0),
	CONSTRAINT "damaged_check" CHECK ("sss_inventory_levels"."damaged" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sss_inventory_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"type" text NOT NULL,
	"reference_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_inventory_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"user_id" uuid,
	"quantity" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" text NOT NULL,
	"order_id" uuid NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" timestamp with time zone,
	"status" text DEFAULT 'unpaid' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "sss_job_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"job_type" text NOT NULL,
	"status" text NOT NULL,
	"error_details" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sss_login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"is_success" boolean DEFAULT false NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_notification_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_message_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"error_details" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"action_url" text,
	"data_json" jsonb,
	"dedupe_key" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_notifications_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
CREATE TABLE "sss_order_addresses" (
	"order_id" uuid PRIMARY KEY NOT NULL,
	"shipping_snapshot" jsonb NOT NULL,
	"billing_snapshot" jsonb
);
--> statement-breakpoint
CREATE TABLE "sss_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price_snapshot" bigint NOT NULL,
	"product_name_snapshot" text NOT NULL,
	"variant_sku_snapshot" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"idempotency_key" text,
	"user_id" uuid,
	"email_snapshot" text NOT NULL,
	"total_amount" bigint NOT NULL,
	"subtotal_amount" bigint NOT NULL,
	"discount_amount" bigint DEFAULT 0 NOT NULL,
	"shipping_amount" bigint DEFAULT 0 NOT NULL,
	"tax_amount" bigint DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "sss_orders_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "sss_outbox_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"error_details" text,
	"retry_count" text DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sss_password_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"password_hash" text NOT NULL,
	"password_changed_at" timestamp with time zone DEFAULT now(),
	"hash_version" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "sss_payment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"provider_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_payment_events_provider_event_id_unique" UNIQUE("provider_event_id")
);
--> statement-breakpoint
CREATE TABLE "sss_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_transaction_id" text,
	"amount" bigint NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_payments_provider_transaction_id_unique" UNIQUE("provider_transaction_id")
);
--> statement-breakpoint
CREATE TABLE "sss_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_product_categories" (
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"object_key" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_product_rating_stats" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"average_rating" integer DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_product_sales_stats" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"gross_sold" integer DEFAULT 0 NOT NULL,
	"refunded" integer DEFAULT 0 NOT NULL,
	"net_sold" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" text NOT NULL,
	"option_values" jsonb,
	"price" bigint NOT NULL,
	"compare_price" bigint,
	"weight" integer,
	"dimension" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_product_variants_sku_unique" UNIQUE("sku"),
	CONSTRAINT "price_check" CHECK ("sss_product_variants"."price" >= 0),
	CONSTRAINT "compare_price_check" CHECK ("sss_product_variants"."compare_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sss_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"brand_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"purchase_limit" integer DEFAULT 0 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sss_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"return_id" uuid,
	"amount" bigint NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"provider_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_return_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"reason_detail" text,
	"condition" text
);
--> statement-breakpoint
CREATE TABLE "sss_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolution" text NOT NULL,
	"tracking_number" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"is_verified_purchase" integer DEFAULT 1 NOT NULL,
	"title" text,
	"content" text,
	"moderation_status" text DEFAULT 'pending' NOT NULL,
	"seller_response" text,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_roles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sss_security_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"event" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token_hash" text NOT NULL,
	"user_agent" text,
	"ip_hash" text,
	"last_seen_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_sessions_session_token_hash_unique" UNIQUE("session_token_hash")
);
--> statement-breakpoint
CREATE TABLE "sss_shipment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"status" text NOT NULL,
	"location" text,
	"description" text,
	"event_time" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"carrier" text NOT NULL,
	"tracking_number" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sss_support_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"sender_id" uuid,
	"content" text NOT NULL,
	"is_internal" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_system_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" text NOT NULL,
	"actor_id" uuid,
	"changes" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "sss_user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"phone" text,
	"avatar_object_key" text,
	"locale" text DEFAULT 'id-ID',
	"timezone" text DEFAULT 'Asia/Jakarta'
);
--> statement-breakpoint
CREATE TABLE "sss_user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username_display" text NOT NULL,
	"username_normalized" text NOT NULL,
	"email_display" text NOT NULL,
	"email_normalized" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_users_username_normalized_unique" UNIQUE("username_normalized"),
	CONSTRAINT "sss_users_email_normalized_unique" UNIQUE("email_normalized")
);
--> statement-breakpoint
CREATE TABLE "sss_variant_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"price" bigint NOT NULL,
	"compare_at_price" bigint,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "variant_price_check" CHECK ("sss_variant_prices"."price" >= 0),
	CONSTRAINT "variant_compare_price_check" CHECK ("sss_variant_prices"."compare_at_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sss_voucher_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voucher_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"discount_applied" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sss_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_amount" bigint NOT NULL,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_to" timestamp with time zone,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sss_vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "sss_warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sss_addresses" ADD CONSTRAINT "sss_addresses_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_cart_items" ADD CONSTRAINT "sss_cart_items_cart_id_sss_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."sss_carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_cart_items" ADD CONSTRAINT "sss_cart_items_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_carts" ADD CONSTRAINT "sss_carts_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_customer_payment_methods" ADD CONSTRAINT "sss_customer_payment_methods_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_digital_assets" ADD CONSTRAINT "sss_digital_assets_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_digital_entitlements" ADD CONSTRAINT "sss_digital_entitlements_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_digital_entitlements" ADD CONSTRAINT "sss_digital_entitlements_asset_id_sss_digital_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."sss_digital_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_digital_entitlements" ADD CONSTRAINT "sss_digital_entitlements_order_item_id_sss_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."sss_order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_idempotency_keys" ADD CONSTRAINT "sss_idempotency_keys_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_inventory_levels" ADD CONSTRAINT "sss_inventory_levels_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_inventory_levels" ADD CONSTRAINT "sss_inventory_levels_warehouse_id_sss_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."sss_warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_inventory_movements" ADD CONSTRAINT "sss_inventory_movements_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_inventory_movements" ADD CONSTRAINT "sss_inventory_movements_warehouse_id_sss_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."sss_warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_inventory_reservations" ADD CONSTRAINT "sss_inventory_reservations_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_inventory_reservations" ADD CONSTRAINT "sss_inventory_reservations_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_invoices" ADD CONSTRAINT "sss_invoices_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_notification_deliveries" ADD CONSTRAINT "sss_notification_deliveries_notification_id_sss_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."sss_notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_notifications" ADD CONSTRAINT "sss_notifications_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_order_addresses" ADD CONSTRAINT "sss_order_addresses_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_order_items" ADD CONSTRAINT "sss_order_items_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_order_items" ADD CONSTRAINT "sss_order_items_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_order_items" ADD CONSTRAINT "sss_order_items_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_order_status_history" ADD CONSTRAINT "sss_order_status_history_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_orders" ADD CONSTRAINT "sss_orders_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_password_credentials" ADD CONSTRAINT "sss_password_credentials_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_payment_events" ADD CONSTRAINT "sss_payment_events_payment_id_sss_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."sss_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_payments" ADD CONSTRAINT "sss_payments_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_product_categories" ADD CONSTRAINT "sss_product_categories_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_product_categories" ADD CONSTRAINT "sss_product_categories_category_id_sss_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."sss_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_product_images" ADD CONSTRAINT "sss_product_images_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_product_rating_stats" ADD CONSTRAINT "sss_product_rating_stats_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_product_sales_stats" ADD CONSTRAINT "sss_product_sales_stats_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_product_variants" ADD CONSTRAINT "sss_product_variants_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_products" ADD CONSTRAINT "sss_products_store_id_sss_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."sss_stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_products" ADD CONSTRAINT "sss_products_brand_id_sss_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."sss_brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_refunds" ADD CONSTRAINT "sss_refunds_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_refunds" ADD CONSTRAINT "sss_refunds_return_id_sss_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "public"."sss_returns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_return_items" ADD CONSTRAINT "sss_return_items_return_id_sss_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "public"."sss_returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_return_items" ADD CONSTRAINT "sss_return_items_order_item_id_sss_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."sss_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_returns" ADD CONSTRAINT "sss_returns_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_returns" ADD CONSTRAINT "sss_returns_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_reviews" ADD CONSTRAINT "sss_reviews_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_reviews" ADD CONSTRAINT "sss_reviews_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_reviews" ADD CONSTRAINT "sss_reviews_order_item_id_sss_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."sss_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_role_permissions" ADD CONSTRAINT "sss_role_permissions_role_id_sss_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sss_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_role_permissions" ADD CONSTRAINT "sss_role_permissions_permission_id_sss_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."sss_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_security_audit_logs" ADD CONSTRAINT "sss_security_audit_logs_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_sessions" ADD CONSTRAINT "sss_sessions_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_shipment_events" ADD CONSTRAINT "sss_shipment_events_shipment_id_sss_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."sss_shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_shipments" ADD CONSTRAINT "sss_shipments_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_support_messages" ADD CONSTRAINT "sss_support_messages_ticket_id_sss_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."sss_support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_support_messages" ADD CONSTRAINT "sss_support_messages_sender_id_sss_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_support_tickets" ADD CONSTRAINT "sss_support_tickets_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_system_audit_logs" ADD CONSTRAINT "sss_system_audit_logs_actor_id_sss_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_tokens" ADD CONSTRAINT "sss_tokens_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_user_profiles" ADD CONSTRAINT "sss_user_profiles_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_user_roles" ADD CONSTRAINT "sss_user_roles_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_user_roles" ADD CONSTRAINT "sss_user_roles_role_id_sss_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sss_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_variant_prices" ADD CONSTRAINT "sss_variant_prices_variant_id_sss_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."sss_product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_voucher_redemptions" ADD CONSTRAINT "sss_voucher_redemptions_voucher_id_sss_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."sss_vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_voucher_redemptions" ADD CONSTRAINT "sss_voucher_redemptions_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_voucher_redemptions" ADD CONSTRAINT "sss_voucher_redemptions_order_id_sss_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sss_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_warehouses" ADD CONSTRAINT "sss_warehouses_store_id_sss_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."sss_stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_active_cart_idx" ON "sss_carts" USING btree ("user_id") WHERE "sss_carts"."status" = 'active';