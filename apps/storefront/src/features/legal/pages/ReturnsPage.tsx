import { H1, Text } from '@starsuperscare/ui';

export function ReturnsPage() {
  return (
    <div className='max-w-3xl mx-auto py-12 px-4'>
      <H1 className='mb-6'>Kebijakan Pengembalian Dana & Barang</H1>
      <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6 prose prose-blue max-w-none'>
        <Text className='text-gray-700 leading-relaxed'>
          Kami di StarSuperScare berkomitmen untuk memastikan kepuasan Anda. Jika Anda tidak sepenuhnya puas dengan pembelian Anda, kami di sini untuk membantu.
        </Text>
        
        <h3 className='text-lg font-semibold mt-6 mb-2'>Syarat Pengembalian</h3>
        <ul className='list-disc pl-5 space-y-2 text-gray-700'>
          <li>Barang harus dikembalikan maksimal 7 hari sejak barang diterima.</li>
          <li>Barang harus dalam kondisi yang sama seperti saat Anda menerimanya, belum digunakan, dan lengkap dengan kemasan aslinya.</li>
          <li>Anda perlu menyertakan tanda terima atau bukti pembelian (Invoice).</li>
        </ul>

        <h3 className='text-lg font-semibold mt-6 mb-2'>Proses Pengembalian Dana</h3>
        <Text className='text-gray-700 leading-relaxed'>
          Setelah kami menerima barang Anda, kami akan memeriksanya dan memberitahu Anda bahwa kami telah menerima barang yang dikembalikan. Kami akan segera memberi tahu Anda mengenai status pengembalian dana setelah memeriksa barang tersebut.
        </Text>
        <Text className='text-gray-700 leading-relaxed'>
          Jika pengembalian Anda disetujui, kami akan memulai pengembalian dana ke kartu kredit Anda (atau metode pembayaran asli). Anda akan menerima kredit tersebut dalam beberapa hari tertentu, tergantung pada kebijakan pihak penerbit kartu atau bank Anda.
        </Text>

        <h3 className='text-lg font-semibold mt-6 mb-2'>Biaya Pengiriman</h3>
        <Text className='text-gray-700 leading-relaxed'>
          Anda akan bertanggung jawab untuk membayar biaya pengiriman Anda sendiri untuk mengembalikan barang Anda. Biaya pengiriman tidak dapat dikembalikan.
        </Text>
      </div>
    </div>
  );
}
