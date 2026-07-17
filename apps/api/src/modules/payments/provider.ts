import { createHash } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';

export interface PaymentProvider {
  /**
   * Initialize a payment intent/session with the provider
   */
  createIntent(orderId: string, amount: number, paymentType?: string): Promise<{
    providerTransactionId: string;
    clientSecret?: string;
    instructionPayload?: any;
    expiresAt?: string;
    customerPaymentAmount?: number;
    gatewayFee?: number;
  }>;

  /**
   * Verify the webhook payload signature
   * @throws Error if signature is invalid
   */
  verifyWebhookSignature(payload: string, signature: string): void;

  /**
   * Check status directly with provider API (needed for Louvin)
   */
  checkTransactionStatus?(providerTransactionId: string): Promise<string>;
}

export class SandboxPaymentProvider implements PaymentProvider {
  private readonly secretKey: string;

  constructor() {
    // In production, this comes from env vars (e.g., STRIPE_WEBHOOK_SECRET)
    this.secretKey = typeof process !== 'undefined'
      ? (process.env.SANDBOX_PAYMENT_SECRET || '')
      : '';
  }

  createIntent(orderId: string, _amount: number, _paymentType?: string) {
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

export class LouvinPaymentProvider implements PaymentProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = typeof process !== 'undefined' ? (process.env.LOUVIN_API_KEY || '') : '';
    this.baseUrl = typeof process !== 'undefined' ? (process.env.LOUVIN_BASE_URL || '') : '';
  }

  async createIntent(orderId: string, amount: number, paymentType: string = 'QRIS') {
    const response = await fetch(`${this.baseUrl}/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        external_id: orderId,
        amount: amount,
        payment_type: paymentType,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = errText;
      try {
        const json = JSON.parse(errText);
        if (json.message) errMsg = json.message;
      } catch (e) {
        // ignore
      }
      throw new HTTPException(response.status === 503 ? 503 : 400, { message: errMsg });
    }

    const data = await response.json();

    return {
      providerTransactionId: data.transaction_id || data.id,
      instructionPayload: data.instruction || data.actions || data,
      expiresAt: data.expires_at || undefined,
      customerPaymentAmount: data.amount,
      gatewayFee: data.fee,
    };
  }

  verifyWebhookSignature(_payload: string, _signature: string): void {
    // Louvin does not use signature verification via header
    // We will verify via checkTransactionStatus later in the webhook route
  }

  async checkTransactionStatus(providerTransactionId: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/check-status?transaction_id=${providerTransactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to verify status with Louvin');
    }

    const data = await response.json();
    return data.status; // e.g. 'settled', 'pending', 'failed'
  }
}

// Keep export for backward compatibility or generic usage
export const paymentProvider = new SandboxPaymentProvider();
export const louvinPaymentProvider = new LouvinPaymentProvider();
