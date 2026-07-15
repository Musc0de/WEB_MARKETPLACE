import { z } from 'zod';

// Warehouse schema
export const WarehouseSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Warehouse = z.infer<typeof WarehouseSchema>;

// Inventory Level schema
export const InventoryLevelSchema = z.object({
  id: z.string().uuid(),
  variantId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  available: z.number().int().min(0),
  reserved: z.number().int().min(0),
  damaged: z.number().int().min(0),
  version: z.number().int(),
  updatedAt: z.string(),
});
export type InventoryLevel = z.infer<typeof InventoryLevelSchema>;

// Inventory Movement schema
export const InventoryMovementSchema = z.object({
  id: z.string().uuid(),
  variantId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  quantity: z.number().int(),
  type: z.enum(['receive', 'ship', 'adjust', 'reserve', 'release']),
  referenceId: z.string().uuid().nullable().optional(),
  note: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;

// Adjustment Request Schema for Admin UI
export const InventoryAdjustmentRequestSchema = z.object({
  variantId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  delta: z.number().int(),
  type: z.enum(['receive', 'adjust']),
  note: z.string().min(1, 'Reason/Note is required'),
});
export type InventoryAdjustmentRequest = z.infer<typeof InventoryAdjustmentRequestSchema>;

// Reservation schema
export const InventoryReservationSchema = z.object({
  id: z.string().uuid(),
  variantId: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  quantity: z.number().int().positive(),
  expiresAt: z.string(),
  status: z.enum(['active', 'fulfilled', 'expired', 'cancelled']),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type InventoryReservation = z.infer<typeof InventoryReservationSchema>;

// Request schema for creating a reservation
export const CreateReservationRequestSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  expiresInMinutes: z.number().int().positive().default(15),
});
export type CreateReservationRequest = z.infer<typeof CreateReservationRequestSchema>;
