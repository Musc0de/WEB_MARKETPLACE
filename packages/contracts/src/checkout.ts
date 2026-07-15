import { z } from 'zod';

// -----------------------------------------------------------------------------
// Address & Shipping
// -----------------------------------------------------------------------------

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  phoneNumber: z.string().min(8, 'Nomor HP tidak valid').max(20),
  streetAddress: z.string().min(5, 'Alamat lengkap wajib diisi').max(255),
  city: z.string().min(2, 'Kota wajib diisi').max(100),
  province: z.string().min(2, 'Provinsi wajib diisi').max(100),
  postalCode: z.string().min(3, 'Kode pos wajib diisi').max(20),
  country: z.string().default('Indonesia'),
  notes: z.string().max(255).optional().nullable(),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const ShippingOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  cost: z.number().int().min(0),
  estimatedDays: z.string(),
});

export type ShippingOption = z.infer<typeof ShippingOptionSchema>;

export const GetShippingOptionsRequestSchema = z.object({
  destinationProvince: z.string().optional(),
  destinationCity: z.string().optional(),
});

export const GetShippingOptionsResponseSchema = z.object({
  options: z.array(ShippingOptionSchema),
});

// -----------------------------------------------------------------------------
// Checkout Validation & Snapshot
// -----------------------------------------------------------------------------

export const CheckoutValidateRequestSchema = z.object({
  shippingOptionId: z.string().nullable().optional(),
  voucherCode: z.string().nullable().optional(),
});

export const CheckoutSummarySchema = z.object({
  subtotal: z.number().int(),
  totalDiscount: z.number().int(),
  shippingCost: z.number().int(),
  taxAmount: z.number().int(),
  grandTotal: z.number().int(),
});

export const CheckoutValidateResponseSchema = z.object({
  summary: CheckoutSummarySchema,
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive(),
      priceSnapshot: z.number().int(),
      productName: z.string(),
      variantSku: z.string(),
    }),
  ),
  isValid: z.boolean(),
  errors: z.array(z.string()).optional(),
});

export type CheckoutValidateResponse = z.infer<typeof CheckoutValidateResponseSchema>;

// -----------------------------------------------------------------------------
// Order Creation
// -----------------------------------------------------------------------------

export const CreateOrderRequestSchema = z.object({
  idempotencyKey: z.string().uuid(),
  shippingAddress: ShippingAddressSchema,
  billingAddress: ShippingAddressSchema.optional().nullable(), // Null means same as shipping
  shippingOptionId: z.string(),
  voucherCode: z.string().optional().nullable(),
  emailSnapshot: z.string().email('Email tidak valid'), // Guest needs to provide email
  paymentMethod: z.string().optional(), // For future use
});

export const OrderResponseSchema = z.object({
  orderId: z.string().uuid(),
  orderNumber: z.string(),
  totalAmount: z.number().int(),
  status: z.string(),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
