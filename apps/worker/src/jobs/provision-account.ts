import {
  db,
  orders,
  outboxEvents,
  tokens,
  userProfiles,
  users,
  withTransaction,
} from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export async function handleProvisionAccount(payload: any, _eventId: string) {
  const orderData = payload.order;
  if (!orderData || !orderData.id) {
    throw new Error('Invalid order payload for provision-account');
  }

  const orderId = orderData.id;
  const emailSnapshot = orderData.emailSnapshot;

  if (!emailSnapshot) {
    console.log(`[ProvisionAccount] No email found for order ${orderId}, skipping.`);
    return;
  }

  const emailNormalized = emailSnapshot.toLowerCase().trim();

  // 1. Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.emailNormalized, emailNormalized),
  });

  if (existingUser) {
    // User already exists. If the order is NOT linked to them, send a claim notification.
    if (!orderData.userId) {
      console.log(
        `[ProvisionAccount] User ${existingUser.id} exists, sending order claim for ${orderId}`,
      );

      const tokenHash = crypto.randomUUID().replace(/-/g, '') +
        crypto.randomUUID().replace(/-/g, '');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      await withTransaction(async (tx) => {
        await tx.insert(tokens).values({
          userId: existingUser.id,
          type: 'order_claim',
          tokenHash,
          expiresAt,
          metadata: { orderId },
        });

        await tx.insert(outboxEvents).values({
          type: 'email.send',
          payload: {
            to: emailSnapshot,
            template: 'order-claim',
            data: {
              orderNumber: orderData.orderNumber,
              token: tokenHash,
              actionUrl: `/claim-order?token=${tokenHash}`,
            },
          },
        });
      });
      console.log(`[ProvisionAccount] Order claim notification enqueued for ${orderId}`);
    } else {
      console.log(
        `[ProvisionAccount] Order ${orderId} already linked to user ${existingUser.id}, skipping.`,
      );
    }
    return;
  }

  // 2. User DOES NOT exist. Provision new account.
  console.log(`[ProvisionAccount] Provisioning new account for ${emailNormalized}`);
  const newUserId = randomUUID();
  const usernameNormalized = `guest-${randomUUID().slice(0, 8)}`;

  const tokenHash = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  await withTransaction(async (tx) => {
    // Create user
    await tx.insert(users).values({
      id: newUserId,
      emailNormalized,
      emailDisplay: emailSnapshot.trim(),
      usernameNormalized,
      usernameDisplay: usernameNormalized,
      status: 'pending_activation',
    });

    // Create user profile
    await tx.insert(userProfiles).values({
      userId: newUserId,
      locale: 'id-ID',
      timezone: 'Asia/Jakarta',
    });

    // Link order to new user
    await tx.update(orders)
      .set({ userId: newUserId, updatedAt: new Date().toISOString() })
      .where(eq(orders.id, orderId));

    // Create activation token
    await tx.insert(tokens).values({
      userId: newUserId,
      type: 'account_activation',
      tokenHash,
      expiresAt,
      metadata: { orderId },
    });

    // Send activation email
    await tx.insert(outboxEvents).values({
      type: 'email.send',
      payload: {
        to: emailSnapshot,
        template: 'account-activation',
        data: {
          orderNumber: orderData.orderNumber,
          token: tokenHash,
          actionUrl: `/activation?token=${tokenHash}`,
        },
      },
    });
  });

  console.log(
    `[ProvisionAccount] Successfully provisioned account ${newUserId} and enqueued activation email`,
  );
}
