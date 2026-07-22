export interface InvoiceData {
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    subtotalAmount: number;
    shippingAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
  items: Array<{
    id: string;
    productId: string;
    variantId: string;
    productNameSnapshot: string;
    variantSkuSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    thumbnailUrl?: string;
  }>;
  addresses: {
    billingSnapshot: any;
    shippingSnapshot: any;
  } | null;
  payment: {
    provider: string;
    providerTransactionId: string | null;
    amount: number;
    customerPaymentAmount?: number;
    status: string;
    createdAt: string;
  } | null;
  invoice: {
    invoiceNumber: string;
    issuedAt: string;
    dueDate: string | null;
    status: string;
  } | null;
  shipment: {
    carrier: string;
    trackingNumber: string | null;
    status: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  } | null;
  customer: {
    name: string | null;
    email: string | null;
  };
}
