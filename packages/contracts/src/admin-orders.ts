import { z } from 'zod';
const orderStatusSchema = z.string();

export const adminOrderListItemSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  userId: z.string().uuid().nullable(),
  customerName: z.string().nullable(),
  customerEmail: z.string(),
  totalAmount: z.number(),
  status: orderStatusSchema,
  createdAt: z.string(),
});
export type AdminOrderListItem = z.infer<typeof adminOrderListItemSchema>;

export const adminOrderListResponseSchema = z.object({
  data: z.array(adminOrderListItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type AdminOrderListResponse = z.infer<typeof adminOrderListResponseSchema>;

export const adminOrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number(),
  priceSnapshot: z.number(),
  productNameSnapshot: z.string(),
  variantSkuSnapshot: z.string(),
});
export type AdminOrderItem = z.infer<typeof adminOrderItemSchema>;

export const adminOrderStatusHistorySchema = z.object({
  id: z.string().uuid(),
  status: z.string(),
  note: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminOrderStatusHistory = z.infer<typeof adminOrderStatusHistorySchema>;

export const adminShipmentSchema = z.object({
  id: z.string().uuid(),
  carrier: z.string(),
  trackingNumber: z.string().nullable(),
  status: z.string(),
  shippedAt: z.string().nullable(),
  deliveredAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminShipment = z.infer<typeof adminShipmentSchema>;

export const adminOrderDetailResponseSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  idempotencyKey: z.string().nullable(),
  userId: z.string().uuid().nullable(),
  emailSnapshot: z.string(),
  totalAmount: z.number(),
  subtotalAmount: z.number(),
  discountAmount: z.number(),
  shippingAmount: z.number(),
  taxAmount: z.number(),
  status: orderStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),

  items: z.array(adminOrderItemSchema),
  history: z.array(adminOrderStatusHistorySchema),
  shipments: z.array(adminShipmentSchema),

  shippingSnapshot: z.any().nullable(),
  billingSnapshot: z.any().nullable(),
});
export type AdminOrderDetailResponse = z.infer<typeof adminOrderDetailResponseSchema>;

export const adminUpdateOrderStatusRequestSchema = z.object({
  status: orderStatusSchema,
  note: z.string().optional(),
});
export type AdminUpdateOrderStatusRequest = z.infer<typeof adminUpdateOrderStatusRequestSchema>;

export const adminAttachShipmentRequestSchema = z.object({
  carrier: z.string().min(1),
  trackingNumber: z.string().optional(),
});
export type AdminAttachShipmentRequest = z.infer<typeof adminAttachShipmentRequestSchema>;
