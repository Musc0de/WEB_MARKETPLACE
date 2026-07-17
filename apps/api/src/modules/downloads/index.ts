import { Hono } from 'hono';
import {
  db,
  digitalAssets,
  digitalCredentials,
  digitalEntitlements,
  orderItems,
  products,
  productVariants,
} from '@starsuperscare/database';
import { and, count, desc, eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import { decryptCredential } from '../../utils/crypto.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { page, limit } = c.req.valid('query');
      const offset = (page - 1) * limit;

      const [totalResult] = await db
        .select({ count: count() })
        .from(digitalEntitlements)
        .where(eq(digitalEntitlements.userId, user.id));

      const total = totalResult.count;

      const items = await db
        .select({
          id: digitalEntitlements.id,
          assetId: digitalEntitlements.assetId,
          orderItemId: digitalEntitlements.orderItemId,
          downloadCount: digitalEntitlements.downloadCount,
          downloadLimit: digitalEntitlements.downloadLimit,
          expiresAt: digitalEntitlements.expiresAt,
          status: digitalEntitlements.status,
          createdAt: digitalEntitlements.createdAt,
          updatedAt: digitalEntitlements.updatedAt,
          productName: products.name,
          variantName: productVariants.sku,
          version: digitalAssets.version,
        })
        .from(digitalEntitlements)
        .innerJoin(digitalAssets, eq(digitalEntitlements.assetId, digitalAssets.id))
        .innerJoin(orderItems, eq(digitalEntitlements.orderItemId, orderItems.id))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(productVariants, eq(orderItems.variantId, productVariants.id))
        .where(eq(digitalEntitlements.userId, user.id))
        .orderBy(desc(digitalEntitlements.createdAt))
        .limit(limit)
        .offset(offset);

      const rawCredentials = await db
        .select({
          id: digitalCredentials.id,
          orderItemId: digitalCredentials.orderItemId,
          status: digitalCredentials.status,
          encryptedData: digitalCredentials.encryptedData,
          iv: digitalCredentials.iv,
          authTag: digitalCredentials.authTag,
          createdAt: digitalCredentials.createdAt,
          productName: products.name,
          variantName: productVariants.sku,
        })
        .from(digitalCredentials)
        .innerJoin(products, eq(digitalCredentials.productId, products.id))
        .leftJoin(productVariants, eq(digitalCredentials.variantId, productVariants.id))
        .where(
          and(eq(digitalCredentials.userId, user.id), eq(digitalCredentials.status, 'assigned')),
        )
        .orderBy(desc(digitalCredentials.createdAt));

      const credentials = rawCredentials.map((cred) => {
        let plaintext = '';
        try {
          plaintext = decryptCredential(cred.encryptedData, cred.iv, cred.authTag);
        } catch (_e) {
          plaintext = '[Gagal mendekripsi kredensial]';
        }
        return {
          id: cred.id,
          orderItemId: cred.orderItemId,
          productName: cred.productName,
          variantName: cred.variantName,
          credentialData: plaintext,
          createdAt: cred.createdAt,
        };
      });

      return c.json({
        data: {
          entitlements: items,
          credentials,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .get('/:id/stream', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [entitlement] = await db
      .select({
        id: digitalEntitlements.id,
        downloadCount: digitalEntitlements.downloadCount,
        downloadLimit: digitalEntitlements.downloadLimit,
        expiresAt: digitalEntitlements.expiresAt,
        status: digitalEntitlements.status,
        assetObjectKey: digitalAssets.objectKey,
      })
      .from(digitalEntitlements)
      .innerJoin(digitalAssets, eq(digitalEntitlements.assetId, digitalAssets.id))
      .where(and(eq(digitalEntitlements.id, id), eq(digitalEntitlements.userId, user.id)))
      .limit(1);

    if (!entitlement) {
      throw new HTTPException(404, { message: 'Entitlement not found or unauthorized' });
    }

    if (entitlement.status !== 'active') {
      throw new HTTPException(403, { message: `Entitlement is ${entitlement.status}` });
    }

    if (entitlement.expiresAt && new Date(entitlement.expiresAt) < new Date()) {
      throw new HTTPException(403, { message: 'Entitlement has expired' });
    }

    if (
      entitlement.downloadLimit !== null && entitlement.downloadCount >= entitlement.downloadLimit
    ) {
      throw new HTTPException(403, { message: 'Download limit exceeded' });
    }

    // Increment download count
    await db
      .update(digitalEntitlements)
      .set({ downloadCount: entitlement.downloadCount + 1 })
      .where(eq(digitalEntitlements.id, entitlement.id));

    // Stream private file (mock streaming)
    // Normally you'd stream the object from S3 using the objectKey.
    // For local env, we return a mock file.

    c.header('Content-Type', 'application/octet-stream');
    c.header('Content-Disposition', `attachment; filename="${entitlement.assetObjectKey}"`);
    return c.body(`Mock download for ${entitlement.assetObjectKey}\nEOF`);
  });

export default routes;
