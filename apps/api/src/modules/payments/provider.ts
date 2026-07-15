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
    // Deterministic transaction ID based on orderId for testing
    const providerTransactionId = `txn_${
      createHash('sha256').update(orderId).digest('hex').substring(0, 12)
    }`;
    // Deterministic client secret
    const clientSecret = `sec_${
      createHash('sha256').update(orderId + this.secretKey).digest('hex').substring(0, 16)
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
