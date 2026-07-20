import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../../middleware/auth.ts';
import {
  attachments,
  db,
  faqs,
  orders,
  supportMessages,
  supportTickets,
} from '@starsuperscare/database';
import { and, desc, eq } from 'drizzle-orm';
import { createMessageRequestSchema, createTicketRequestSchema } from '@starsuperscare/contracts';
import { storage } from '@starsuperscare/storage';
import * as crypto from 'node:crypto';
import * as path from 'node:path';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build a human-readable message from Zod issues */
function zodMessage(issues: any[]): string {
  return issues
    .map((i: any) => (i.path?.length ? `${(i.path as any[]).join('.')}: ${i.message}` : i.message))
    .join('; ');
}

/** zValidator wrapper that returns a plain string error instead of a ZodError object */
function validate<T extends import('zod').ZodTypeAny>(
  target: 'json' | 'form' | 'query' | 'param',
  schema: T,
) {
  return zValidator(target, schema, (result, c): Response | undefined => {
    if (!result.success) {
      return c.json(
        {
          data: null,
          error: { code: 'VALIDATION_ERROR', message: zodMessage(result.error.issues) },
          meta: {},
        },
        400,
      ) as unknown as Response;
    }
    return undefined;
  });
}

type AppContext = {
  Variables: {
    user: any;
    requestId: string;
  };
};

// ─── R2 / SigV4 ─────────────────────────────────────────────────────────────

/** Read R2 support config from env at call-time (not module init) */
function getR2Config() {
  return {
    accountId:
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_ACCOUNT_ID')
        : process?.env?.['R2_ACCOUNT_ID']) ?? '',
    accessKeyId:
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_ACCESS_KEY_ID')
        : process?.env?.['R2_ACCESS_KEY_ID']) ?? '',
    secretAccessKey:
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_SECRET_ACCESS_KEY')
        : process?.env?.['R2_SECRET_ACCESS_KEY']) ?? '',
    bucket:
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_SUPPORT_BUCKET_NAME')
        : process?.env?.['R2_SUPPORT_BUCKET_NAME']) ?? 'supportclient',
    /** Set to pub-xxx.r2.dev if bucket is public CDN. Leave empty → use API proxy. */
    publicCdnUrl:
      ((typeof Deno !== 'undefined'
        ? Deno.env.get('R2_SUPPORT_PUBLIC_URL')
        : process?.env?.['R2_SUPPORT_PUBLIC_URL']) ?? '').replace(/\/$/, ''),
  };
}

// Shared crypto helpers (module-level, no nested declarations)
const _enc = new TextEncoder();
function _sha256(data: string | Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', typeof data === 'string' ? _enc.encode(data) : data);
}
async function _hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  return crypto.subtle.sign('HMAC', k, _enc.encode(data));
}
function _hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Build SigV4 signed headers for an R2 request */
async function buildSigV4Headers(
  method: string,
  s3Host: string,
  bucket: string,
  objectKey: string,
  extraHeaders: Record<string, string>,
  cfg: ReturnType<typeof getR2Config>,
): Promise<Record<string, string>> {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
  const region = 'auto';
  const service = 's3';
  const credentialScope = `${dateStr}/${region}/${service}/aws4_request`;

  const hdr: Record<string, string> = {
    'Host': s3Host,
    'x-amz-date': timeStr,
    'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
    ...extraHeaders,
  };

  const canonicalHeaders =
    Object.entries(hdr).map(([k, v]) => `${k.toLowerCase()}:${v}`).sort().join('\n') + '\n';
  const signedHeaders = Object.keys(hdr).map((k) => k.toLowerCase()).sort().join(';');
  const canonicalRequest = [
    method,
    `/${bucket}/${objectKey}`,
    '',
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const canonicalHash = _hex(await _sha256(canonicalRequest));
  const stringToSign = ['AWS4-HMAC-SHA256', timeStr, credentialScope, canonicalHash].join('\n');

  const kDate = await _hmac(_enc.encode(`AWS4${cfg.secretAccessKey}`), dateStr);
  const kRegion = await _hmac(kDate, region);
  const kService = await _hmac(kRegion, service);
  const kSigning = await _hmac(kService, 'aws4_request');
  const signature = _hex(await _hmac(kSigning, stringToSign));

  return {
    ...hdr,
    Authorization:
      `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

/**
 * Build the proxy/CDN URL for an attachment objectKey.
 * - If R2_SUPPORT_PUBLIC_URL is a real CDN (pub-xxx.r2.dev) → direct CDN URL.
 * - Otherwise → /v1/support/images/* (API proxy, authenticated via SigV4).
 */
function buildPublicUrl(objectKey: string): string {
  const cdn =
    ((typeof Deno !== 'undefined'
      ? Deno.env.get('R2_SUPPORT_PUBLIC_URL')
      : process?.env?.['R2_SUPPORT_PUBLIC_URL']) ?? '').replace(/\/$/, '');
  if (cdn && !cdn.includes('r2.cloudflarestorage.com')) {
    return `${cdn}/${objectKey}`;
  }
  return `/v1/support/images/${objectKey}`;
}

/** Upload file to R2 with SigV4 PUT. Returns objectKey on success, throws on failure. */
async function uploadToR2(
  fileBuffer: Uint8Array,
  contentType: string,
  fileName: string,
): Promise<string> {
  const cfg = getR2Config();
  const folderUUID = crypto.randomUUID();
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectKey = `img/${folderUUID}/${safeFileName}`;
  const s3Host = `${cfg.accountId}.r2.cloudflarestorage.com`;

  const headers = await buildSigV4Headers('PUT', s3Host, cfg.bucket, objectKey, {
    'Content-Type': contentType,
    'Content-Length': fileBuffer.byteLength.toString(),
  }, cfg);

  const res = await fetch(`https://${s3Host}/${cfg.bucket}/${objectKey}`, {
    method: 'PUT',
    headers,
    body: fileBuffer.buffer as ArrayBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`R2 upload failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  return objectKey;
}

// ─── App ─────────────────────────────────────────────────────────────────────

const app = new Hono<AppContext>();

// Public FAQ endpoint (no auth required)
app.get('/faqs', async (c) => {
  const allFaqs = await db.query.faqs.findMany({
    where: eq(faqs.isPublished, true),
    orderBy: [desc(faqs.createdAt)],
  });
  return c.json({ data: allFaqs, meta: { request_id: c.get('requestId') }, error: null });
});

/**
 * Image Proxy — GET /support/images/*
 * Fetches from R2 (SigV4 signed GET) or local disk storage and streams to client.
 * Never exposes private R2 URLs or localhost to browser.
 */
app.get('/images/*', async (c) => {
  const objectKey = c.req.path.replace(/^\/images\//, '');
  if (!objectKey) return c.text('Not found', 404);

  const cfg = getR2Config();

  // 1. Try R2 with signed GET
  if (cfg.accountId && cfg.accessKeyId && cfg.secretAccessKey) {
    try {
      const s3Host = `${cfg.accountId}.r2.cloudflarestorage.com`;
      const headers = await buildSigV4Headers('GET', s3Host, cfg.bucket, objectKey, {}, cfg);
      const r2Res = await fetch(`https://${s3Host}/${cfg.bucket}/${objectKey}`, { headers });

      if (r2Res.ok && r2Res.body) {
        const ct = r2Res.headers.get('content-type') ?? 'application/octet-stream';
        c.header('Content-Type', ct);
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
        return c.body(r2Res.body);
      }
      // Fall through if R2 fails (e.g. bucket doesn't exist yet)
    } catch (_e) { /* fall through to local storage */ }
  }

  // 2. Fallback: local disk storage at data/storage/{objectKey}
  try {
    const workspaceRoot = path.join(import.meta.dirname!, '..', '..', '..', '..', '..');
    const filePath = path.join(workspaceRoot, 'data', 'storage', objectKey);
    const file = await Deno.open(filePath, { read: true });
    const ext = objectKey.split('.').pop()?.toLowerCase() ?? '';
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
    };
    c.header('Content-Type', mimeMap[ext] ?? 'application/octet-stream');
    c.header('Cache-Control', 'public, max-age=86400');
    return c.body(file.readable);
  } catch (_e) {
    return c.text('Image not found', 404);
  }
});

// All routes below require authentication
app.use('/*', authMiddleware);

// Get user's tickets
app.get('/tickets', async (c) => {
  const user = c.get('user');
  const tickets = await db.query.supportTickets.findMany({
    where: eq(supportTickets.userId, user.id),
    orderBy: [desc(supportTickets.createdAt)],
  });
  return c.json({ data: tickets, meta: { request_id: c.get('requestId') }, error: null });
});

// Create a new ticket
app.post('/tickets', validate('json', createTicketRequestSchema), async (c) => {
  const user = c.get('user');
  const payload = c.req.valid('json');

  if (payload.orderId) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, payload.orderId), eq(orders.userId, user.id)),
    });
    if (!order) {
      return c.json({ error: 'Order not found or does not belong to you' }, 403);
    }
  }

  const [ticket] = await db.insert(supportTickets)
    .values({
      userId: user.id,
      subject: payload.subject,
      category: payload.category,
      orderId: payload.orderId || null,
    })
    .returning();

  await db.insert(supportMessages).values({
    ticketId: ticket.id,
    senderId: user.id,
    content: payload.message,
  });

  return c.json({ data: ticket, meta: { request_id: c.get('requestId') }, error: null });
});

// Get ticket detail with messages and attachments
app.get('/tickets/:id', async (c) => {
  const user = c.get('user');
  const ticketId = c.req.param('id');

  const ticket = await db.query.supportTickets.findFirst({
    where: and(eq(supportTickets.id, ticketId), eq(supportTickets.userId, user.id)),
  });

  if (!ticket) return c.json({ error: 'Ticket not found' }, 404);

  const messages = await db.query.supportMessages.findMany({
    where: eq(supportMessages.ticketId, ticketId),
    orderBy: [supportMessages.createdAt],
  });

  // Fetch attachments for all messages in this ticket
  const msgIds = messages.map((m) => m.id);
  const attachmentsList = msgIds.length > 0
    ? (await Promise.all(
      msgIds.map((mid) =>
        db.query.attachments.findMany({ where: eq(attachments.referenceId, mid) })
      ),
    )).flat()
    : [];

  const messagesWithAttachments = messages.map((msg) => ({
    ...msg,
    senderType: (msg.isInternal === 'admin' || msg.isInternal === 'true')
      ? 'admin'
      : msg.senderId !== ticket.userId
      ? 'admin'
      : 'user',
    attachments: attachmentsList
      .filter((a) => a.referenceId === msg.id)
      .map((a) => ({ ...a, publicUrl: buildPublicUrl(a.objectKey ?? '') })),
  }));

  return c.json({
    data: { ...ticket, messages: messagesWithAttachments },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Reply to a ticket
app.post('/tickets/:id/messages', validate('json', createMessageRequestSchema), async (c) => {
  const user = c.get('user');
  const ticketId = c.req.param('id');
  const payload = c.req.valid('json');

  const ticket = await db.query.supportTickets.findFirst({
    where: and(eq(supportTickets.id, ticketId), eq(supportTickets.userId, user.id)),
  });

  if (!ticket) return c.json({ error: 'Ticket not found' }, 404);

  if (ticket.status === 'closed') {
    return c.json({ error: 'Cannot reply to a closed ticket' }, 400);
  }

  const [message] = await db.insert(supportMessages)
    .values({
      ticketId: ticket.id,
      senderId: user.id,
      content: payload.content,
      isInternal: 'false',
    })
    .returning();

  if (ticket.status !== 'open') {
    await db.update(supportTickets)
      .set({ status: 'open', updatedAt: new Date().toISOString() })
      .where(eq(supportTickets.id, ticket.id));
  }

  // Link uploaded attachments to this message
  if (payload.attachments && payload.attachments.length > 0) {
    for (const attachmentId of payload.attachments) {
      await db.update(attachments)
        .set({ referenceId: message.id, referenceType: 'message' })
        .where(and(eq(attachments.id, attachmentId), eq(attachments.referenceType, 'temp')));
    }
  }

  return c.json({ data: message, meta: { request_id: c.get('requestId') }, error: null });
});

// ─── Upload Attachment ────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

app.post('/attachments', async (c) => {
  const user = c.get('user');
  const body = await c.req.parseBody();
  const file = body['file'] as File | undefined;

  if (!file) return c.json({ error: 'No file uploaded' }, 400);

  if (file.size > MAX_FILE_SIZE) {
    return c.json({
      error: `Ukuran file melebihi batas 10MB (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    }, 400);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return c.json(
      { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, GIF, WebP, atau PDF.' },
      400,
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const safeFile = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  let objectKey: string;

  try {
    objectKey = await uploadToR2(buffer, file.type, file.name);
    console.log('[support] R2 upload OK:', objectKey);
  } catch (err: any) {
    console.warn('[support] R2 upload failed, fallback to local storage:', err?.message);
    const folderUUID = crypto.randomUUID();
    objectKey = `img/${folderUUID}/${safeFile}`;
    await storage.putObject(objectKey, buffer, file.type);
  }

  const [attachment] = await db.insert(attachments)
    .values({
      referenceType: 'temp',
      referenceId: user.id,
      objectKey,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    })
    .returning();

  return c.json({
    data: { ...attachment, publicUrl: buildPublicUrl(objectKey) },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export default app;
