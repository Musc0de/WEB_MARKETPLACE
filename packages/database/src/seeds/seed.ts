import { db } from '../db.ts';
import * as schema from '../schema/index.ts';
import { getUtcTimestamp } from '../helpers.ts';
import { config } from 'dotenv';
import * as path from 'node:path';
config({ path: path.resolve(Deno.cwd(), '../../.env') }); // Or run from root
import { hashPassword } from '@starsuperscare/auth-pkg';

async function runSeed() {
  console.log('🌱 Seeding roles...');
  const insertedRoles = await db.insert(schema.roles).values([
    {
      name: 'Super Administrator',
      slug: 'superadmin',
      description: 'Full access to the system',
      isSystem: true,
    },
    { name: 'Administrator', slug: 'admin', description: 'Access to admin panel', isSystem: false },
    { name: 'Customer', slug: 'customer', description: 'Regular customer', isSystem: true },
  ]).onConflictDoNothing().returning();

  console.log(`✅ Inserted ${insertedRoles.length} roles.`);

  console.log('🌱 Seeding dummy users with password "waras123"...');

  const testUser = await db.insert(schema.users).values({
    usernameDisplay: 'testuser',
    usernameNormalized: 'testuser',
    emailDisplay: 'test@waras.com',
    emailNormalized: 'test@waras.com',
    status: 'active',
    emailVerifiedAt: getUtcTimestamp(),
  }).onConflictDoNothing().returning();

  if (testUser.length > 0) {
    await db.insert(schema.passwordCredentials).values({
      userId: testUser[0].id,
      passwordHash: await hashPassword('waras123'),
    }).onConflictDoNothing();
    console.log(`✅ Inserted test user.`);
  } else {
    console.log(`⚠️ Test user already exists.`);
  }

  console.log('🌱 Seeding catalog data...');
  const store = await db.insert(schema.stores).values({
    name: 'Waras Store',
    slug: 'waras-store',
  }).onConflictDoNothing().returning();

  const brand = await db.insert(schema.brands).values({
    name: 'SuperBrand',
    slug: 'superbrand',
  }).onConflictDoNothing().returning();

  const category = await db.insert(schema.categories).values({
    name: 'Electronics',
    slug: 'electronics',
    seoTitle: 'Buy Electronics',
    seoDescription: 'Best electronics',
  }).onConflictDoNothing().returning();

  const product = await db.insert(schema.products).values({
    storeId: store.length ? store[0].id : (await db.query.stores.findFirst())!.id,
    brandId: brand.length ? brand[0].id : (await db.query.brands.findFirst())!.id,
    name: 'Super Phone',
    slug: 'super-phone',
    type: 'physical',
    status: 'active',
  }).onConflictDoNothing().returning();

  if (product.length > 0 && category.length > 0) {
    await db.insert(schema.productCategories).values({
      productId: product[0].id,
      categoryId: category[0].id,
    }).onConflictDoNothing();
  }

  const variant = await db.insert(schema.productVariants).values({
    productId: product.length ? product[0].id : (await db.query.products.findFirst())!.id,
    sku: 'SP-001',
    price: 15000000,
    comparePrice: 16000000,
  }).onConflictDoNothing().returning();

  console.log('🌱 Seeding inventory...');
  const warehouse = await db.insert(schema.warehouses).values({
    storeId: store.length ? store[0].id : (await db.query.stores.findFirst())!.id,
    name: 'Main Warehouse',
  }).onConflictDoNothing().returning();

  await db.insert(schema.inventoryLevels).values({
    variantId: variant.length ? variant[0].id : (await db.query.productVariants.findFirst())!.id,
    warehouseId: warehouse.length ? warehouse[0].id : (await db.query.warehouses.findFirst())!.id,
    available: 50,
  }).onConflictDoNothing();

  console.log('🌱 Seeding support tickets...');
  if (testUser.length > 0) {
    const ticket = await db.insert(schema.supportTickets).values({
      userId: testUser[0].id,
      subject: 'Help with my order',
      status: 'open',
      priority: 'high',
    }).onConflictDoNothing().returning();

    if (ticket.length > 0) {
      await db.insert(schema.supportMessages).values({
        ticketId: ticket[0].id,
        senderId: testUser[0].id,
        content: 'I need help with my recent Super Phone order.',
      }).onConflictDoNothing();
    }
  }

  console.log(`✅ Inserted catalog and inventory.`);
}

if (import.meta.main) {
  runSeed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    Deno.exit(1);
  });
}
