import { z } from 'zod';

// Explicit Types
export interface Category {
  id: string;
  parentId?: string | null | undefined;
  name: string;
  slug: string;
  description?: string | null | undefined;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  comparePrice?: number | null | undefined;
  availableStock: number;
  name?: string | null | undefined;
  size?: string | null | undefined;
}

export interface ProductListVariantSummary {
  minPrice: number;
  maxPrice?: number | undefined;
  maxComparePrice?: number | null | undefined;
  totalAvailableStock: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  brandId?: string | null | undefined;
  type: string;
  status: string;
  netSold: number;
  averageRating: number;
  reviewCount: number;
  variantsSummary: ProductListVariantSummary;
  primaryImage?: string | null | undefined;
}

export interface ProductDetail extends ProductListItem {
  description?: string | null | undefined;
  purchaseLimit: number;
  brand?: Brand | null | undefined;
  categories: Category[];
  variants: ProductVariant[];
  images: string[];
}

export interface ProductListQuery {
  page: number;
  per_page: number;
  search?: string | undefined;
  category?: string | undefined;
  brand?: string | undefined;
  min_price?: number | undefined;
  max_price?: number | undefined;
  min_rating?: number | undefined;
  promo?: boolean | undefined;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'best_selling';
  in_stock: boolean;
}

export interface ProductListResponse {
  data: {
    items: ProductListItem[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  meta: {
    request_id: string;
  };
  error: null;
}

export interface ProductDetailResponse {
  data: ProductDetail;
  meta: {
    request_id: string;
  };
  error: null;
}

export interface CategoriesListResponse {
  data: Category[];
  meta: {
    request_id: string;
  };
  error: null;
}

export interface BrandsListResponse {
  data: Brand[];
  meta: {
    request_id: string;
  };
  error: null;
}

// Zod Schemas
export const CategorySchema: z.ZodType<Category> = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
});

export const BrandSchema: z.ZodType<Brand> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export const ProductVariantSchema: z.ZodType<ProductVariant> = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  price: z.number(),
  comparePrice: z.number().nullable().optional(),
  availableStock: z.number().default(0),
  size: z.string().nullable().optional(),
});

export const ProductListVariantSummarySchema: z.ZodType<ProductListVariantSummary> = z.object({
  minPrice: z.number(),
  maxPrice: z.number().optional(),
  maxComparePrice: z.number().nullable().optional(),
  totalAvailableStock: z.number().default(0),
});

export const ProductListItemSchema: z.ZodType<ProductListItem> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  brandId: z.string().uuid().nullable().optional(),
  type: z.string(),
  status: z.string(),
  netSold: z.number().default(0),
  averageRating: z.number().default(0),
  reviewCount: z.number().default(0),
  variantsSummary: ProductListVariantSummarySchema,
  primaryImage: z.string().nullable().optional(),
});

export const ProductDetailSchema: z.ZodType<ProductDetail> = ProductListItemSchema.and(z.object({
  description: z.string().nullable().optional(),
  purchaseLimit: z.number().default(0),
  brand: BrandSchema.nullable().optional(),
  categories: z.array(CategorySchema).default([]),
  variants: z.array(ProductVariantSchema).default([]),
  images: z.array(z.string()).default([]),
})) as any;

export const ProductListQuerySchema: z.ZodType<ProductListQuery> = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  min_rating: z.coerce.number().min(1).max(5).optional(),
  promo: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'best_selling']).default('newest'),
  in_stock: z.coerce.boolean().default(false),
});

export const ProductListResponseSchema: z.ZodType<ProductListResponse> = z.object({
  data: z.object({
    items: z.array(ProductListItemSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
    totalPages: z.number(),
  }),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.null(),
});

export const ProductDetailResponseSchema: z.ZodType<ProductDetailResponse> = z.object({
  data: ProductDetailSchema,
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.null(),
});

export const CategoriesListResponseSchema: z.ZodType<CategoriesListResponse> = z.object({
  data: z.array(CategorySchema),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.null(),
});

export const BrandsListResponseSchema: z.ZodType<BrandsListResponse> = z.object({
  data: z.array(BrandSchema),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.null(),
});
