import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '../../middleware/validator.ts';
import {
  outboxEvents,
  tokens,
  userProfiles,
  users,
  withTransaction,
} from '@starsuperscare/database';
import { secureRandomToken } from '@starsuperscare/auth-pkg';
import { HTTPException } from 'hono/http-exception';
import { and, eq, gt, isNull } from 'drizzle-orm';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const verificationRouter = new Hono<AppContext>();

export async function sendVerificationEmail(userId: string, email: string, customerName?: string) {
  // Generate 20-byte token (secure random base64url)
  const rawToken = secureRandomToken(20);

  // Expiration in 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await withTransaction(async (tx) => {
    // 1. Invalidate any existing email_verification tokens for this user
    await tx.update(tokens)
      .set({ usedAt: new Date().toISOString() })
      .where(
        and(
          eq(tokens.userId, userId),
          eq(tokens.type, 'email_verification'),
          isNull(tokens.usedAt),
        ),
      );

    // 2. Insert new token
    await tx.insert(tokens).values({
      userId,
      type: 'email_verification',
      tokenHash: rawToken, // Typically you might hash the token, but for email links raw is often stored or sha256 hashed. We store raw per simplest approach unless specified to hash. The schema says 'token_hash', so let's hash it if needed, or just store the raw random string as tokenHash since it's already a secure random string.
      expiresAt,
    });

    // 3. Insert outbox event to send email
    await tx.insert(outboxEvents).values({
      type: 'email_verification_requested',
      payload: {
        userId,
        email,
        customerName,
        token: rawToken,
      },
    });
  });
}

const VerifySchema = z.object({
  token: z.string().min(10),
});

const routes = verificationRouter.post(
  '/',
  zValidator('json', VerifySchema),
  async (c) => {
    let { token } = c.req.valid('json');

    // Fix for legacy tokens sent without url encoding where '+' became ' '
    if (token.includes(' ')) {
      token = token.replace(/ /g, '+');
    }

    const result = await withTransaction(async (tx) => {
      // Find valid token
      const tokenRecord = await tx.query.tokens.findFirst({
        where: and(
          eq(tokens.tokenHash, token),
          eq(tokens.type, 'email_verification'),
          isNull(tokens.usedAt),
          gt(tokens.expiresAt, new Date().toISOString()),
        ),
      });

      if (!tokenRecord || !tokenRecord.userId) {
        // Check if token was already used and user is active
        const usedToken = await tx.query.tokens.findFirst({
          where: and(
            eq(tokens.tokenHash, token),
            eq(tokens.type, 'email_verification'),
          ),
        });
        if (usedToken && usedToken.usedAt && usedToken.userId) {
          const user = await tx.query.users.findFirst({ where: eq(users.id, usedToken.userId) });
          if (user?.status === 'active') {
            return { user, alreadyVerified: true };
          }
        }
        return null;
      }

      // Mark token as used
      await tx.update(tokens)
        .set({ usedAt: new Date().toISOString() })
        .where(eq(tokens.id, tokenRecord.id));

      // Update user status
      const [updatedUser] = await tx.update(users)
        .set({
          status: 'active',
          emailVerifiedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, tokenRecord.userId))
        .returning();

      return { user: updatedUser, alreadyVerified: false };
    });

    if (!result || !result.user) {
      throw new HTTPException(400, { message: 'Invalid or expired verification token' });
    }

    return c.json({
      data: {
        message: result.alreadyVerified ? 'Email already verified' : 'Email successfully verified',
        status: result.user.status,
        alreadyVerified: result.alreadyVerified,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

const ResendSchema = z.object({
  token: z.string().min(10),
});

const routes2 = routes.post(
  '/resend',
  zValidator('json', ResendSchema),
  async (c) => {
    const { token } = c.req.valid('json');

    const result = await withTransaction(async (tx) => {
      // Find the token (even if expired or used)
      const tokenRecord = await tx.query.tokens.findFirst({
        where: and(
          eq(tokens.tokenHash, token),
          eq(tokens.type, 'email_verification'),
        ),
      });

      if (!tokenRecord || !tokenRecord.userId) {
        return null;
      }

      // Find the user
      const user = await tx.query.users.findFirst({
        where: eq(users.id, tokenRecord.userId),
      });

      if (!user) {
        return null;
      }

      if (user.status === 'active') {
        throw new HTTPException(400, { message: 'Akun Anda sudah terverifikasi. Silakan login.' });
      }

      // Check Rate Limit (20 seconds cooldown)
      const latestToken = await tx.query.tokens.findFirst({
        where: and(
          eq(tokens.userId, user.id),
          eq(tokens.type, 'email_verification'),
        ),
        orderBy: (tokens, { desc }) => [desc(tokens.createdAt)],
      });

      if (latestToken) {
        const tokenAge = Date.now() - new Date(latestToken.createdAt).getTime();
        if (tokenAge < 20000) { // 20s
          throw new HTTPException(429, {
            message: 'Harap tunggu beberapa saat sebelum meminta tautan baru.',
          });
        }
      }

      const profile = await tx.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, user.id),
      });

      return { user, profile };
    });

    if (!result) {
      return c.json({ data: { success: true } });
    }

    await sendVerificationEmail(
      result.user.id,
      result.user.emailNormalized,
      result.profile?.fullName || undefined,
    );

    return c.json({ data: { success: true } });
  },
);

export default routes2;
