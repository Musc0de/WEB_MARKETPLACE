import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

// ─── R2 Invoice Client ────────────────────────────────────────────────────────
// Uses the SECOND R2 account dedicated for invoice PDFs.

function buildInvoiceR2Client(): S3Client {
  const accountId = typeof Deno !== 'undefined'
    ? Deno.env.get('R2_ACCOUNT_ID_2')
    : process?.env?.['R2_ACCOUNT_ID_2'];
  const accessKeyId = typeof Deno !== 'undefined'
    ? Deno.env.get('R2_ACCESS_KEY_ID_2')
    : process?.env?.['R2_ACCESS_KEY_ID_2'];
  const secretAccessKey = typeof Deno !== 'undefined'
    ? Deno.env.get('R2_SECRET_ACCESS_KEY_2')
    : process?.env?.['R2_SECRET_ACCESS_KEY_2'];
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'R2 Invoice credentials (R2_ACCOUNT_ID_2 / R2_ACCESS_KEY_ID_2 / R2_SECRET_ACCESS_KEY_2) not configured',
    );
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// ─── PDF Generator ─────────────────────────────────────────────────────────────

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  createdAt: string;
  clientOrderTime?: string | undefined;
  customerName: string;
  customerEmail: string;
  orderStatus: string;
  paymentInfo?: {
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
    date: string;
    reference?: string | undefined;
    amountPaid: number;
  } | undefined;
  items: {
    productName: string;
    variantName: string;
    comparePrice: number;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  serviceFee: number;
  discount: number;
  total: number;
  billingAddress?: {
    recipientName?: string;
    fullName?: string;
    phone?: string;
    phoneNumber?: string;
    addressLine1?: string;
    streetAddress?: string;
    addressLine2?: string;
    district?: string;
    city: string;
    province: string;
    postalCode: string;
  } | undefined;
  shippingAddress?: {
    recipientName?: string;
    fullName?: string;
    phone?: string;
    phoneNumber?: string;
    addressLine1?: string;
    streetAddress?: string;
    addressLine2?: string;
    district?: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
  } | undefined;
  notes?: string | undefined;
}

const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

/**
 * Format tanggal/waktu ke format Indonesia 24 jam.
 */
function formatOrderDateTime(createdAt: string, clientOrderTime?: string): string {
  if (clientOrderTime) return clientOrderTime;
  try {
    return new Date(createdAt).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    });
  } catch {
    return createdAt;
  }
}

function drawHRule(
  page: any,
  y: number,
  marginL: number,
  width: number,
  color = rgb(0.85, 0.85, 0.85),
) {
  page.drawLine({
    start: { x: marginL, y },
    end: { x: width - marginL, y },
    thickness: 0.5,
    color,
  });
}

/** Gambar teks strikethrough (coret) dengan garis merah di tengah teks */
function drawStrikethrough(
  page: any,
  text: string,
  x: number,
  y: number,
  size: number,
  font: any,
  color: any,
) {
  page.drawText(text, { x, y, size, font, color });
  const textWidth = font.widthOfTextAtSize(text, size);
  const lineY = y + size * 0.35;
  page.drawLine({
    start: { x, y: lineY },
    end: { x: x + textWidth, y: lineY },
    thickness: 0.8,
    color,
  });
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const ML = 48; // margin left
  const MR = width - ML; // margin right

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);

  const ORANGE = rgb(0.95, 0.36, 0.0);
  const BLUE = rgb(0.1, 0.5, 1);
  const DARK = rgb(0.1, 0.1, 0.1);
  const GRAY = rgb(0.45, 0.45, 0.45);
  const LIGHT_GRAY = rgb(0.65, 0.65, 0.65);
  const WHITE = rgb(1, 1, 1);
  const RED = rgb(0.85, 0.1, 0.1);
  const GREEN = rgb(0.05, 0.6, 0.2);

  const isPaid = data.paymentInfo?.status === 'paid';
  const LINE_H = 16;

  let y = height - 48;

  // ── 1. Header & Store Identity ───────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: BLUE });
  page.drawText('StarSuperScare', {
    x: ML,
    y: height - 42,
    size: 22,
    font: fontBold,
    color: WHITE,
  });

  page.drawText('INVOICE', {
    x: MR - 90,
    y: height - 38,
    size: 20,
    font: fontBold,
    color: WHITE,
  });

  y = height - 100;

  // Store Identity (Left)
  page.drawText('StarSuperScare', { x: ML, y, size: 10, font: fontBold, color: DARK });
  page.drawText('Jalan Dokter Setiabudi No.106', {
    x: ML,
    y: y - LINE_H,
    size: 9,
    font: fontReg,
    color: GRAY,
  });
  page.drawText('Surakarta, Jawa Timur, 57139', {
    x: ML,
    y: y - LINE_H * 2,
    size: 9,
    font: fontReg,
    color: GRAY,
  });
  page.drawText('support@starsuperscare.com', {
    x: ML,
    y: y - LINE_H * 3,
    size: 9,
    font: fontReg,
    color: GRAY,
  });

  // Invoice Meta (Right)
  const metaX = width / 2 + 50;
  const orderDateTime = formatOrderDateTime(data.createdAt, data.clientOrderTime);
  page.drawText('Invoice No.', { x: metaX, y, size: 9, font: fontBold, color: DARK });
  page.drawText(`: ${data.invoiceNumber}`, {
    x: metaX + 60,
    y,
    size: 9,
    font: fontReg,
    color: DARK,
  });

  page.drawText('Order No.', { x: metaX, y: y - LINE_H, size: 9, font: fontBold, color: DARK });
  page.drawText(`: ${data.orderNumber}`, {
    x: metaX + 60,
    y: y - LINE_H,
    size: 9,
    font: fontReg,
    color: DARK,
  });

  page.drawText('Tanggal', { x: metaX, y: y - LINE_H * 2, size: 9, font: fontBold, color: DARK });
  page.drawText(`: ${orderDateTime}`, {
    x: metaX + 60,
    y: y - LINE_H * 2,
    size: 9,
    font: fontReg,
    color: DARK,
  });

  y -= LINE_H * 4 + 10;
  drawHRule(page, y, ML, width);
  y -= 20;

  // ── 2. Bill To, Ship To, Payment Info ───────────────────────────────────────
  const col1 = ML;
  const col2 = width / 2 - 40;
  const col3 = width / 2 + 80;

  page.drawText('DITAGIHKAN KEPADA', { x: col1, y, size: 9, font: fontBold, color: DARK });
  page.drawText('DIKIRIM KEPADA', { x: col2, y, size: 9, font: fontBold, color: DARK });
  page.drawText('INFORMASI PEMBAYARAN', { x: col3, y, size: 9, font: fontBold, color: DARK });

  y -= LINE_H + 4;

  // Billing Address
  const ba = data.billingAddress || data.shippingAddress;
  if (ba) {
    page.drawText(ba.fullName ?? ba.recipientName ?? data.customerName ?? '-', {
      x: col1,
      y,
      size: 9,
      font: fontBold,
      color: DARK,
    });
    page.drawText(`HP: ${ba.phoneNumber ?? ba.phone ?? '-'}`, {
      x: col1,
      y: y - 14,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
    const bAddr = `${ba.streetAddress ?? ba.addressLine1 ?? ''}${
      ba.addressLine2 ? ', ' + ba.addressLine2 : ''
    }`;
    const bAddrRows = bAddr.match(/.{1,35}(\s|$)/g) || [bAddr];
    let by = y - 28;
    bAddrRows.forEach((r) => {
      page.drawText(r.trim(), { x: col1, y: by, size: 8, font: fontReg, color: GRAY });
      by -= 12;
    });
    if (ba.district) {
      page.drawText(ba.district, { x: col1, y: by, size: 8, font: fontReg, color: GRAY });
      by -= 12;
    }
    const bCityProv = `${ba.city ?? '-'}, ${ba.province ?? '-'} ${ba.postalCode ?? ''}`;
    page.drawText(bCityProv, { x: col1, y: by, size: 8, font: fontReg, color: GRAY });
    page.drawText(data.customerEmail ?? '-', {
      x: col1,
      y: by - 14,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
  }

  // Shipping Address
  const sa = data.shippingAddress;
  const shipY = y;
  if (sa) {
    page.drawText(sa.fullName ?? sa.recipientName ?? data.customerName ?? '-', {
      x: col2,
      y: shipY,
      size: 9,
      font: fontBold,
      color: DARK,
    });
    page.drawText(`HP: ${sa.phoneNumber ?? sa.phone ?? '-'}`, {
      x: col2,
      y: shipY - 14,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
    const sAddr = `${sa.streetAddress ?? sa.addressLine1 ?? ''}${
      sa.addressLine2 ? ', ' + sa.addressLine2 : ''
    }`;
    const sAddrRows = sAddr.match(/.{1,35}(\s|$)/g) || [sAddr];
    let sy = shipY - 28;
    sAddrRows.forEach((r) => {
      page.drawText(r.trim(), { x: col2, y: sy, size: 8, font: fontReg, color: GRAY });
      sy -= 12;
    });
    if (sa.district) {
      page.drawText(sa.district, { x: col2, y: sy, size: 8, font: fontReg, color: GRAY });
      sy -= 12;
    }
    const sCityProv = `${sa.city ?? '-'}, ${sa.province ?? '-'} ${sa.postalCode ?? ''}`;
    page.drawText(sCityProv, { x: col2, y: sy, size: 8, font: fontReg, color: GRAY });
  }

  // Payment Info
  const pi = data.paymentInfo;
  let payY = y;
  if (pi) {
    page.drawText('Metode', { x: col3, y: payY, size: 8, font: fontBold, color: DARK });
    page.drawText(`: ${pi.method.toUpperCase()}`, {
      x: col3 + 50,
      y: payY,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
    payY -= 14;
    page.drawText('Status', { x: col3, y: payY, size: 8, font: fontBold, color: DARK });
    page.drawText(`: ${pi.status.toUpperCase()}`, {
      x: col3 + 50,
      y: payY,
      size: 8,
      font: fontBold,
      color: isPaid ? GREEN : RED,
    });
    payY -= 14;
    page.drawText('Waktu', { x: col3, y: payY, size: 8, font: fontBold, color: DARK });
    page.drawText(`: ${formatOrderDateTime(pi.date)}`, {
      x: col3 + 50,
      y: payY,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
    payY -= 14;
    if (pi.reference) {
      page.drawText('Referensi', { x: col3, y: payY, size: 8, font: fontBold, color: DARK });
      page.drawText(`: ${pi.reference}`, {
        x: col3 + 50,
        y: payY,
        size: 8,
        font: fontReg,
        color: GRAY,
      });
    }
  }

  y -= 110;

  // ── 3. Table Items ────────────────────────────────────────────────────────
  page.drawRectangle({
    x: ML,
    y: y - 6,
    width: width - ML * 2,
    height: 22,
    color: rgb(0.15, 0.15, 0.15),
  });

  const cols = {
    no: ML + 4,
    product: ML + 22,
    variant: ML + 22,
    hargaNormal: ML + 230,
    harga: ML + 300,
    qty: ML + 370,
    total: MR - 50, // di-align kanan nanti
  };

  const headerTextColor = WHITE;
  page.drawText('No', { x: cols.no, y, size: 8, font: fontBold, color: headerTextColor });
  page.drawText('Produk / Varian', {
    x: cols.product,
    y,
    size: 8,
    font: fontBold,
    color: headerTextColor,
  });
  page.drawText('H. Normal', {
    x: cols.hargaNormal,
    y,
    size: 8,
    font: fontBold,
    color: headerTextColor,
  });
  page.drawText('Harga', { x: cols.harga, y, size: 8, font: fontBold, color: headerTextColor });
  page.drawText('Qty', { x: cols.qty, y, size: 8, font: fontBold, color: headerTextColor });
  page.drawText('Total', {
    x: cols.total - 10,
    y,
    size: 8,
    font: fontBold,
    color: headerTextColor,
  });

  y -= 22;

  let totalItemDiscount = 0;
  let totalNormalSubtotal = 0;

  data.items.forEach((item, index) => {
    const normalPrice = (item.comparePrice > item.price) ? item.comparePrice : item.price;
    totalNormalSubtotal += normalPrice * item.quantity;
    totalItemDiscount += (normalPrice - item.price) * item.quantity;

    const textY = y - 10;

    // No
    page.drawText(String(index + 1), { x: cols.no, y: textY, size: 8, font: fontReg, color: GRAY });

    // Produk
    let pLabel = item.productName;
    if (pLabel.length > 35) pLabel = pLabel.substring(0, 33) + '...';
    page.drawText(pLabel, { x: cols.product, y: textY, size: 8, font: fontBold, color: DARK });

    // Varian
    if (item.variantName) {
      let vLabel = item.variantName;
      if (vLabel.length > 40) vLabel = vLabel.substring(0, 38) + '...';
      page.drawText(vLabel, {
        x: cols.variant,
        y: textY - 12,
        size: 7,
        font: fontReg,
        color: BLUE,
      });
    }

    // H. Normal (Coret)
    const hasDiscount = item.comparePrice > item.price;
    if (hasDiscount) {
      drawStrikethrough(page, fmt(item.comparePrice), cols.hargaNormal, textY, 8, fontReg, RED);
    } else {
      page.drawText('-', {
        x: cols.hargaNormal + 8,
        y: textY,
        size: 8,
        font: fontReg,
        color: LIGHT_GRAY,
      });
    }

    // Harga bayar
    page.drawText(fmt(item.price), {
      x: cols.harga,
      y: textY,
      size: 8,
      font: fontReg,
      color: DARK,
    });

    // Qty
    page.drawText(String(item.quantity), {
      x: cols.qty,
      y: textY,
      size: 8,
      font: fontReg,
      color: DARK,
    });

    // Total per item
    const itemTotalStr = fmt(item.price * item.quantity);
    const itW = fontBold.widthOfTextAtSize(itemTotalStr, 8);
    page.drawText(itemTotalStr, {
      x: cols.total + 18 - itW,
      y: textY,
      size: 8,
      font: fontBold,
      color: ORANGE,
    });

    y -= 30;
    if (item.variantName) y -= 12;

    drawHRule(page, y + 6, ML, width, rgb(0.92, 0.92, 0.92));
  });

  y -= 10;

  // ── 4. Rincian Pembayaran Lengkap ───────────────────────────────────────────
  const totalsX = width / 2 + 50;
  const valX = MR;

  const drawRow = (
    label: string,
    value: string,
    bold = false,
    labelColor = GRAY,
    valueColor = DARK,
  ) => {
    page.drawText(label, {
      x: totalsX,
      y,
      size: 9,
      font: bold ? fontBold : fontReg,
      color: labelColor,
    });
    const valW = (bold ? fontBold : fontReg).widthOfTextAtSize(value, 9);
    page.drawText(value, {
      x: valX - valW,
      y,
      size: 9,
      font: bold ? fontBold : fontReg,
      color: valueColor,
    });
    y -= LINE_H;
  };

  drawRow('Subtotal harga normal', fmt(totalNormalSubtotal));
  if (totalItemDiscount > 0) {
    drawRow('Diskon produk', `- ${fmt(totalItemDiscount)}`, false, GREEN, GREEN);
  }
  if (data.discount > 0) {
    drawRow('Voucher', `- ${fmt(data.discount)}`, false, GREEN, GREEN);
  }
  drawRow('Ongkos kirim', fmt(data.shipping));
  if (data.tax > 0) drawRow('Pajak', fmt(data.tax));
  if (data.serviceFee > 0) drawRow('Biaya layanan', fmt(data.serviceFee));

  drawHRule(page, y + 4, totalsX, width);
  y -= 8;

  drawRow('Total', fmt(data.total), true, DARK, ORANGE);

  const amountPaid = data.paymentInfo?.amountPaid ?? 0;
  drawRow('Jumlah dibayar', fmt(amountPaid), true, DARK, isPaid ? GREEN : DARK);

  const remaining = Math.max(0, data.total - amountPaid);
  drawRow('Sisa pembayaran', fmt(remaining), true, DARK, remaining > 0 ? RED : GREEN);

  // ── 5. Catatan dan Ketentuan ────────────────────────────────────────────────
  y -= 20;

  page.drawText('Catatan dan Ketentuan', { x: ML, y, size: 10, font: fontBold, color: DARK });
  y -= LINE_H;

  if (data.notes) {
    page.drawText(`Catatan Pesanan: ${data.notes}`, {
      x: ML,
      y,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
    y -= 12;
  }

  page.drawText('Kebijakan Pengembalian:', { x: ML, y, size: 8, font: fontBold, color: GRAY });
  page.drawText(
    'Harap sertakan video unboxing utuh jika ada komplain maksimal 2x24 jam sejak paket diterima.',
    { x: ML, y: y - 12, size: 8, font: fontReg, color: GRAY },
  );
  y -= 26;

  page.drawText('Kontak Bantuan:', { x: ML, y, size: 8, font: fontBold, color: GRAY });
  page.drawText('Silakan hubungi support@starsuperscare.com untuk bantuan terkait pesanan ini.', {
    x: ML,
    y: y - 12,
    size: 8,
    font: fontReg,
    color: GRAY,
  });
  y -= 26;

  page.drawText('Verifikasi Invoice:', { x: ML, y, size: 8, font: fontBold, color: GRAY });
  page.drawText(`https://starsuperscare.com/orders/${data.orderId}`, {
    x: ML,
    y: y - 12,
    size: 8,
    font: fontReg,
    color: BLUE,
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height: 30, color: DARK });
  page.drawText('Terima kasih atas kepercayaan Anda berbelanja di StarSuperScare!', {
    x: ML,
    y: 10,
    size: 8,
    font: fontReg,
    color: WHITE,
  });
  page.drawText('starsuperscare.com', {
    x: MR - 100,
    y: 10,
    size: 8,
    font: fontBold,
    color: WHITE,
  });

  return await doc.save();
}

// ─── Upload PDF to R2 Invoice Bucket ──────────────────────────────────────────

export async function uploadInvoicePDF(
  pdfBytes: Uint8Array,
  objectKey: string,
): Promise<void> {
  const client = buildInvoiceR2Client();
  const bucket =
    (typeof Deno !== 'undefined'
      ? Deno.env.get('R2_BUCKET_NAME_2')
      : process?.env?.['R2_BUCKET_NAME_2']) ?? '';

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: pdfBytes,
    ContentType: 'application/pdf',
    CacheControl: 'no-cache, no-store, must-revalidate',
  });

  await client.send(cmd);
}

// ─── Get Signed URL from R2 Invoice Bucket ────────────────────────────────────

export async function getInvoiceSignedUrl(objectKey: string): Promise<string> {
  const client = buildInvoiceR2Client();
  const bucket =
    (typeof Deno !== 'undefined'
      ? Deno.env.get('R2_BUCKET_NAME_2')
      : process?.env?.['R2_BUCKET_NAME_2']) ?? '';

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
  });

  // URL valid for 3600 seconds (60 minutes)
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

// ─── Delete PDF from R2 Invoice Bucket ────────────────────────────────────────

export async function deleteInvoicePDF(objectKey: string): Promise<void> {
  const client = buildInvoiceR2Client();
  const bucket =
    (typeof Deno !== 'undefined'
      ? Deno.env.get('R2_BUCKET_NAME_2')
      : process?.env?.['R2_BUCKET_NAME_2']) ?? '';

  const cmd = new DeleteObjectCommand({
    Bucket: bucket,
    Key: objectKey,
  });

  await client.send(cmd);
}
