import { H1, H2, Text } from '@starsuperscare/ui';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm mt-8 mb-16">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <H1>Kebijakan Privasi</H1>
          <Text className="text-gray-500">Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID')}</Text>
        </div>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <H2 className="text-xl">1. Pengumpulan Informasi</H2>
            <Text>
              Kami mengumpulkan informasi dari Anda ketika Anda mendaftar di situs kami, masuk ke akun Anda, melakukan pembelian, mengikuti kontes, atau ketika Anda keluar dari situs. Informasi yang dikumpulkan mencakup nama, alamat email, nomor telepon, dan kartu kredit.
            </Text>
          </section>

          <section className="space-y-3">
            <H2 className="text-xl">2. Penggunaan Informasi</H2>
            <Text>
              Setiap informasi yang kami kumpulkan dari Anda dapat digunakan untuk menyesuaikan pengalaman Anda dan menanggapi kebutuhan individual Anda, menyediakan konten periklanan yang disesuaikan, meningkatkan situs web kami, dan meningkatkan layanan pelanggan kami.
            </Text>
          </section>

          <section className="space-y-3">
            <H2 className="text-xl">3. Perlindungan Informasi</H2>
            <Text>
              Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi pribadi Anda. Kami menggunakan enkripsi mutakhir untuk melindungi informasi sensitif yang dikirimkan secara online.
            </Text>
          </section>

          <section className="space-y-3">
            <H2 className="text-xl">4. Penggunaan Cookie</H2>
            <Text>
              Ya. Cookie adalah file kecil yang ditransfer situs atau penyedia layanannya ke hard drive komputer Anda melalui browser Web Anda (jika Anda mengizinkan). Hal ini memungkinkan situs untuk mengenali browser Anda dan menangkap serta mengingat informasi tertentu.
            </Text>
          </section>

          <section className="space-y-3">
            <H2 className="text-xl">5. Pengungkapan kepada Pihak Ketiga</H2>
            <Text>
              Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda yang dapat diidentifikasi secara pribadi ke pihak luar. Ini tidak termasuk pihak ketiga tepercaya yang membantu kami beroperasi, melakukan bisnis, atau melayani Anda.
            </Text>
          </section>

          <section className="space-y-3">
            <H2 className="text-xl">6. Persetujuan Anda</H2>
            <Text>
              Dengan menggunakan situs kami, Anda menyetujui Kebijakan Privasi kami. Jika kami memutuskan untuk mengubah kebijakan privasi kami, kami akan memposting perubahan tersebut di halaman ini.
            </Text>
          </section>
        </div>
      </div>
    </div>
  );
}
