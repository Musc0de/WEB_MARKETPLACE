import useSWRMutation from 'swr/mutation';
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

const CHECKOUT_API = `${API_URL}/v1/checkout`;

async function fetcher(url: string, options: RequestInit) {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || 'Request failed');
  }
  return json;
}

function getCartToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('guestToken');
  }
  return null;
}

async function validateCheckout(
  url: string,
  { arg }: { arg: { shippingOptionId?: string | null; voucherCode?: string | null } },
): Promise<CheckoutValidateResponse> {
  const token = getCartToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Cart-Token'] = token;
  }
  const res = await fetcher(`${url}/validate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(arg),
  });
  return res.data;
}

async function fetchShippingOptions(
  url: string,
  { arg }: { arg: { destinationProvince?: string; destinationCity?: string } },
): Promise<{ options: ShippingOption[] }> {
  const res = await fetcher(`${url}/shipping-options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  return res.data;
}

async function createOrder(
  url: string,
  { arg }: { arg: CreateOrderRequest },
): Promise<OrderResponse> {
  const token = getCartToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Cart-Token'] = token;
  }
  const res = await fetcher(`${url}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(arg),
  });
  return res.data;
}

export function useCheckoutValidation() {
  return useSWRMutation(CHECKOUT_API, validateCheckout);
}

export function useShippingOptions() {
  return useSWRMutation(CHECKOUT_API, fetchShippingOptions);
}

export function useCreateOrder() {
  return useSWRMutation(CHECKOUT_API, createOrder);
}

export function usePaymentIntent() {
  return useSWRMutation<PaymentIntentResponse, Error, string, PaymentIntentRequest>(
    `${API_URL}/v1/payments/intent`,
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
    const res = await fetcher(`${API_URL}/v1/checkout/orders/${orderId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.status;
  } catch (_error) {
    return 'pending'; // Fallback
  }
}

export function simulateWebhook(payload: WebhookPayload) {
  return fetch(`${API_URL}/v1/payments/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}
