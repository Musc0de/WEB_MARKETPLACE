import { H1 } from '@starsuperscare/ui';

export function ReturnsPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4'>
      <H1 className='mb-6 text-center text-3xl font-bold'>
        Kebijakan Pembatalan, Pengembalian & Refund
      </H1>

      <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-8 prose prose-blue max-w-none text-gray-700 leading-relaxed'>
        <section>
          <h2 className='text-2xl font-bold text-gray-900 border-b pb-2 mb-4'>
            1. Kebijakan Pembatalan Pesanan
          </h2>
          <ul className='list-disc pl-5 space-y-2'>
            <li>
              Anda dapat membatalkan pesanan secara mandiri melalui menu{' '}
              <strong>Lacak Pesanan</strong> atau <strong>Detail Pesanan</strong>{' '}
              selama status pesanan masih{' '}
              <span className='bg-gray-100 px-2 py-0.5 rounded text-sm'>Menunggu Pembayaran</span>
              {' '}
              atau <span className='bg-gray-100 px-2 py-0.5 rounded text-sm'>Dibayar</span>{' '}
              (belum diproses/dikirim).
            </li>
            <li>
              Apabila Anda telah melakukan pembayaran, dana akan otomatis diproses untuk{' '}
              <em>Refund</em>{' '}
              dan dikembalikan ke metode pembayaran awal Anda dalam waktu 1-3 hari kerja.
            </li>
            <li>
              Jika pesanan sudah dalam status{' '}
              <span className='bg-gray-100 px-2 py-0.5 rounded text-sm'>Dikirim</span>, tombol
              pembatalan akan dinonaktifkan secara otomatis dan Anda harus menggunakan fitur
              Pengembalian Barang saat barang sampai.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 border-b pb-2 mb-4'>
            2. Syarat Pengembalian Barang (Retur)
          </h2>
          <p>
            Jika Anda tidak sepenuhnya puas dengan pembelian Anda, kami di sini untuk membantu.
            Syarat utama pengajuan pengembalian adalah:
          </p>
          <ul className='list-disc pl-5 space-y-2 mt-3'>
            <li>
              <strong>Batas Waktu:</strong> Pengajuan pengembalian maksimal <strong>7 hari</strong>
              {' '}
              setelah barang berstatus "Terkirim" / "Berhasil".
            </li>
            <li>
              <strong>Kondisi Barang:</strong>{' '}
              Barang harus dalam kondisi yang sama seperti saat diterima (belum digunakan) dan
              lengkap dengan kemasan aslinya.
            </li>
            <li>
              <strong>Alasan Sah:</strong>{' '}
              Barang cacat pabrik, rusak dalam pengiriman, pesanan tidak sesuai deskripsi, atau
              varian salah.
            </li>
            <li>
              <strong>Bukti:</strong> Anda <strong>wajib</strong>{' '}
              menyertakan bukti berupa foto dan video *unboxing* secara jelas.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 border-b pb-2 mb-4'>
            3. Cara Mengajukan Pengembalian
          </h2>
          <ol className='list-decimal pl-5 space-y-2'>
            <li>
              Buka halaman <strong>Lacak Pesanan</strong>{' '}
              atau klik tautan pelacakan yang dikirimkan ke email Anda.
            </li>
            <li>
              Pada halaman Detail Pesanan yang telah "Berhasil", klik tombol{' '}
              <strong>Ajukan Pengembalian</strong>.
            </li>
            <li>Pilih resolusi pengembalian (Pengembalian Dana Penuh atau Tukar Barang).</li>
            <li>
              Isi form alasan pengembalian secara detail beserta unggah foto/video bukti kerusakan.
            </li>
            <li>
              Kirim pengajuan, dan Admin kami akan mereview permohonan Anda dalam waktu 1-2 hari
              kerja.
            </li>
          </ol>
        </section>

        <section>
          <h2 className='text-2xl font-bold text-gray-900 border-b pb-2 mb-4'>
            4. Proses Pengembalian Dana (Refund)
          </h2>
          <p>
            Status pengajuan pengembalian (Disetujui/Ditolak) beserta alasan lengkap dari Admin akan
            ditampilkan secara transparan di halaman Detail Pesanan Anda.
          </p>
          <ul className='list-disc pl-5 space-y-2 mt-3'>
            <li>
              Jika pengajuan disetujui, kami akan memulai proses pengembalian dana ke metode
              pembayaran Anda.
            </li>
            <li>
              Anda akan menerima dana tersebut dalam{' '}
              <strong>1-3 hari kerja</strong>, tergantung pada kebijakan pihak bank atau e-wallet
              Anda.
            </li>
            <li>
              Untuk pengembalian barang, biaya ongkos kirim pengembalian (Return Shipping) ke gudang
              kami mungkin menjadi tanggungan Anda, kecuali kesalahan murni dari pihak toko.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
