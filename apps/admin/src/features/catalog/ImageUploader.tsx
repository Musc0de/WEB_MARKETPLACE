import React, { useRef, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';

interface ImageUploaderProps {
  productId: string;
  productName?: string;
  onUploadSuccess?: (objectKey: string) => void;
}

// Accepted image types
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic,image/heif,image/tiff';
const MAX_MB = 5;
const MAX_FILES = 10;

export function ImageUploader({ productId: _productId, productName, onUploadSuccess }: ImageUploaderProps) {
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles).filter((f) => {
      if (!f.type.startsWith('image/')) {
        toast.error(`"${f.name}" ditolak: Hanya file gambar yang diizinkan`);
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`"${f.name}" ditolak: Ukuran maksimum ${MAX_MB}MB`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > MAX_FILES) {
      toast.error(`Maksimal hanya dapat mengunggah ${MAX_FILES} gambar sekaligus`);
      return;
    }

    const mapped = validFiles.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) { toast.error('Pilih gambar terlebih dahulu'); return; }
    setIsUploading(true);
    setProgress(10);
    try {
      // 1. Get presigned URLs for all files
      const urlPromises = files.map(f => 
        client.v1.admin.assets['upload-url'].$post({
          json: { filename: f.file.name, contentType: f.file.type, size: f.file.size, productName },
        })
      );
      
      const urlResponses = await Promise.all(urlPromises);
      const urlData = await Promise.all(urlResponses.map(async (res, index) => {
        if (!res.ok) throw new Error(`Gagal mendapatkan URL upload untuk gambar ${index + 1}`);
        const data = await res.json();
        return data as any;
      }));
      
      setProgress(40);

      // 2. Upload all files to R2 simultaneously
      const uploadPromises = files.map((f, i) => 
        fetch(urlData[i].uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': f.file.type },
          body: f.file,
        })
      );

      const uploadResponses = await Promise.all(uploadPromises);
      uploadResponses.forEach((res, i) => {
        if (!res.ok) throw new Error(`Gagal mengunggah gambar ${i + 1}`);
      });
      
      setProgress(90);

      toast.success(`${files.length} gambar berhasil diunggah!`);
      
      // Cleanup previews
      files.forEach(f => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setProgress(100);
      
      // Call success for each object key (or just the first one if the parent expects one)
      // Ideally parent handles multiple, but we loop for backward compatibility
      urlData.forEach(d => {
        onUploadSuccess?.(d.objectKey);
      });
      
      setTimeout(() => setProgress(0), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFiles = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className='space-y-4'>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
        `}
        style={{ minHeight: 180 }}
      >
        {files.length > 0 ? (
          <div className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' onClick={(e) => e.stopPropagation()}>
            {files.map((f, i) => (
              <div key={i} className='relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm'>
                <img
                  src={f.preview}
                  alt={`Preview ${i}`}
                  className='w-full h-full object-cover'
                />
                <button
                  type='button'
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className='absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/90 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                  title='Hapus'
                >
                  ×
                </button>
              </div>
            ))}
            {files.length < MAX_FILES && (
              <div 
                onClick={() => inputRef.current?.click()}
                className='flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors'
              >
                <svg className='w-6 h-6 mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                </svg>
                <span className='text-xs font-medium'>Tambah</span>
              </div>
            )}
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
                Seret & lepas gambar di sini (Bisa &gt; 1)
              </p>
              <p className='text-xs text-gray-400 mt-1'>atau klik untuk memilih file</p>
              <p className='text-xs text-gray-400 mt-0.5'>JPG, PNG, WebP — maks. {MAX_MB}MB — maksimal {MAX_FILES} file sekaligus</p>
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
        multiple
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
      {files.length > 0 && (
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
                Unggah {files.length} Gambar
              </>
            )}
          </button>
          <button
            type='button'
            onClick={clearFiles}
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
