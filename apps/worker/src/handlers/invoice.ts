import { db, invoices, orderItems, outboxEvents } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { storage } from '@starsuperscare/storage';
import { generateInvoicePdf } from '../jobs/invoices/generator.ts';

export async function handleOrderPaid(payload: any, _eventId: string) {
  const orderData = payload.order;
  if (!orderData || !orderData.id) {
    throw new Error('Invalid order payload');
  }

  const invoiceNumber = `INV-${orderData.orderNumber}-${Date.now()}`;

  console.log(`[Invoice] Generating invoice ${invoiceNumber} for order ${orderData.id}`);

  // Fetch order items to include in invoice
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderData.id));
  orderData.items = items;

  // Generate PDF
  const pdfBytes = await generateInvoicePdf(invoiceNumber, orderData);

  // Save to storage
  const objectKey = `invoices/${orderData.id}/${invoiceNumber}.pdf`;
  await storage.putObject(objectKey, pdfBytes, 'application/pdf');

  // Transaction: Save invoice record and enqueue email
  await db.transaction(async (tx) => {
    await tx.insert(invoices).values({
      orderId: orderData.id,
      invoiceNumber,
      pdfObjectKey: objectKey,
      status: 'generated',
      snapshotData: orderData,
    });

    // Enqueue email event
    await tx.insert(outboxEvents).values({
      type: 'email.send',
      payload: {
        to: orderData.emailSnapshot || 'customer@example.com',
        template: 'invoice',
        data: {
          orderNumber: orderData.orderNumber,
          customerName: orderData.shippingSnapshot?.fullName ||
            orderData.emailSnapshot?.split('@')[0] || 'Pelanggan',
          invoiceObjectKey: objectKey,
        },
      },
    });
  });

  console.log(`[Invoice] Generated and email enqueued for ${invoiceNumber}`);
}
