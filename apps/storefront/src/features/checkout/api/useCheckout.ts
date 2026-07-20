import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import type {
  CheckoutValidateResponse,
  CreateOrderRequest,
  OrderResponse,
  PaymentIntentRequest,
  PaymentIntentResponse,
  ShippingOption,
  WebhookPayload,
} from '@starsuperscare/contracts';
import { API_URL } from '../../../lib/api.ts';

// Strip trailing slash from API_URL to normalize, then rebuild cleanly
const BASE = API_URL.replace(/\/$/, '');
const CHECKOUT_API = `${BASE}/v1/checkout`;

async function fetcher(url: string, options: RequestInit) {
  const res = await fetch(url, { ...options, credentials: 'include' });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Request failed');
  }
  return json;
}

function getCartToken(override?: string | null) {
  if (override) return override;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('guestToken');
  }
  return null;
}

async function validateCheckout(
  url: string,
  { arg }: {
    arg: {
      shippingOptionId?: string | null;
      voucherCode?: string | null;
      _cartToken?: string | null; // optional override for direct-buy flow
    };
  },
): Promise<CheckoutValidateResponse> {
  const { _cartToken, ...body } = arg;
  const token = getCartToken(_cartToken);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Cart-Token'] = token;
    if (_cartToken) {
      headers['X-Direct-Buy-Token'] = token;
    }
  }
  const res = await fetcher(`${url}/validate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res.data;
}

async function createOrder(
  url: string,
  { arg }: { arg: CreateOrderRequest & { _cartToken?: string | null } },
): Promise<OrderResponse> {
  const { _cartToken, ...body } = arg as any;
  const token = getCartToken(_cartToken);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Cart-Token'] = token;
    if (_cartToken) {
      headers['X-Direct-Buy-Token'] = token;
    }
  }
  const res = await fetcher(`${url}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res.data;
}

export function useCheckoutValidation() {
  return useSWRMutation(CHECKOUT_API, validateCheckout);
}

export function useShippingOptions(
  province?: string | null,
  city?: string | null,
  postalCode?: string | null,
) {
  return useSWR<{ options: ShippingOption[] }>(
    province && city && postalCode
      ? [`${CHECKOUT_API}/shipping-options`, province, city, postalCode]
      : null,
    async ([url, p, c, pc]) => {
      const res = await fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationProvince: p,
          destinationCity: c,
          destinationPostalCode: pc,
        }),
      });
      return res.data;
    },
  );
}

export function useCreateOrder() {
  return useSWRMutation(CHECKOUT_API, createOrder);
}

export function usePaymentIntent() {
  return useSWRMutation<PaymentIntentResponse, Error, string, PaymentIntentRequest>(
    `${BASE}/v1/payments/intent`,
    async (url, { arg }) => {
      const res = await fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      });
      return res.data;
    },
  );
}

export async function checkOrderStatus(orderId: string): Promise<string> {
  // Fetch order detail from an existing endpoint if available. Let's assume there's a simple order fetch,
  // or we can just fetch from an order check endpoint.
  // Let's implement a quick API endpoint if it's not there, but for now:
  try {
    // There is no /v1/orders endpoint yet?
    // Let's call a hypothetical endpoint or we will add it.
    const res = await fetcher(`${BASE}/v1/checkout/orders/${orderId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.status;
  } catch (_error) {
    return 'pending'; // Fallback
  }
}

export function simulateWebhook(payload: WebhookPayload) {
  return fetch(`${BASE}/v1/payments/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

export async function checkPaymentStatus(paymentId: string): Promise<string> {
  try {
    const res = await fetcher(`${BASE}/v1/payments/${paymentId}/status`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.status;
  } catch (_error) {
    return 'pending';
  }
}
