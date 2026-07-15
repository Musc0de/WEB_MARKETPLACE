import { z } from 'zod';
import { ProductDetailSchema } from './catalog.ts';

export const AdminProductCreateSchema = z.object({
  storeId: z.string().uuid().optional(),
  name: z.string().min(2),
  type: z.enum(['physical', 'digital', 'service']),
  description: z.string().optional(),
  brandId: z.string().uuid().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  purchaseLimit: z.number().min(0).default(0),
});
export type AdminProductCreate = z.infer<typeof AdminProductCreateSchema>;

export const AdminProductUpdateSchema = z.object({
  version: z.number().min(1),
  name: z.string().min(2).optional(),
  type: z.enum(['physical', 'digital', 'service']).optional(),
  description: z.string().optional(),
  brandId: z.string().uuid().nullable().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  purchaseLimit: z.number().min(0).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
export type AdminProductUpdate = z.infer<typeof AdminProductUpdateSchema>;

export const AdminProductVariantCreateSchema = z.object({
  sku: z.string().min(3),
  price: z.number().min(0),
  comparePrice: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimension: z.any().optional(),
  size: z.string().optional(),
});
export type AdminProductVariantCreate = z.infer<typeof AdminProductVariantCreateSchema>;

export const AdminProductVariantUpdateSchema = z.object({
  version: z.number().min(1),
  sku: z.string().min(3).optional(),
  price: z.number().min(0).optional(),
  comparePrice: z.number().min(0).nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  size: z.string().nullable().optional(),
});
export type AdminProductVariantUpdate = z.infer<typeof AdminProductVariantUpdateSchema>;

export const AdminProductImageAddSchema = z.object({
  objectKey: z.string().min(1),
  isPrimary: z.boolean().default(false),
});
export type AdminProductImageAdd = z.infer<typeof AdminProductImageAddSchema>;

export const AdminProductMutationResponse = z.object({
  data: ProductDetailSchema,
  meta: z.object({ request_id: z.string() }),
  error: z.null(),
});
export type AdminProductMutation = z.infer<typeof AdminProductMutationResponse>;

// Admin Category
export const AdminCategoryCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});
export type AdminCategoryCreate = z.infer<typeof AdminCategoryCreateSchema>;

export const AdminCategoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  parentId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});
export type AdminCategoryUpdate = z.infer<typeof AdminCategoryUpdateSchema>;

// Admin Brand
export const AdminBrandCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});
export type AdminBrandCreate = z.infer<typeof AdminBrandCreateSchema>;

export const AdminBrandUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});
export type AdminBrandUpdate = z.infer<typeof AdminBrandUpdateSchema>;
