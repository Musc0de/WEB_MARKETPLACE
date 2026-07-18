import { H1 } from '@starsuperscare/ui';

export function ReturnsPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500'>
      <div className='mb-10 text-center'>
        <H1 className='tracking-tight'>Kebijakan Pembatalan, Pengembalian & Refund</H1>
        <p className='text-muted-foreground mt-3 font-medium'>
          Pahami hak Anda serta langkah-langkah yang harus dilakukan saat mengajukan pengembalian.
        </p>
      </div>

      <div className='bg-card p-6 md:p-10 rounded-3xl shadow-sm border border-border/60 space-y-12 text-muted-foreground leading-relaxed font-medium'>
        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              1
            </span>
            Kebijakan Pembatalan Pesanan
          </h2>
          <ul className='list-disc pl-5 space-y-3 marker:text-indigo-500'>
            <li>
              Anda dapat membatalkan pesanan secara mandiri melalui menu{' '}
              <strong className='text-foreground'>Lacak Pesanan</strong> atau{' '}
              <strong className='text-foreground'>Detail Pesanan</strong>{' '}
              selama status pesanan masih{' '}
              <span className='bg-muted px-2 py-0.5 rounded text-sm text-foreground font-bold border border-border/60'>
                Menunggu Pembayaran
              </span>{' '}
              atau{' '}
              <span className='bg-muted px-2 py-0.5 rounded text-sm text-foreground font-bold border border-border/60'>
                Dibayar
              </span>{' '}
              (belum diproses/dikirim).
            </li>
            <li>
              Apabila Anda telah melakukan pembayaran, dana akan otomatis diproses untuk{' '}
              <em className='text-foreground font-bold'>Refund</em>{' '}
              dan dikembalikan ke metode pembayaran awal Anda dalam waktu 1-3 hari kerja.
            </li>
            <li>
              Jika pesanan sudah dalam status{' '}
              <span className='bg-muted px-2 py-0.5 rounded text-sm text-foreground font-bold border border-border/60'>
                Dikirim
              </span>, tombol pembatalan akan dinonaktifkan secara otomatis dan Anda harus
              menggunakan fitur Pengembalian Barang saat barang sampai.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              2
            </span>
            Syarat Pengembalian Barang (Retur)
          </h2>
          <p className='mb-4'>
            Jika Anda tidak sepenuhnya puas dengan pembelian Anda, kami di sini untuk membantu.
            Syarat utama pengajuan pengembalian adalah:
          </p>
          <ul className='list-disc pl-5 space-y-3 marker:text-indigo-500'>
            <li>
              <strong className='text-foreground'>Batas Waktu:</strong>{' '}
              Pengajuan pengembalian maksimal <strong className='text-foreground'>7 hari</strong>
              {' '}
              setelah barang berstatus "Terkirim" / "Berhasil".
            </li>
            <li>
              <strong className='text-foreground'>Kondisi Barang:</strong>{' '}
              Barang harus dalam kondisi yang sama seperti saat diterima (belum digunakan) dan
              lengkap dengan kemasan aslinya.
            </li>
            <li>
              <strong className='text-foreground'>Alasan Sah:</strong>{' '}
              Barang cacat pabrik, rusak dalam pengiriman, pesanan tidak sesuai deskripsi, atau
              varian salah.
            </li>
            <li>
              <strong className='text-foreground'>Bukti:</strong> Anda{' '}
              <strong className='text-destructive'>wajib</strong>{' '}
              menyertakan bukti berupa foto dan video <em className='text-foreground'>unboxing</em>
              {' '}
              secara jelas. Tanpa bukti unboxing yang valid, pengajuan akan ditolak.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              3
            </span>
            Cara Mengajukan Pengembalian
          </h2>
          <ol className='list-decimal pl-5 space-y-3 marker:text-indigo-500 marker:font-black'>
            <li>
              Buka halaman <strong className='text-foreground'>Lacak Pesanan</strong>{' '}
              atau klik tautan pelacakan yang dikirimkan ke email Anda.
            </li>
            <li>
              Pada halaman Detail Pesanan yang telah "Berhasil", klik tombol{' '}
              <strong className='text-foreground'>Ajukan Pengembalian</strong>.
            </li>
            <li>
              Pilih resolusi pengembalian (<strong className='text-foreground'>
                Pengembalian Dana Penuh
              </strong>{' '}
              atau <strong className='text-foreground'>Tukar Barang</strong>).
            </li>
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
          <h2 className='text-2xl font-black text-foreground border-b border-border/60 pb-3 mb-5 flex items-center gap-3'>
            <span className='bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm'>
              4
            </span>
            Proses Pengembalian Dana (Refund)
          </h2>
          <p className='mb-4'>
            Status pengajuan pengembalian (Disetujui/Ditolak) beserta alasan lengkap dari Admin akan
            ditampilkan secara transparan di halaman Detail Pesanan Anda.
          </p>
          <ul className='list-disc pl-5 space-y-3 marker:text-indigo-500'>
            <li>
              Jika disetujui untuk{' '}
              <strong>Refund</strong>, dana akan dikembalikan menggunakan metode pembayaran yang
              sama saat Anda melakukan transaksi.
            </li>
            <li>
              Proses Refund biasanya memakan waktu{' '}
              <strong className='text-foreground'>3-5 hari kerja</strong>{' '}
              tergantung pada kebijakan Bank atau penyedia e-Wallet Anda.
            </li>
            <li>
              Anda akan menerima notifikasi email otomatis segera setelah dana berhasil kami
              transfer kembali.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
