import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { ObjectStorageProvider } from './index.ts';

export class R2StorageProvider implements ObjectStorageProvider {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const accountId = typeof Deno !== 'undefined'
      ? Deno.env.get('R2_ACCOUNT_ID_3')
      : process?.env?.['R2_ACCOUNT_ID_3'];
    const accessKeyId = typeof Deno !== 'undefined'
      ? Deno.env.get('R2_ACCESS_KEY_ID_3')
      : process?.env?.['R2_ACCESS_KEY_ID_3'];
    const secretAccessKey = typeof Deno !== 'undefined'
      ? Deno.env.get('R2_SECRET_ACCESS_KEY_3')
      : process?.env?.['R2_SECRET_ACCESS_KEY_3'];
    this.bucket =
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_BUCKET_NAME_3')
        : process?.env?.['R2_BUCKET_NAME_3']) || 'bannerimgcampaign';
    this.publicUrl =
      (typeof Deno !== 'undefined'
        ? Deno.env.get('R2_PUBLIC_URL_3')
        : process?.env?.['R2_PUBLIC_URL_3']) || 'https://pub-.r2.dev';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.warn('R2 credentials not fully provided. Storage might fail.');
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
    });
  }

  async putObject(key: string, data: Uint8Array, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: contentType,
    });
    await this.client.send(command);
  }

  async getObject(key: string): Promise<Uint8Array | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      if (!response.Body) return null;
      return await response.Body.transformToByteArray();
    } catch (e: any) {
      if (e.name === 'NoSuchKey') return null;
      throw e;
    }
  }

  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    // Return public URL if configured
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }

    // Otherwise fallback to presigned URL
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return await awsGetSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }
}
