import { createHash } from 'node:crypto';

export interface PaymentProvider {
  /**
   * Initialize a payment intent/session with the provider
   */
  createIntent(orderId: string, amount: number): Promise<{
    providerTransactionId: string;
    clientSecret: string;
  }>;

  /**
   * Verify the webhook payload signature
   * @throws Error if signature is invalid
   */
  verifyWebhookSignature(payload: string, signature: string): void;
}

export class SandboxPaymentProvider implements PaymentProvider {
  private readonly secretKey: string;

  constructor() {
    // In production, this comes from env vars (e.g., STRIPE_WEBHOOK_SECRET)
    this.secretKey = typeof process !== 'undefined'
      ? (process.env.SANDBOX_PAYMENT_SECRET || 'test_secret_123')
      : 'test_secret_123';
  }

  createIntent(orderId: string, _amount: number) {
    // Use orderId hash as base + timestamp suffix to ensure uniqueness per intent creation.
    // This prevents duplicate key violations if /intent is called multiple times for an order
    // that previously had its payment row deleted/failed.
    const base = createHash('sha256').update(orderId).digest('hex').substring(0, 8);
    const suffix = Date.now().toString(36).slice(-4); // 4-char timestamp suffix
    const providerTransactionId = `txn_${base}${suffix}`;
    // Deterministic client secret based on the transaction ID
    const clientSecret = `sec_${
      createHash('sha256').update(providerTransactionId + this.secretKey).digest('hex').substring(
        0,
        16,
      )
    }`;

    return Promise.resolve({
      providerTransactionId,
      clientSecret,
    });
  }

  verifyWebhookSignature(payload: string, signature: string): void {
    // Expected signature is HMAC SHA256 of the payload using the secret key
    const expectedSignature = createHash('sha256')
      .update(payload + this.secretKey)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }
  }

  // Helper function to generate a valid signature for testing
  generateSignature(payload: string): string {
    return createHash('sha256')
      .update(payload + this.secretKey)
      .digest('hex');
  }
}

// Export a singleton instance for use in the application
export const paymentProvider = new SandboxPaymentProvider();
