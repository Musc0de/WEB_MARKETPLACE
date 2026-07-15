import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

export async function generateInvoicePdf(
  invoiceNumber: string,
  orderData: Record<string, any>,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const blackColor = rgb(0, 0, 0);

  const { height, width } = page.getSize();
  let cursorY = height - 50;

  // Header Background
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.95, 0.96, 0.98),
  });

  page.drawText(`INVOICE`, { x: 50, y: height - 50, size: 28, font: boldFont, color: rgb(0.2, 0.3, 0.8) });
  page.drawText(`StarSuperScare Marketplace`, { x: 50, y: height - 70, size: 12, font, color: grayColor });
  
  cursorY -= 90;

  page.drawText(`Invoice Number:`, { x: 50, y: cursorY, size: 10, font: boldFont });
  page.drawText(`${invoiceNumber}`, { x: 150, y: cursorY, size: 10, font });
  cursorY -= 15;
  
  page.drawText(`Order ID:`, { x: 50, y: cursorY, size: 10, font: boldFont });
  page.drawText(`${orderData.orderNumber || orderData.id}`, { x: 150, y: cursorY, size: 10, font });
  cursorY -= 15;
  
  const dateStr = new Date(orderData.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  page.drawText(`Date:`, { x: 50, y: cursorY, size: 10, font: boldFont });
  page.drawText(`${dateStr}`, { x: 150, y: cursorY, size: 10, font });
  cursorY -= 30;

  page.drawText(`Billed To:`, { x: 50, y: cursorY, size: 12, font: boldFont });
  cursorY -= 15;
  page.drawText(`${orderData.emailSnapshot || 'Customer'}`, { x: 50, y: cursorY, size: 11, font, color: grayColor });
  cursorY -= 40;

  // Table Headers
  page.drawRectangle({ x: 50, y: cursorY - 5, width: width - 100, height: 20, color: rgb(0.9, 0.9, 0.9) });
  page.drawText(`Item`, { x: 60, y: cursorY, size: 10, font: boldFont });
  page.drawText(`Price`, { x: 300, y: cursorY, size: 10, font: boldFont });
  page.drawText(`Qty`, { x: 420, y: cursorY, size: 10, font: boldFont });
  page.drawText(`Total`, { x: 480, y: cursorY, size: 10, font: boldFont });
  cursorY -= 20;

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const items = orderData.items || [];
  for (const item of items) {
    const itemName = item.productNameSnapshot || 'Item';
    const qty = item.quantity || 1;
    const price = item.priceSnapshot || 0;
    const total = qty * price;

    page.drawText(`${itemName.substring(0, 40)}`, { x: 60, y: cursorY, size: 10, font });
    page.drawText(`${formatter.format(price)}`, { x: 300, y: cursorY, size: 10, font });
    page.drawText(`${qty}`, { x: 420, y: cursorY, size: 10, font });
    page.drawText(`${formatter.format(total)}`, { x: 480, y: cursorY, size: 10, font });
    cursorY -= 20;
    
    // Draw line
    page.drawLine({ start: { x: 50, y: cursorY + 10 }, end: { x: width - 50, y: cursorY + 10 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  }

  cursorY -= 20;

  // Totals
  const totalsStartX = 350;
  page.drawText(`Subtotal:`, { x: totalsStartX, y: cursorY, size: 10, font: boldFont });
  page.drawText(`${formatter.format(orderData.subtotalAmount || 0)}`, { x: 450, y: cursorY, size: 10, font });
  cursorY -= 15;
  
  page.drawText(`Shipping:`, { x: totalsStartX, y: cursorY, size: 10, font: boldFont });
  page.drawText(`${formatter.format(orderData.shippingAmount || 0)}`, { x: 450, y: cursorY, size: 10, font });
  cursorY -= 15;
  
  page.drawText(`Tax:`, { x: totalsStartX, y: cursorY, size: 10, font: boldFont });
  page.drawText(`${formatter.format(orderData.taxAmount || 0)}`, { x: 450, y: cursorY, size: 10, font });
  cursorY -= 20;
  
  // Total Line
  page.drawLine({ start: { x: totalsStartX, y: cursorY + 12 }, end: { x: width - 50, y: cursorY + 12 }, thickness: 1, color: blackColor });
  
  page.drawText(`Grand Total:`, { x: totalsStartX, y: cursorY, size: 12, font: boldFont });
  page.drawText(`${formatter.format(orderData.totalAmount || 0)}`, { x: 450, y: cursorY, size: 12, font: boldFont, color: rgb(0.1, 0.6, 0.1) });

  return await pdfDoc.save();
}
