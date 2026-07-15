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

type AppContext = {
  Variables: {
    user: any;
    requestId: string;
  };
};

const app = new Hono<AppContext>();

// Public FAQ endpoint
app.get('/faqs', async (c) => {
  const allFaqs = await db.query.faqs.findMany({
    where: eq(faqs.isPublished, true),
    orderBy: [desc(faqs.createdAt)],
  });

  return c.json({
    data: allFaqs,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

app.use('/*', authMiddleware);

// Get user's tickets
app.get('/tickets', async (c) => {
  const user = c.get('user');

  const tickets = await db.query.supportTickets.findMany({
    where: eq(supportTickets.userId, user.id),
    orderBy: [desc(supportTickets.createdAt)],
  });

  return c.json({
    data: tickets,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Create a new ticket
app.post('/tickets', zValidator('json', createTicketRequestSchema), async (c) => {
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

  await db.insert(supportMessages)
    .values({
      ticketId: ticket.id,
      senderId: user.id,
      content: payload.message,
    });

  return c.json({
    data: ticket,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Get ticket detail and messages
app.get('/tickets/:id', async (c) => {
  const user = c.get('user');
  const ticketId = c.req.param('id');

  const ticket = await db.query.supportTickets.findFirst({
    where: and(eq(supportTickets.id, ticketId), eq(supportTickets.userId, user.id)),
  });

  if (!ticket) {
    return c.json({ error: 'Ticket not found' }, 404);
  }

  const messages = await db.query.supportMessages.findMany({
    where: eq(supportMessages.ticketId, ticketId),
    orderBy: [desc(supportMessages.createdAt)],
  });

  const attachmentsList = await db.query.attachments.findMany({
    where: and(
      eq(attachments.referenceType, 'ticket'),
      eq(attachments.referenceId, ticketId),
    ),
  });

  // Attach attachments to messages
  const messagesWithAttachments = messages.map((msg) => ({
    ...msg,
    attachments: attachmentsList.filter((a) =>
      a.referenceId === msg.id || a.referenceId === ticketId
    ),
  }));

  return c.json({
    data: {
      ...ticket,
      messages: messagesWithAttachments,
    },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Reply to a ticket
app.post('/tickets/:id/messages', zValidator('json', createMessageRequestSchema), async (c) => {
  const user = c.get('user');
  const ticketId = c.req.param('id');
  const payload = c.req.valid('json');

  const ticket = await db.query.supportTickets.findFirst({
    where: and(eq(supportTickets.id, ticketId), eq(supportTickets.userId, user.id)),
  });

  if (!ticket) {
    return c.json({ error: 'Ticket not found' }, 404);
  }

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

  // Update ticket status to open if it was resolved, etc (just an example logic)
  if (ticket.status !== 'open') {
    await db.update(supportTickets).set({ status: 'open', updatedAt: new Date().toISOString() })
      .where(eq(supportTickets.id, ticket.id));
  }

  // Link attachments if provided
  if (payload.attachments && payload.attachments.length > 0) {
    for (const attachmentId of payload.attachments) {
      await db.update(attachments).set({ referenceId: message.id, referenceType: 'message' })
        .where(and(eq(attachments.id, attachmentId), eq(attachments.referenceType, 'temp')));
    }
  }

  return c.json({
    data: message,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Upload Attachment (Temporary before linked)
app.post('/attachments', async (c) => {
  const user = c.get('user');
  const body = await c.req.parseBody();
  const file = body['file'] as File | undefined;

  if (!file) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: 'File size exceeds 5MB limit' }, 400);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return c.json({ error: 'Invalid file type. Only JPG, PNG, and PDF are allowed' }, 400);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const fileExtension = file.name.split('.').pop();
  const objectKey = `support/${user.id}/${crypto.randomUUID()}.${fileExtension}`;

  await storage.putObject(objectKey, buffer, file.type);

  const [attachment] = await db.insert(attachments)
    .values({
      referenceType: 'temp',
      referenceId: user.id, // temp reference mapped to user so they own it
      objectKey,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    })
    .returning();

  return c.json({
    data: attachment,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export default app;
