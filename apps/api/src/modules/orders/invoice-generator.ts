import { PutObjectCommand, S3Client } from 'npm:@aws-sdk/client-s3@3';
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

// ─── R2 Invoice Client ────────────────────────────────────────────────────────
// Uses the SECOND R2 account dedicated for invoice PDFs.
// All credentials read from env — no hardcoded values.

function buildInvoiceR2Client(): S3Client {
  const accountId = Deno.env.get('R2_ACCOUNT_ID_2');
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID_2');
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY_2');
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
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: {
    productName: string;
    variantSku: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress?: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const LINE_H = 18;

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

export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const ML = 48; // margin left
  const MR = width - ML; // margin right

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);

  const ORANGE = rgb(0.95, 0.36, 0.0);
  const DARK = rgb(0.1, 0.1, 0.1);
  const GRAY = rgb(0.45, 0.45, 0.45);
  const WHITE = rgb(1, 1, 1);

  let y = height - 48;

  // ── Header band ───────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: ORANGE });
  page.drawText('StarSuperScare', {
    x: ML,
    y: height - 48,
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
  page.drawText(`#${data.orderNumber}`, {
    x: MR - 90,
    y: height - 56,
    size: 9,
    font: fontReg,
    color: rgb(1, 0.9, 0.8),
  });

  y = height - 100;

  // ── Order meta ────────────────────────────────────────────────────────────
  const orderDate = new Date(data.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  page.drawText(`Tanggal Pesanan: ${orderDate}`, {
    x: ML,
    y,
    size: 9,
    font: fontReg,
    color: GRAY,
  });
  page.drawText(`Kepada: ${data.customerName}`, {
    x: ML,
    y: y - LINE_H,
    size: 9,
    font: fontReg,
    color: GRAY,
  });
  page.drawText(data.customerEmail, {
    x: ML,
    y: y - LINE_H * 2,
    size: 9,
    font: fontReg,
    color: GRAY,
  });

  // ── Shipping address (right column) ───────────────────────────────────────
  if (data.shippingAddress) {
    const sa = data.shippingAddress;
    const rx = width / 2 + 10;
    page.drawText('Alamat Pengiriman', { x: rx, y, size: 9, font: fontBold, color: DARK });
    page.drawText(sa.recipientName, { x: rx, y: y - LINE_H, size: 9, font: fontReg, color: GRAY });
    page.drawText(sa.phone, { x: rx, y: y - LINE_H * 2, size: 9, font: fontReg, color: GRAY });
    const addr = `${sa.addressLine1}${sa.addressLine2 ? ', ' + sa.addressLine2 : ''}`;
    page.drawText(addr.substring(0, 55), {
      x: rx,
      y: y - LINE_H * 3,
      size: 8,
      font: fontReg,
      color: GRAY,
    });
    page.drawText(
      `${sa.district}, ${sa.city}, ${sa.province} ${sa.postalCode}`,
      { x: rx, y: y - LINE_H * 4, size: 8, font: fontReg, color: GRAY },
    );
  }

  y -= LINE_H * 4 + 24;
  drawHRule(page, y, ML, width);
  y -= 14;

  // ── Items table header ────────────────────────────────────────────────────
  page.drawRectangle({ x: ML, y: y - 6, width: MR - ML, height: 22, color: rgb(0.97, 0.97, 0.97) });
  const cols = {
    no: ML + 4,
    product: ML + 24,
    sku: ML + 230,
    qty: ML + 330,
    price: ML + 380,
    total: MR - 60,
  };

  page.drawText('No', { x: cols.no, y, size: 8, font: fontBold, color: DARK });
  page.drawText('Produk', { x: cols.product, y, size: 8, font: fontBold, color: DARK });
  page.drawText('SKU', { x: cols.sku, y, size: 8, font: fontBold, color: DARK });
  page.drawText('Qty', { x: cols.qty, y, size: 8, font: fontBold, color: DARK });
  page.drawText('Harga', { x: cols.price, y, size: 8, font: fontBold, color: DARK });
  page.drawText('Total', { x: cols.total, y, size: 8, font: fontBold, color: DARK });

  y -= 20;

  // ── Items rows ────────────────────────────────────────────────────────────
  data.items.forEach((item, i) => {
    const lineTotal = item.quantity * item.price;
    const rowY = y - i * LINE_H;
    if (i % 2 === 0) {
      page.drawRectangle({
        x: ML,
        y: rowY - 5,
        width: MR - ML,
        height: LINE_H,
        color: rgb(1, 1, 1),
      });
    }
    page.drawText(String(i + 1), { x: cols.no, y: rowY, size: 8, font: fontReg, color: GRAY });
    const pname = item.productName.length > 30
      ? item.productName.substring(0, 28) + '…'
      : item.productName;
    page.drawText(pname, { x: cols.product, y: rowY, size: 8, font: fontReg, color: DARK });
    page.drawText(item.variantSku.substring(0, 18), {
      x: cols.sku,
      y: rowY,
      size: 7,
      font: fontReg,
      color: GRAY,
    });
    page.drawText(String(item.quantity), {
      x: cols.qty,
      y: rowY,
      size: 8,
      font: fontReg,
      color: DARK,
    });
    page.drawText(fmt(item.price), { x: cols.price, y: rowY, size: 8, font: fontReg, color: DARK });
    page.drawText(fmt(lineTotal), { x: cols.total, y: rowY, size: 8, font: fontBold, color: DARK });
  });

  y -= data.items.length * LINE_H + 16;
  drawHRule(page, y, ML, width);
  y -= 16;

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalsX = MR - 220;
  const valX = MR - 10;

  const drawRow = (label: string, value: string, bold = false, color = GRAY, valueColor = DARK) => {
    page.drawText(label, {
      x: totalsX,
      y,
      size: 9,
      font: bold ? fontBold : fontReg,
      color,
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

  drawRow('Subtotal Produk', fmt(data.subtotal));
  drawRow('Ongkos Kirim', fmt(data.shipping));
  if (data.tax > 0) drawRow('Pajak', fmt(data.tax));
  if (data.discount > 0) {
    drawRow('Diskon', `- ${fmt(data.discount)}`, false, rgb(0.1, 0.6, 0.3), rgb(0.1, 0.6, 0.3));
  }

  drawHRule(page, y + 4, totalsX, width);
  y -= 8;
  drawRow('TOTAL BELANJA', fmt(data.total), true, DARK, ORANGE);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = 36;
  page.drawRectangle({ x: 0, y: 0, width, height: 30, color: ORANGE });
  page.drawText('Terima kasih atas kepercayaan Anda berbelanja di StarSuperScare!', {
    x: ML,
    y: footerY - 20,
    size: 8,
    font: fontReg,
    color: WHITE,
  });
  page.drawText('starsuperscare.com', {
    x: MR - 100,
    y: footerY - 20,
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
): Promise<string> {
  const client = buildInvoiceR2Client();
  const bucket = Deno.env.get('R2_BUCKET_NAME_2') ?? 'invoicegen';
  const publicBase = Deno.env.get('R2_PUBLIC_URL_2') ?? '';

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: pdfBytes,
    ContentType: 'application/pdf',
    CacheControl: 'public, max-age=31536000, immutable', // Cache forever (content-addressed)
  });

  await client.send(cmd);
  return `${publicBase}/${objectKey}`;
}
