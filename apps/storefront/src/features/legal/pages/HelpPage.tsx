import { H1, Text } from '@starsuperscare/ui';

export function HelpPage() {
  return (
    <div className='max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-500'>
      <div className='mb-10 text-center'>
        <H1 className='tracking-tight'>Pusat Bantuan</H1>
        <Text className='text-muted-foreground mt-2 font-medium'>
          Temukan jawaban atas pertanyaan umum terkait layanan kami.
        </Text>
      </div>

      <div className='space-y-6'>
        <section className='bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border/60 hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 group'>
          <h2 className='text-xl font-black mb-4 text-foreground flex items-center gap-3'>
            <div className='w-1.5 h-6 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors'>
            </div>
            Bagaimana cara melacak pesanan saya?
          </h2>
          <Text className='text-muted-foreground leading-relaxed font-medium pl-4 md:pl-0'>
            Anda dapat melacak pesanan Anda melalui menu <strong>Lacak Pesanan</strong>{' '}
            di bagian atas atau bawah halaman. Anda akan memerlukan Nomor Resi yang dikirimkan ke
            email Anda saat pesanan diproses.
          </Text>
        </section>

        <section className='bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border/60 hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 group'>
          <h2 className='text-xl font-black mb-4 text-foreground flex items-center gap-3'>
            <div className='w-1.5 h-6 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors'>
            </div>
            Bagaimana cara melakukan pemesanan?
          </h2>
          <div className='text-muted-foreground leading-relaxed font-medium pl-4 md:pl-0 space-y-2'>
            <p>1. Cari produk yang Anda inginkan menggunakan kolom pencarian.</p>
            <p>
              2. Klik produk dan tekan tombol <strong>Tambah ke Keranjang</strong> atau{' '}
              <strong>Beli Sekarang</strong>.
            </p>
            <p>3. Isi detail pengiriman Anda dengan lengkap.</p>
            <p>4. Lakukan pembayaran sesuai dengan metode yang Anda pilih.</p>
          </div>
        </section>

        <section className='bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border/60 hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 group'>
          <h2 className='text-xl font-black mb-4 text-foreground flex items-center gap-3'>
            <div className='w-1.5 h-6 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors'>
            </div>
            Bisakah saya membatalkan pesanan saya?
          </h2>
          <Text className='text-muted-foreground leading-relaxed font-medium pl-4 md:pl-0'>
            Ya, pesanan dapat dibatalkan secara langsung melalui menu{' '}
            <strong className='text-foreground'>Detail Pesanan</strong>{' '}
            (bisa diakses via Lacak Pesanan), asalkan pesanan tersebut masih dalam status{' '}
            <strong className='text-foreground'>Menunggu Pembayaran</strong> atau{' '}
            <strong className='text-foreground'>Dibayar</strong>. Jika pesanan sudah diproses dan
            berstatus{' '}
            <strong className='text-foreground'>Dikirim</strong>, fitur pembatalan tidak dapat lagi
            digunakan. Jika Anda sudah membayar, dana akan otomatis di-refund ke metode pembayaran
            Anda.
          </Text>
        </section>

        <section className='bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border/60 hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 group'>
          <h2 className='text-xl font-black mb-4 text-foreground flex items-center gap-3'>
            <div className='w-1.5 h-6 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors'>
            </div>
            Bagaimana cara mengajukan komplain atau retur barang?
          </h2>
          <Text className='text-muted-foreground leading-relaxed font-medium pl-4 md:pl-0'>
            Kami memastikan setiap produk yang Anda beli sampai dengan aman di tangan Anda. Jika
            terdapat ketidaksesuaian atau cacat produk, Anda dapat mengajukan{' '}
            <strong className='text-foreground'>Pengembalian Barang</strong>{' '}
            melalui halaman Detail Pesanan Anda secara online. Anda memiliki waktu maksimal{' '}
            <strong className='text-foreground'>7 hari</strong>{' '}
            setelah status pesanan berubah menjadi "Terkirim" / "Berhasil" untuk melakukan
            pengajuan. Jangan lupa siapkan foto atau video bukti unboxing.
          </Text>
        </section>
      </div>
    </div>
  );
}
