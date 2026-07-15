import { S3Client, PutObjectCommand, GetObjectCommand } from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';

export interface StoragePort {
  generatePresignedUploadUrl(
    objectKey: string,
    contentType: string,
    maxSize: number,
  ): Promise<{ uploadUrl: string; expiresAt: Date; publicUrl: string }>;
  generatePresignedDownloadUrl(objectKey: string): Promise<string>;
}

export class CloudflareR2Adapter implements StoragePort {
  private client: S3Client;
  private bucketName: string;
  private publicUrlBase: string;

  constructor() {
    const accountId = Deno.env.get('R2_ACCOUNT_ID');
    const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
    this.bucketName = Deno.env.get('R2_BUCKET_NAME') || 'imagesprivate';
    this.publicUrlBase = Deno.env.get('R2_PUBLIC_URL') || '';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('Cloudflare R2 credentials missing in environment variables');
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async generatePresignedUploadUrl(
    objectKey: string,
    contentType: string,
    _maxSize: number,
  ): Promise<{ uploadUrl: string; expiresAt: Date; publicUrl: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    const publicUrl = `${this.publicUrlBase}/${objectKey}`;

    return { uploadUrl, expiresAt, publicUrl };
  }

  async generatePresignedDownloadUrl(objectKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });
    // Set URL expiration to 24 hours (86400 seconds) for viewing
    return await getSignedUrl(this.client, command, { expiresIn: 86400 });
  }
}

export const storageAdapter: StoragePort = new CloudflareR2Adapter();
