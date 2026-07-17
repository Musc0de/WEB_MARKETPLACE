import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { CheckCircle2, Key, Loader2, Trash2 } from 'lucide-react';

export function DigitalCredentialsForm({ productId }: { productId: string }) {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCredentialsText, setNewCredentialsText] = useState('');

  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
      const res = await client.v1.admin.catalog.credentials.$get({ query: { productId } });
      if (res.ok) {
        const data = await res.json();
        setCredentials(data.data.credentials);
      }
    } catch (_e) {
      toast.error('Gagal memuat kredensial digital');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [productId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredentialsText.trim()) return;

    // Split by newlines, trim, and filter empty
    const lines = newCredentialsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await client.v1.admin.catalog.credentials.$post({
        json: {
          productId,
          credentials: lines,
        },
      });

      if (!res.ok) throw new Error('Failed to add credentials');

      toast.success(`${lines.length} kredensial berhasil ditambahkan!`);
      setNewCredentialsText('');
      await fetchCredentials();
    } catch (_error) {
      toast.error('Terjadi kesalahan saat menambahkan kredensial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kredensial ini?')) return;

    try {
      const res = await client.v1.admin.catalog.credentials[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Kredensial berhasil dihapus');
      await fetchCredentials();
    } catch (_error) {
      toast.error('Gagal menghapus kredensial (mungkin sudah terjual)');
    }
  };

  return (
    <div className='space-y-6'>
      <form
        onSubmit={handleAdd}
        className='space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100'
      >
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tambah Kredensial Baru (Batch)
          </label>
          <p className='text-xs text-gray-500 mb-2'>
            Masukkan satu kredensial per baris. Anda dapat memasukkan format bebas (misal: "Email:
            x, Pass: y" atau lisensi key).
          </p>
          <textarea
            value={newCredentialsText}
            onChange={(e) => setNewCredentialsText(e.target.value)}
            rows={5}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm'
            placeholder='Email: example@gmail.com, Pass: 123456!@\nEmail: example@gmail.com, Pass: abcdef@$%!1'
            disabled={isSubmitting}
          />
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting || !newCredentialsText.trim()}
            className='inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50'
          >
            {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
            <Key className='w-4 h-4' />
            Tambah Kredensial
          </button>
        </div>
      </form>

      <div>
        <h4 className='text-sm font-medium text-gray-900 mb-3'>Daftar Kredensial</h4>

        {isLoading
          ? (
            <div className='flex justify-center p-8'>
              <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
            </div>
          )
          : credentials.length === 0
          ? (
            <div className='text-center p-8 bg-white border border-gray-200 border-dashed rounded-xl'>
              <Key className='w-8 h-8 text-gray-300 mx-auto mb-2' />
              <p className='text-sm text-gray-500'>
                Belum ada kredensial digital untuk produk ini.
              </p>
            </div>
          )
          : (
            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Dibuat Pada
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Pengguna (Jika Terjual)
                    </th>
                    <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {credentials.map((cred) => (
                    <tr key={cred.id}>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {cred.status === 'available'
                          ? (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800'>
                              Tersedia
                            </span>
                          )
                          : (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                              Terjual / {cred.status}
                            </span>
                          )}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(cred.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                        {cred.userEmail
                          ? (
                            <div className='flex items-center gap-1 text-indigo-600'>
                              <CheckCircle2 className='w-4 h-4' />
                              {cred.userEmail}
                            </div>
                          )
                          : (
                            '-'
                          )}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-right text-sm font-medium'>
                        {cred.status === 'available' && (
                          <button
                            type='button'
                            onClick={() => handleDelete(cred.id)}
                            className='text-red-600 hover:text-red-900'
                            title='Hapus Kredensial'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
