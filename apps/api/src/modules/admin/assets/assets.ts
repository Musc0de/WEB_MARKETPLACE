import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AssetUploadRequestSchema } from '@starsuperscare/contracts';
import { storageAdapter } from '../../../adapters/storage.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);

const routes = app.post(
  '/upload-url',
  requirePermission('catalog.write'),
  zValidator('json', AssetUploadRequestSchema),
  async (c) => {
    const data = c.req.valid('json');
    const ext = data.filename.split('.').pop() || 'bin';
    const rawFilename = data.filename.replace(`.${ext}`, '').replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 50);
    const uniqueName = `${rawFilename}-${crypto.randomUUID().substring(0, 8)}.${ext}`;

    let objectKey = `misc/${uniqueName}`;

    if (data.productName) {
      // Sanitize product name to be safe for URLs/S3 keys
      const slug = data.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(
        /(^-|-$)/g,
        '',
      );
      objectKey = `${slug}/assets/img/${uniqueName}`;
    }

    const { uploadUrl, expiresAt, publicUrl } = await storageAdapter.generatePresignedUploadUrl(
      objectKey,
      data.contentType,
      data.size,
    );

    return c.json({
      uploadUrl,
      objectKey,
      publicUrl,
      expiresAt: expiresAt.toISOString(),
    });
  },
);

export default routes;
