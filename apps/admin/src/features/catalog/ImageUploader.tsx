import React, { useRef, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';

interface ImageUploaderProps {
  productId: string;
  onUploadSuccess?: (objectKey: string) => void;
}

// Accepted image types
const ACCEPTED = 'image/jpeg,image/png,image/webp';
const MAX_MB = 5;

export function ImageUploader({ productId: _productId, onUploadSuccess }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Hanya file gambar (JPG, PNG, WebP) yang diizinkan');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`Ukuran file maksimum ${MAX_MB}MB`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Pilih gambar terlebih dahulu'); return; }
    setIsUploading(true);
    setProgress(10);
    try {
      const res = await client.v1.admin.assets['upload-url'].$post({
        json: { filename: file.name, contentType: file.type, size: file.size },
      });
      if (!res.ok) throw new Error('Gagal mendapatkan URL upload');
      const { uploadUrl, objectKey } = (await res.json()) as any;
      setProgress(40);

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Gagal mengunggah file');
      setProgress(90);

      toast.success('Gambar berhasil diunggah!');
      setFile(null);
      setPreview(null);
      setProgress(100);
      onUploadSuccess?.(objectKey);
      setTimeout(() => setProgress(0), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className='space-y-4'>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
          ${file ? 'cursor-default' : ''}
        `}
        style={{ minHeight: 180 }}
      >
        {preview ? (
          <div className='relative flex items-center justify-center p-4' style={{ minHeight: 180 }}>
            <img
              src={preview}
              alt='Preview'
              className='max-h-40 max-w-full rounded-lg object-contain shadow-sm'
            />
            <button
              type='button'
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className='absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 transition'
              title='Hapus'
            >
              ×
            </button>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-3 py-10 text-center px-4' style={{ minHeight: 180 }}>
            <div className='w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg className='w-7 h-7 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700'>
                Seret & lepas gambar di sini
              </p>
              <p className='text-xs text-gray-400 mt-1'>atau klik untuk memilih file</p>
              <p className='text-xs text-gray-400 mt-0.5'>JPG, PNG, WebP — maks. {MAX_MB}MB</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={ACCEPTED}
        onChange={handleFileChange}
        disabled={isUploading}
        className='hidden'
      />

      {/* Progress Bar */}
      {isUploading && (
        <div className='w-full bg-gray-100 rounded-full h-2 overflow-hidden'>
          <div
            className='h-2 bg-blue-500 rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Upload button */}
      {file && (
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={handleUpload}
            disabled={isUploading}
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all'
          >
            {isUploading ? (
              <>
                <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                </svg>
                Mengunggah... {progress}%
              </>
            ) : (
              <>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                </svg>
                Unggah Gambar
              </>
            )}
          </button>
          <button
            type='button'
            onClick={clearFile}
            disabled={isUploading}
            className='px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50'
          >
            Batal
          </button>
        </div>
      )}
    </div>
  );
}
