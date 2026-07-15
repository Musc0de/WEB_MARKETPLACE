import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/tiff'];

export interface AssetUploadRequest {
  filename: string;
  contentType: string;
  size: number;
  productName?: string | undefined;
}

export const AssetUploadRequestSchema: z.ZodType<AssetUploadRequest> = z.object({
  filename: z.string().min(1, { message: 'Filename is required' }),
  contentType: z.string().refine((val) => ACCEPTED_IMAGE_TYPES.includes(val), {
    message: 'Unsupported file type',
  }),
  size: z.number().max(MAX_FILE_SIZE, {
    message: 'File size must be less than 5 MB',
  }),
  productName: z.string().optional(),
});

export interface AssetUploadResponse {
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
}

export const AssetUploadResponseSchema: z.ZodType<AssetUploadResponse> = z.object({
  uploadUrl: z.string().url(),
  objectKey: z.string(),
  expiresAt: z.string().datetime(),
});
