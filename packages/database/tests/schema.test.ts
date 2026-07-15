import { assertEquals, assertExists } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import * as schema from '../src/schema/index.ts';

Deno.test('Schema Integrity Test', () => {
  // Test that crucial schemas exist
  assertExists(schema.users, 'users schema should exist');
  assertExists(schema.roles, 'roles schema should exist');
  assertExists(schema.addresses, 'addresses schema should exist');
  assertExists(schema.loginAttempts, 'login_attempts schema should exist');
  assertExists(schema.products, 'products schema should exist');
  assertExists(schema.productVariants, 'productVariants schema should exist');
  assertExists(schema.variantPrices, 'variantPrices schema should exist');
  assertExists(schema.warehouses, 'warehouses schema should exist');
  assertExists(schema.inventoryLevels, 'inventoryLevels schema should exist');
  assertExists(schema.reviews, 'reviews schema should exist');
  assertExists(schema.carts, 'carts schema should exist');
  assertExists(schema.orders, 'orders schema should exist');
  assertExists(schema.payments, 'payments schema should exist');
  assertExists(schema.digitalAssets, 'digitalAssets schema should exist');
  assertExists(schema.shipments, 'shipments schema should exist');
  assertExists(schema.supportTickets, 'supportTickets schema should exist');
  assertExists(schema.returns, 'returns schema should exist');
  assertExists(schema.securityAuditLogs, 'securityAuditLogs schema should exist');
});

Deno.test('Security Check: Password Hash', () => {
  // Ensure that password is not stored in plaintext table definition (just checking column name)
  const columns = Object.keys(schema.passwordCredentials);
  const hasPasswordPlaintext = columns.some((c) => c.toLowerCase().includes('plaintext'));
  assertEquals(hasPasswordPlaintext, false, 'Should not have plaintext password column');
});
