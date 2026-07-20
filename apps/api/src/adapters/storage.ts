import { GetObjectCommand, PutObjectCommand, S3Client } from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';

export interface StoragePort {
  generatePresignedUploadUrl(
    objectKey: string,
    contentType: string,
    maxSize: number,
    customBucket?: string,
    customPublicUrlBase?: string,
  ): Promise<{ uploadUrl: string; expiresAt: Date; publicUrl: string }>;
  generatePresignedDownloadUrl(objectKey: string): Promise<string>;
  deleteObject(objectKey: string): Promise<void>;
}

export class CloudflareR2Adapter implements StoragePort {
  private client: S3Client;
  private bucketName: string;
  private publicUrlBase: string;

  constructor() {
    const accountId = typeof Deno !== 'undefined'
      ? Deno.env.get('R2_ACCOUNT_ID')
      : process?.env?.['R2_ACCOUNT_ID'];
    const accessKeyId = typeof Deno !== 'undefined'
      ? Deno.env.get('R2_ACCESS_KEY_ID')
      : process?.env?.['R2_ACCESS_KEY_ID'];
    const secretAccessKey = typeof Deno !== 'undefined'
      ? Deno.env.get('R2_SECRET_ACCESS_KEY')
      : process?.env?.['R2_SECRET_ACCESS_KEY'];
    this.bucketName =
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_BUCKET_NAME')
        : process?.env?.['R2_BUCKET_NAME']) || 'imagesprivate';
    this.publicUrlBase =
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_PUBLIC_URL')
        : process?.env?.['R2_PUBLIC_URL']) || '';

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
    customBucket?: string,
    customPublicUrlBase?: string,
  ): Promise<{ uploadUrl: string; expiresAt: Date; publicUrl: string }> {
    const command = new PutObjectCommand({
      Bucket: customBucket || this.bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    const publicUrl = `${customPublicUrlBase || this.publicUrlBase}/${objectKey}`;

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

  async deleteObject(objectKey: string): Promise<void> {
    const { DeleteObjectCommand } = await import('npm:@aws-sdk/client-s3@3');
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });
    await this.client.send(command);
  }
}

export const storageAdapter: StoragePort = new CloudflareR2Adapter();
