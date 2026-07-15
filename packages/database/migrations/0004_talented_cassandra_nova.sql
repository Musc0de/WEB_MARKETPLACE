CREATE TABLE "sss_wishlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sss_wishlists" ADD CONSTRAINT "sss_wishlists_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sss_wishlists" ADD CONSTRAINT "sss_wishlists_product_id_sss_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."sss_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "wishlist_user_product_idx" ON "sss_wishlists" USING btree ("user_id","product_id");