// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const faqSchema: z.ZodType<Faq> = z.object({
  id: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  isPublished: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  orderId: string | null;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export const supportTicketSchema: z.ZodType<SupportTicket> = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  subject: z.string(),
  category: z.string(),
  orderId: z.string().uuid().nullable(),
  status: z.string(),
  priority: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string | null;
  content: string;
  isInternal: string;
  createdAt: string;
  attachments?: Attachment[] | null | undefined;
}

export const supportMessageSchema: z.ZodType<SupportMessage> = z.object({
  id: z.string().uuid(),
  ticketId: z.string().uuid(),
  senderId: z.string().uuid().nullable(),
  content: z.string(),
  isInternal: z.string(),
  createdAt: z.string(),
  attachments: z.array(z.any()).nullable().optional(),
});

export interface Attachment {
  id: string;
  referenceType: string;
  referenceId: string;
  objectKey: string;
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export const attachmentSchema: z.ZodType<Attachment> = z.object({
  id: z.string().uuid(),
  referenceType: z.string(),
  referenceId: z.string().uuid(),
  objectKey: z.string(),
  fileName: z.string().nullable(),
  mimeType: z.string().nullable(),
  sizeBytes: z.number().nullable(),
  createdAt: z.string(),
});

export const createTicketRequestSchema = z.object({
  subject: z.string().min(5),
  category: z.string().default('general'),
  orderId: z.string().uuid().optional(),
  message: z.string().min(10),
});
export type CreateTicketRequest = z.infer<typeof createTicketRequestSchema>;

export const updateTicketStatusRequestSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});
export type UpdateTicketStatusRequest = z.infer<typeof updateTicketStatusRequestSchema>;

export const createMessageRequestSchema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().default(false),
  attachments: z.array(z.string()).optional(), // array of attachment ids
});
export type CreateMessageRequest = z.infer<typeof createMessageRequestSchema>;
