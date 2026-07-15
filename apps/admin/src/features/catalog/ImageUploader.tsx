import React, { useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { Button } from '@starsuperscare/ui';
import { goeyToast as toast } from 'goey-toast';

interface ImageUploaderProps {
  productId: string;
  onUploadSuccess?: (objectKey: string) => void;
}

export function ImageUploader({ productId: _productId, onUploadSuccess }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    // 1. Get Presigned URL
    setIsUploading(true);
    setProgress(10);
    try {
      const payload = {
        filename: file.name,
        contentType: file.type,
        size: file.size,
      };

      const res = await client.v1.admin.assets['upload-url'].$post({ json: payload });
      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, objectKey } = (await res.json()) as any;
      setProgress(40);

      // 2. Upload file directly to the Presigned URL
      // In local dev, this goes to our LocalStorageAdapter handler
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to storage');
      }

      setProgress(80);

      // 3. (Optional) Save metadata in neon or just link it to the product
      // E.g., we might call a product images API here, but for now we just return the objectKey
      toast.success('File uploaded successfully');
      setFile(null);
      setProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(objectKey);
      }

      setTimeout(() => setProgress(0), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '1.5rem',
        borderRadius: '8px',
        background: '#fafafa',
      }}
    >
      <h4>Upload Product Asset</h4>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
        <input
          type='file'
          accept='image/jpeg,image/png,image/webp'
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? `Uploading... ${progress}%` : 'Upload'}
        </Button>
      </div>
      {progress > 0 && progress < 100 && (
        <div
          style={{
            width: '100%',
            height: '4px',
            background: '#eee',
            marginTop: '1rem',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#007bff',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      )}
    </div>
  );
}
