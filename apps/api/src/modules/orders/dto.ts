export function serializeCustomerOrderListItem(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    subtotalAmount: order.subtotalAmount,
    shippingAmount: order.shippingAmount,
    serviceFeeAmount: order.serviceFeeAmount,
    discountAmount: order.discountAmount,
    createdAt: order.createdAt,
    returnStatus: order.returnStatus,
    returnId: order.returnId,
    cancellationStatus: order.cancellationStatus,
    cancellationId: order.cancellationId,
    resolutionEligibility: order.resolutionEligibility,
    items: (order.items || []).map((item: any) => ({
      productId: item.productId,
      productName: item.productName,
      variantName: item.variantName || item.optionValues ? parseVariantName(item.optionValues) : '',
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      comparePrice: item.comparePrice,
      imageUrl: item.imageUrl,
    })),
  };
}

export function serializeCustomerOrderDetail(order: any) {
  return {
    ...serializeCustomerOrderListItem(order),
    shippingAddress: order.address?.shippingSnapshot
      ? {
        recipientName: order.address.shippingSnapshot.recipientName ||
          order.address.shippingSnapshot.fullName,
        phone: order.address.shippingSnapshot.phone || order.address.shippingSnapshot.phoneNumber,
        addressLine1: order.address.shippingSnapshot.addressLine1 ||
          order.address.shippingSnapshot.streetAddress,
        addressLine2: order.address.shippingSnapshot.addressLine2,
        city: order.address.shippingSnapshot.city,
        province: order.address.shippingSnapshot.province,
        postalCode: order.address.shippingSnapshot.postalCode,
        country: order.address.shippingSnapshot.country,
        notes: order.address.shippingSnapshot.notes,
      }
      : null,
    billingAddress: order.address?.billingSnapshot,
    shippingOption: order.shipping
      ? {
        id: order.shipping.id,
        name: order.shipping.name,
        estimatedDays: order.shipping.estimatedDays,
        cost: order.shipping.cost,
      }
      : null,
    paymentMethod: order.payment
      ? {
        method: order.payment.method,
        provider: order.payment.provider,
        status: order.payment.status,
      }
      : null,
    history: (order.history || []).map((h: any) => ({
      status: h.status,
      notes: h.notes,
      createdAt: h.createdAt,
    })),
  };
}

function parseVariantName(optionValues: unknown): string {
  if (!optionValues) return '';
  try {
    const parsed = typeof optionValues === 'string' ? JSON.parse(optionValues) : optionValues;
    if (Array.isArray(parsed)) {
      return parsed.map((v: any) => v.value ?? v.label ?? String(v)).filter(Boolean).join(' · ');
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.values(parsed).filter(Boolean).join(' · ');
    }
    return String(parsed);
  } catch {
    return String(optionValues);
  }
}
