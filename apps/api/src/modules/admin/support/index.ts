import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { z } from 'zod';
import { attachments, db, faqs, supportMessages, supportTickets } from '@starsuperscare/database';
import { desc, eq } from 'drizzle-orm';
import { sendNotification } from '../../notifications/index.ts';
import {
  createMessageRequestSchema,
  updateTicketStatusRequestSchema,
} from '@starsuperscare/contracts';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('support.read'));

// List all support tickets for admin
app.get('/tickets', async (c) => {
  const status = c.req.query('status');

  let condition = undefined;
  if (status) {
    condition = eq(supportTickets.status, status);
  }

  const tickets = await db.query.supportTickets.findMany({
    where: condition,
    orderBy: [desc(supportTickets.updatedAt)],
  });

  return c.json({
    data: tickets,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Get a specific ticket
app.get('/tickets/:id', async (c) => {
  const ticketId = c.req.param('id');

  const ticket = await db.query.supportTickets.findFirst({
    where: eq(supportTickets.id, ticketId),
  });

  if (!ticket) {
    return c.json({ error: 'Ticket not found' }, 404);
  }

  const messages = await db.query.supportMessages.findMany({
    where: eq(supportMessages.ticketId, ticketId),
    orderBy: [supportMessages.createdAt],
  });

  // Fetch all attachments linked to these messages
  const msgIds = messages.map((m) => m.id);
  const attachmentsList = msgIds.length > 0
    ? (await Promise.all(
      msgIds.map((mid) =>
        db.query.attachments.findMany({ where: eq(attachments.referenceId, mid) })
      ),
    )).flat()
    : [];

  // Reconstruct publicUrl per attachment
  const r2PubUrl = ((typeof Deno !== 'undefined'
    ? Deno.env.get('R2_SUPPORT_PUBLIC_URL')
    : process?.env?.['R2_SUPPORT_PUBLIC_URL']) ?? '').replace(/\/$/, '');
  const apiUrl =
    (typeof Deno !== 'undefined' ? Deno.env.get('VITE_API_URL') : process?.env?.['VITE_API_URL']) ??
      '';
  const localBase = `${apiUrl}/storage`;

  const messagesWithAttachments = messages.map((msg) => ({
    ...msg,
    // 'admin' or 'true' = sent from admin portal; anything else = customer
    senderType: (msg.isInternal === 'admin' || msg.isInternal === 'true')
      ? 'admin'
      : msg.senderId !== ticket.userId
      ? 'admin'
      : 'user',
    attachments: attachmentsList
      .filter((a) =>
        a.referenceId === msg.id
      )
      .map((a) => ({
        ...a,
        publicUrl: (r2PubUrl && a.objectKey?.startsWith('img/'))
          ? `${r2PubUrl}/${a.objectKey}`
          : `${localBase}/${a.objectKey}`,
      })),
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

// Update ticket status
app.put('/tickets/:id/status', zValidator('json', updateTicketStatusRequestSchema), async (c) => {
  const ticketId = c.req.param('id');
  const payload = c.req.valid('json');

  const [ticket] = await db.update(supportTickets)
    .set({ status: payload.status, updatedAt: new Date().toISOString() })
    .where(eq(supportTickets.id, ticketId))
    .returning();

  if (!ticket) {
    return c.json({ error: 'Ticket not found' }, 404);
  }

  return c.json({
    data: ticket,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Reply to a ticket as an admin
app.post('/tickets/:id/messages', zValidator('json', createMessageRequestSchema), async (c) => {
  const admin = c.get('user');
  const ticketId = c.req.param('id');
  const payload = c.req.valid('json');

  const ticket = await db.query.supportTickets.findFirst({
    where: eq(supportTickets.id, ticketId),
  });

  if (!ticket) {
    return c.json({ error: 'Ticket not found' }, 404);
  }

  const [message] = await db.insert(supportMessages)
    .values({
      ticketId: ticket.id,
      senderId: admin.id,
      content: payload.content,
      // 'admin' = public admin reply; 'true' = internal note; customer messages use 'false'/null
      isInternal: payload.isInternal ? 'true' : 'admin',
    })
    .returning();

  // If replied to user, we can set status to in_progress or waiting for customer.
  if (!payload.isInternal && ticket.status === 'open') {
    await db.update(supportTickets).set({
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
    })
      .where(eq(supportTickets.id, ticket.id));
  } else {
    await db.update(supportTickets).set({ updatedAt: new Date().toISOString() })
      .where(eq(supportTickets.id, ticket.id));
  }

  // NOTE: A notification outbox entry should be inserted here to email the customer
  if (!payload.isInternal) {
    await sendNotification(
      ticket.userId,
      'support_reply',
      'Balasan Tiket Support',
      `Admin membalas tiket Anda: "${ticket.subject}"`,
      `/dashboard/support/${ticket.id}`,
    );
  }

  return c.json({
    data: message,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Manage FAQs

app.post(
  '/faqs',
  zValidator(
    'json',
    z.object({
      question: z.string().min(5),
      answer: z.string().min(5),
      category: z.string(),
      isPublished: z.boolean().default(false),
    }),
  ),
  async (c) => {
    const payload = c.req.valid('json');

    const [faq] = await db.insert(faqs)
      .values(payload)
      .returning();

    return c.json({
      data: faq,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

app.put(
  '/faqs/:id',
  zValidator(
    'json',
    z.object({
      question: z.string().min(5),
      answer: z.string().min(5),
      category: z.string(),
      isPublished: z.boolean(),
    }),
  ),
  async (c) => {
    const id = c.req.param('id');
    const payload = c.req.valid('json');

    const [faq] = await db.update(faqs)
      .set({ ...payload, updatedAt: new Date().toISOString() })
      .where(eq(faqs.id, id))
      .returning();

    if (!faq) return c.json({ error: 'Not found' }, 404);

    return c.json({
      data: faq,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

app.delete('/faqs/:id', async (c) => {
  const id = c.req.param('id');

  const [faq] = await db.delete(faqs)
    .where(eq(faqs.id, id))
    .returning();

  if (!faq) return c.json({ error: 'Not found' }, 404);

  return c.json({
    data: faq,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export default app;
