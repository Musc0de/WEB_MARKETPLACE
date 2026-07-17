import { db } from './index.ts';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sss_digital_credentials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES sss_products(id) ON DELETE CASCADE,
      variant_id UUID REFERENCES sss_product_variants(id) ON DELETE CASCADE,
      encrypted_data TEXT NOT NULL,
      iv TEXT NOT NULL,
      auth_tag TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      order_item_id UUID REFERENCES sss_order_items(id) ON DELETE SET NULL,
      user_id UUID REFERENCES sss_users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Table created successfully');
  process.exit(0);
}

main();
