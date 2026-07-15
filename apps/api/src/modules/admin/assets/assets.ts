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
    const objectKey = `products/${crypto.randomUUID()}.${ext}`;

    const { uploadUrl, expiresAt } = await storageAdapter.generatePresignedUploadUrl(
      objectKey,
      data.contentType,
      data.size,
    );

    return c.json({
      uploadUrl,
      objectKey,
      expiresAt: expiresAt.toISOString(),
    });
  },
)
  // Local development specific upload handler (Simulating S3 PUT request)
  // In production, the client uploads directly to S3, bypassing our API completely.
  .put('/upload-local/:folder/:filename', async (c) => {
    const folder = c.req.param('folder');
    const filename = c.req.param('filename');

    // Security check: Only allow products folder for now
    if (folder !== 'products') {
      return c.json({ error: 'Invalid folder' }, 400);
    }

    try {
      const bodyBuffer = await c.req.arrayBuffer();

      // Ensure public/uploads folder exists
      const uploadsDir = `${Deno.cwd()}/apps/api/public/uploads/${folder}`;
      await Deno.mkdir(uploadsDir, { recursive: true });

      const filePath = `${uploadsDir}/${filename}`;
      await Deno.writeFile(filePath, new Uint8Array(bodyBuffer));

      return c.text('OK', 200);
    } catch (err) {
      console.error('Local upload error:', err);
      return c.json({ error: 'Failed to write file' }, 500);
    }
  });

export default routes;
