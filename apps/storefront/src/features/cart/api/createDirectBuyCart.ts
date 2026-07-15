/**
 * createDirectBuyCart
 *
 * Creates a FRESH guest cart (no X-Cart-Token sent) containing exactly ONE item.
 * This enables the "Beli Langsung" / "Buy Now" flow where the user checks out
 * only that specific product without touching their regular shopping cart.
 *
 * Returns the fresh guestToken to be passed as ?directToken= query param to /checkout.
 */
import { API_URL } from '../../../lib/api.ts';

const BASE = API_URL.replace(/\/$/, '');

export async function createDirectBuyCart(
  variantId: string,
  quantity: number,
): Promise<string> {
  const res = await fetch(`${BASE}/v1/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // NO X-Cart-Token header — creates a brand new guest cart session
    credentials: 'include',
    body: JSON.stringify({ variantId, quantity, isDirectBuy: true }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null) as any;
    throw new Error(err?.error?.message || 'Gagal membuat sesi checkout langsung');
  }

  const data = await res.json();
  const token = data?.data?.guestToken;
  if (!token) throw new Error('Token tidak ditemukan dari server');
  return token;
}
