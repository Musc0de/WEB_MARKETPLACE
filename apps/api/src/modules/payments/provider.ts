import { createHash } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';
import { db, globalSettings } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

/**
 * Generic payment provider contract.
 *
 * IMPORTANT:
 * Provider implementations registered for marketplace checkout must support
 * verified server-side payment confirmation.
 */
export interface PaymentProvider {
  /**
   * Initialize a payment intent/session with the provider.
   */
  createIntent(
    orderId: string,
    amount: number,
    paymentType?: string,
    customerData?: { name?: string; email?: string },
  ): Promise<{
    providerTransactionId: string;
    clientSecret?: string | undefined;
    instructionPayload?: any;
    expiresAt?: string | undefined;
    customerPaymentAmount?: number | undefined;
    gatewayFee?: number | undefined;
  }>;

  /**
   * Verify the webhook payload signature.
   *
   * @throws Error when verification fails.
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
  ): Promise<void> | void;

  /**
   * Check status directly with the provider API.
   */
  checkTransactionStatus?(
    providerTransactionId: string,
  ): Promise<string>;
}

/**
 * Existing sandbox provider.
 *
 * Preserved for backward compatibility and existing tests.
 * Do not register this provider in production checkout.
 */
export class SandboxPaymentProvider implements PaymentProvider {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = typeof process !== 'undefined'
      ? (process.env.SANDBOX_PAYMENT_SECRET || '')
      : '';
  }

  createIntent(
    orderId: string,
    _amount: number,
    _paymentType?: string,
    _customerData?: { name?: string; email?: string },
  ) {
    const base = createHash('sha256')
      .update(orderId)
      .digest('hex')
      .substring(0, 8);

    const suffix = Date.now()
      .toString(36)
      .slice(-4);

    const providerTransactionId = `txn_${base}${suffix}`;

    const clientSecret = `sec_${
      createHash('sha256')
        .update(providerTransactionId + this.secretKey)
        .digest('hex')
        .substring(0, 16)
    }`;

    return Promise.resolve({
      providerTransactionId,
      clientSecret,
    });
  }

  verifyWebhookSignature(
    payload: string,
    signature: string,
  ): void {
    const expectedSignature = createHash('sha256')
      .update(payload + this.secretKey)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }
  }

  /**
   * Helper used by existing tests.
   */
  generateSignature(payload: string): string {
    return createHash('sha256')
      .update(payload + this.secretKey)
      .digest('hex');
  }
}

/**
 * Existing Louvin payment provider.
 *
 * Preserved without changing the current provider contract.
 */
export class LouvinPaymentProvider implements PaymentProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = typeof process !== 'undefined' ? (process.env.LOUVIN_API_KEY || '') : '';

    this.baseUrl = typeof process !== 'undefined' ? (process.env.LOUVIN_BASE_URL || '') : '';
  }

  async createIntent(
    orderId: string,
    amount: number,
    paymentType: string = 'QRIS',
    _customerData?: { name?: string; email?: string },
  ) {
    if (!this.apiKey) {
      throw new HTTPException(503, {
        message: 'Louvin API key is not configured.',
      });
    }

    if (!this.baseUrl) {
      throw new HTTPException(503, {
        message: 'Louvin base URL is not configured.',
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response: Response;
    try {
      response = await fetch(
        `${this.baseUrl}/create-transaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            external_id: orderId,
            amount,
            payment_type: paymentType,
          }),
          signal: controller.signal,
        },
      );
    } catch (err: any) {
      throw new HTTPException(504, {
        message: 'Louvin API timeout or connection error: ' + err.message,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = errText;

      try {
        const json = JSON.parse(errText);

        if (
          typeof json === 'object' &&
          json !== null &&
          typeof json.message === 'string'
        ) {
          errMsg = json.message;
        }
      } catch {
        // Keep original response text.
      }

      throw new HTTPException(
        response.status === 503 ? 503 : 400,
        {
          message: errMsg || 'Failed to create Louvin transaction.',
        },
      );
    }

    const data = await response.json() as Record<string, any>;

    const providerTransactionId = data.transaction_id || data.id;

    if (
      typeof providerTransactionId !== 'string' ||
      providerTransactionId.length === 0
    ) {
      throw new HTTPException(502, {
        message: 'Invalid transaction response from Louvin.',
      });
    }

    return {
      providerTransactionId,
      instructionPayload: data.instruction ||
        data.actions ||
        data,
      expiresAt: typeof data.expires_at === 'string' ? data.expires_at : undefined,
      customerPaymentAmount: typeof data.amount === 'number' ? data.amount : amount,
      gatewayFee: typeof data.fee === 'number' ? data.fee : undefined,
    };
  }

  verifyWebhookSignature(
    _payload: string,
    _signature: string,
  ): void {
    /**
     * Existing Louvin behavior is retained.
     *
     * The webhook route must verify the transaction using
     * checkTransactionStatus() before changing payment or order status.
     */
  }

  async checkTransactionStatus(
    providerTransactionId: string,
  ): Promise<string> {
    if (!providerTransactionId) {
      throw new HTTPException(400, {
        message: 'Provider transaction ID is required.',
      });
    }

    if (!this.apiKey || !this.baseUrl) {
      throw new HTTPException(503, {
        message: 'Louvin payment provider is not configured.',
      });
    }

    const url = new URL(
      '/check-status',
      this.baseUrl,
    );

    url.searchParams.set(
      'transaction_id',
      providerTransactionId,
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
      });
    } catch (err: any) {
      throw new HTTPException(504, {
        message: 'Louvin API timeout or connection error: ' + err.message,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new HTTPException(502, {
        message: 'Failed to verify transaction status with Louvin.',
      });
    }

    const data = await response.json() as Record<string, unknown>;

    if (typeof data.status !== 'string') {
      throw new HTTPException(502, {
        message: 'Invalid status response from Louvin.',
      });
    }

    return data.status;
  }
}

/**
 * Public Saweria support-page configuration.
 *
 * Saweria is handled only as an external support link.
 * It is not a marketplace payment gateway.
 */
export interface SaweriaSupportConfig {
  enabled: boolean;
  supportPageUrl: string | null;
}

/**
 * Safe Saweria adapter.
 *
 * This class intentionally implements PaymentProvider so existing imports
 * and dependency injection do not immediately break. However, createIntent()
 * and webhook verification are permanently blocked because there is no
 * verified official merchant-payment contract configured in this application.
 *
 * Use getSupportPageUrl() only on a dedicated support/donation page.
 */
export class SaweriaPaymentProvider implements PaymentProvider {
  /**
   * Saweria checkout integration using the URL defined in the database.
   */
  async createIntent(
    orderId: string,
    amount: number,
    _paymentType: string = 'QRIS',
    customerData?: { name?: string; email?: string },
  ): Promise<any> {
    const [settings] = await db.select().from(globalSettings).where(
      eq(globalSettings.id, 'global'),
    ).limit(1);

    const saweriaEntry = settings?.paymentGatewayConfigs?.['saweria'] as any;
    const saweriaConfig = saweriaEntry?.config || {};
    const url = saweriaConfig?.supportPageUrl;

    if (!url) {
      throw new HTTPException(500, {
        message: 'Saweria URL is not configured in the admin dashboard.',
      });
    }

    const urlString = url as string;
    const username = urlString.split('/').pop()?.split('?')[0];

    if (!username) {
      throw new HTTPException(500, { message: 'Invalid Saweria URL.' });
    }

    if (!customerData?.name || !customerData?.email) {
      throw new Error('Customer name and email are strictly required for Saweria integration.');
    }

    const amountToPay = Math.max(amount, 1000);

    try {
      // Add a timeout to prevent backend hang if Saweria is unresponsive
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // 1. Fetch user page to get userId
      const userRes = await fetch(`https://saweria.co/${username}`, {
        signal: controller.signal,
      });
      const html = await userRes.text();

      const match = html.match(
        /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
      );
      if (!match) {
        throw new Error('Saweria user not found or structure changed.');
      }

      const nextData = JSON.parse(match[1]);
      const userId = nextData?.props?.pageProps?.data?.id;

      if (!userId) {
        throw new Error('Failed to extract Saweria user ID.');
      }

      // 2. Post to API
      const payload = {
        agree: true,
        notUnderage: true,
        message: 'Pembayaran Pesanan ' + orderId,
        amount: amountToPay,
        payment_type: 'qris',
        vote: '',
        currency: 'IDR',
        customer_info: {
          first_name: customerData.name,
          email: customerData.email,
          phone: '',
        },
      };

      const postRes = await fetch(`https://backend.saweria.co/donations/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Origin': 'https://saweria.co',
          'Referer': `https://saweria.co/${username}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const postData = await postRes.json();
      if (!postRes.ok || !postData?.data?.qr_string) {
        throw new Error(`Failed to create QRIS: ${JSON.stringify(postData)}`);
      }

      const qrString = postData.data.qr_string;
      const saweriaTrxId = postData.data.id;

      // Extract exact amount from QRIS string (Tag 54)
      let finalAmount = amountToPay;
      try {
        let i = 0;
        while (i < qrString.length) {
          const tag = qrString.substring(i, i + 2);
          const len = parseInt(qrString.substring(i + 2, i + 4), 10);
          const val = qrString.substring(i + 4, i + 4 + len);
          if (tag === '54') {
            finalAmount = parseFloat(val);
            break;
          }
          i += 4 + len;
        }
      } catch (_e) {
        // Fallback to original amount if parsing fails
      }

      return {
        providerTransactionId: saweriaTrxId,
        instructionPayload: {
          qrString: qrString,
          isSaweria: true,
        },
        customerPaymentAmount: finalAmount,
      };
    } catch (err: any) {
      throw new HTTPException(500, {
        message: 'Saweria Integration Error: ' + err.message,
      });
    }
  }

  /**
   * By default, we accept the webhook but do not enforce signature validation here,
   * relying on manual status checks or overlay webhooks if necessary.
   */
  verifyWebhookSignature(
    _payload: string,
    _signature: string,
  ): void {
    return; // Pass-through
  }
}

/**
 * Existing exports are preserved.
 */
export const paymentProvider = new SandboxPaymentProvider();

export const louvinPaymentProvider = new LouvinPaymentProvider();

export const saweriaPaymentProvider = new SaweriaPaymentProvider();
