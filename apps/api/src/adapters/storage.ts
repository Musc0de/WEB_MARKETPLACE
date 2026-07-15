export interface StoragePort {
  generatePresignedUploadUrl(
    objectKey: string,
    contentType: string,
    maxSize: number,
  ): Promise<{ uploadUrl: string; expiresAt: Date }>;
}

export class LocalStorageAdapter implements StoragePort {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  generatePresignedUploadUrl(
    objectKey: string,
    _contentType: string,
    _maxSize: number,
  ): Promise<{ uploadUrl: string; expiresAt: Date }> {
    // Return a URL pointing to our local development upload handler
    const uploadUrl = `${this.baseUrl}/v1/admin/assets/upload-local/${objectKey}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    return Promise.resolve({ uploadUrl, expiresAt });
  }
}

// In a real scenario, this would be injected via DI or configured based on env vars
const API_URL = Deno.env.get('API_URL') || 'http://localhost:8000';
export const storageAdapter: StoragePort = new LocalStorageAdapter(API_URL);
