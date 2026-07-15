export const templates = {
  verification: (code: string) => ({
    subject: 'Verifikasi Akun Anda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <h2 style="color: #111827; text-align: center;">Verifikasi Akun StarSuperScare</h2>
        <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <p style="color: #4b5563; font-size: 16px;">Kode verifikasi Anda adalah:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5; margin: 20px 0;">${code}</div>
          <p style="color: #6b7280; font-size: 14px;">Kode ini berlaku selama 15 menit.</p>
        </div>
      </div>
    `,
    text: `Kode verifikasi Anda adalah: ${code}`,
  }),
  resetPassword: (url: string) => ({
    subject: 'Reset Kata Sandi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <h2 style="color: #111827; text-align: center;">Reset Kata Sandi</h2>
        <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <p style="color: #4b5563; font-size: 16px;">Anda meminta untuk mereset kata sandi. Klik tombol di bawah ini untuk melanjutkan:</p>
          <a href="${url}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Kata Sandi</a>
          <p style="color: #6b7280; font-size: 14px;">Tautan ini aman dan akan kadaluarsa segera.</p>
        </div>
      </div>
    `,
    text: `Silakan akses tautan ini untuk mereset kata sandi Anda: ${url}`,
  }),
  invoice: (data: {
    orderNumber: string;
    customerName?: string;
    supportEmail?: string;
    websiteUrl?: string;
    currentYear?: number;
    logoUrl?: string;
  }): { subject: string; html: string; text: string } => {
    const customerName = data.customerName || 'Pelanggan';
    const supportEmail = data.supportEmail || 'support@starsuperscare.net';
    const websiteUrl = data.websiteUrl || 'https://www.starsuperscare.net';
    const currentYear = data.currentYear || new Date().getFullYear();

    return {
      subject: `Tagihan Pesanan ${data.orderNumber} — StarSuperScare Marketplace`,
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invoice Anda — StarSuperScare Marketplace</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    a {
      text-decoration: none;
      color: #2563eb;
    }
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .card {
        padding: 24px !important;
        border-radius: 0 !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      .card {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
      }
      .text-main {
        color: #f9fafb !important;
      }
      .text-muted {
        color: #9ca3af !important;
      }
      .bg-muted {
        background-color: #374151 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #f3f4f6; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Pesanan Anda sedang diproses. Invoice telah kami lampirkan di email ini.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <a href="${websiteUrl}" style="text-decoration: none;">
                ${data.logoUrl 
                  ? `<img src="${data.logoUrl}" alt="StarSuperScare Marketplace" width="160" style="display: block; max-width: 160px; border: 0;" />` 
                  : `<h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #1e3a8a;">StarSuperScare Marketplace</h1>`
                }
              </a>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td class="card" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              
              <!-- Icon -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="width: 64px; height: 64px; background-color: #eff6ff; border-radius: 50%; display: inline-block; line-height: 64px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/2563eb/document.png" alt="Invoice Icon" width="32" height="32" style="vertical-align: middle; display: inline-block;" />
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h2 class="text-main" style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                Terima kasih atas pesanan Anda!
              </h2>

              <!-- Body Text -->
              <p class="text-main" style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Halo ${customerName},
              </p>
              <p class="text-main" style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Pesanan Anda dengan nomor tagihan <strong>${data.orderNumber}</strong> sedang kami proses. 
                Sesuai dengan permintaan Anda, kami telah melampirkan invoice resmi dalam format PDF pada email ini.
              </p>

              <!-- Security Information -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-muted" style="background-color: #f8fafc; border-radius: 6px; padding: 16px; margin-top: 32px;">
                <tr>
                  <td valign="top" style="padding-right: 12px;">
                    <img src="https://img.icons8.com/ios-filled/50/64748b/info.png" alt="Info" width="20" height="20" style="display: block;" />
                  </td>
                  <td>
                    <p class="text-muted" style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
                      Harap simpan lampiran invoice PDF ini sebagai bukti pembelian yang sah. Anda juga dapat mengakses seluruh histori transaksi melalui akun StarSuperScare Marketplace Anda.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Support & Footer -->
          <tr>
            <td align="center" style="padding-top: 32px; padding-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                Mengalami kendala? Hubungi <a href="mailto:${supportEmail}" style="color: #2563eb;">${supportEmail}</a>
              </p>
              <p style="margin: 0 0 16px 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                Email ini dibuat secara otomatis oleh StarSuperScare Marketplace. Mohon jangan membalas langsung ke email ini.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                &copy; ${currentYear} StarSuperScare Marketplace. Seluruh hak dilindungi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Terima kasih atas pesanan Anda! — StarSuperScare Marketplace

Halo ${customerName},

Pesanan Anda dengan nomor tagihan ${data.orderNumber} sedang kami proses.
Sesuai dengan permintaan Anda, kami telah melampirkan invoice resmi dalam format PDF pada email ini.

Harap simpan lampiran invoice PDF ini sebagai bukti pembelian yang sah.

Mengalami kendala? Hubungi ${supportEmail}

© ${currentYear} StarSuperScare Marketplace. Seluruh hak dilindungi.
      `.trim(),
    };
  },
  'account-activation': (activationUrl: string) => ({
    subject: 'Aktivasi Akun StarSuperScare Anda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <h2 style="color: #111827; text-align: center;">Selamat Datang di StarSuperScare!</h2>
        <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <p style="color: #4b5563; font-size: 16px;">Silakan aktivasi akun Anda untuk mulai berbelanja.</p>
          <a href="${activationUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Aktivasi Akun</a>
        </div>
      </div>
    `,
    text: `Aktivasi akun Anda melalui tautan: ${activationUrl}`,
  }),
  'email_verification_requested': (data: {
    verificationUrl: string;
    customerName?: string;
    expirationMinutes?: number;
    supportEmail?: string;
    websiteUrl?: string;
    currentYear?: number;
    logoUrl?: string;
  }): { subject: string; html: string; text: string } => {
    const customerName = data.customerName || 'Pelanggan';
    const expirationMinutes = data.expirationMinutes || 1440;
    const supportEmail = data.supportEmail || 'support@starsuperscare.net';
    const websiteUrl = data.websiteUrl || 'https://www.starsuperscare.net';
    const currentYear = data.currentYear || new Date().getFullYear();
    
    return {
      subject: 'Verifikasi Email Anda — StarSuperScare Marketplace',
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verifikasi Email Anda — StarSuperScare Marketplace</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    a {
      text-decoration: none;
      color: #2563eb;
    }
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .card {
        padding: 24px !important;
        border-radius: 0 !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      .card {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
      }
      .text-main {
        color: #f9fafb !important;
      }
      .text-muted {
        color: #9ca3af !important;
      }
      .bg-muted {
        background-color: #374151 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #f3f4f6; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Selesaikan verifikasi email untuk mengaktifkan akun StarSuperScare Marketplace Anda.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <a href="${websiteUrl}" style="text-decoration: none;">
                ${data.logoUrl 
                  ? `<img src="${data.logoUrl}" alt="StarSuperScare Marketplace" width="160" style="display: block; max-width: 160px; border: 0;" />` 
                  : `<h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #1e3a8a;">StarSuperScare Marketplace</h1>`
                }
              </a>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td class="card" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              
              <!-- Icon -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="width: 64px; height: 64px; background-color: #eff6ff; border-radius: 50%; display: inline-block; line-height: 64px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/2563eb/secured-letter--v1.png" alt="Verify Icon" width="32" height="32" style="vertical-align: middle; display: inline-block;" />
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h2 class="text-main" style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                Verifikasi Email Anda
              </h2>

              <!-- Body Text -->
              <p class="text-main" style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Halo ${customerName},
              </p>
              <p class="text-main" style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Terima kasih telah membuat akun di StarSuperScare Marketplace. Verifikasi alamat email Anda untuk mengaktifkan akun dan membantu menjaga keamanan informasi Anda.
              </p>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div>
                      <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${data.verificationUrl}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="10%" stroke="f" fillcolor="#2563eb">
                          <w:anchorlock/>
                          <center>
                      <![endif]-->
                          <a href="${data.verificationUrl}" style="background-color: #2563eb; border-radius: 6px; color: #ffffff; display: inline-block; font-family: sans-serif; font-size: 16px; font-weight: bold; line-height: 48px; text-align: center; text-decoration: none; width: 240px; -webkit-text-size-adjust: none;">Verifikasi Alamat Email</a>
                      <!--[if mso]>
                          </center>
                        </v:roundrect>
                      <![endif]-->
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiration -->
              <p class="text-muted" style="margin: 0 0 24px 0; font-size: 14px; line-height: 20px; color: #6b7280; text-align: center;">
                Link verifikasi ini berlaku selama ${expirationMinutes} menit.
              </p>

              <!-- Fallback URL -->
              <p class="text-main" style="margin: 0 0 8px 0; font-size: 14px; line-height: 20px; color: #374151;">
                Jika tombol tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:
              </p>
              <div class="bg-muted" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 32px; word-break: break-all;">
                <a href="${data.verificationUrl}" style="font-size: 13px; color: #2563eb; text-decoration: underline;">${data.verificationUrl}</a>
              </div>

              <!-- Security Information -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-muted" style="background-color: #f8fafc; border-radius: 6px; padding: 16px;">
                <tr>
                  <td valign="top" style="padding-right: 12px;">
                    <img src="https://img.icons8.com/ios-filled/50/64748b/shield.png" alt="Security" width="20" height="20" style="display: block;" />
                  </td>
                  <td>
                    <p class="text-muted" style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
                      Anda menerima email ini karena terdapat permintaan pembuatan atau verifikasi akun menggunakan alamat email ini. Jika Anda tidak membuat akun StarSuperScare Marketplace, abaikan email ini. Jangan membagikan tautan verifikasi kepada siapa pun.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Support & Footer -->
          <tr>
            <td align="center" style="padding-top: 32px; padding-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                Mengalami kendala? Hubungi <a href="mailto:${supportEmail}" style="color: #2563eb;">${supportEmail}</a>
              </p>
              <p style="margin: 0 0 16px 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                Email ini dibuat secara otomatis oleh StarSuperScare Marketplace. Mohon jangan membalas langsung ke email ini.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                &copy; ${currentYear} StarSuperScare Marketplace. Seluruh hak dilindungi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Verifikasi Email Anda — StarSuperScare Marketplace

Halo ${customerName},

Terima kasih telah membuat akun di StarSuperScare Marketplace.
Verifikasi alamat email Anda untuk mengaktifkan akun dan membantu menjaga keamanan informasi Anda.

Klik atau salin tautan berikut ke browser Anda untuk memverifikasi email Anda:
${data.verificationUrl}

Link verifikasi ini berlaku selama ${expirationMinutes} menit.

Jika Anda tidak membuat akun StarSuperScare Marketplace, abaikan email ini. Jangan membagikan tautan verifikasi kepada siapa pun.

Mengalami kendala? Hubungi ${supportEmail}

© ${currentYear} StarSuperScare Marketplace. Seluruh hak dilindungi.
      `.trim(),
    };
  },
};
