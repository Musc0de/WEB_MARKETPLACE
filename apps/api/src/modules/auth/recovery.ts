import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '../../middleware/validator.ts';
import {
  db,
  outboxEvents,
  passwordCredentials,
  securityAuditLogs,
  sessions,
  tokens,
  users,
  withTransaction,
} from '@starsuperscare/database';
import {
  hashPassword,
  secureRandomToken,
  validatePasswordStrength,
} from '@starsuperscare/auth-pkg';
import { HTTPException } from 'hono/http-exception';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { AuthContext } from '../../middleware/auth.ts';

const recoveryRouter = new Hono<AuthContext>();

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const routes = recoveryRouter.post(
  '/forgot-password',
  zValidator('json', ForgotPasswordSchema),
  async (c) => {
    const { email } = c.req.valid('json');
    const emailNormalized = email.toLowerCase().trim();
    const ipHash = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

    // 1. Find user (don't reveal if user exists)
    const userRecord = await db.query.users.findFirst({
      where: eq(users.emailNormalized, emailNormalized),
    });

    if (userRecord && userRecord.status !== 'suspended' && userRecord.status !== 'banned') {
      // 2. Generate token (expires in 1 hour)
      const token = secureRandomToken();
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await withTransaction(async (tx) => {
        // Revoke any previous pending password_reset tokens
        await tx.update(tokens)
          .set({ usedAt: new Date().toISOString() })
          .where(
            and(
              eq(tokens.userId, userRecord.id),
              eq(tokens.type, 'password_reset'),
              isNull(tokens.usedAt),
            ),
          );

        // Insert new token
        await tx.insert(tokens).values({
          userId: userRecord.id,
          type: 'password_reset',
          tokenHash: token,
          expiresAt: expiresAt.toISOString(),
        });

        // Insert outbox event for email dispatch
        await tx.insert(outboxEvents).values({
          type: 'password_reset_requested',
          payload: { userId: userRecord.id, email: userRecord.emailNormalized, token },
          state: 'pending',
        });

        // Audit log
        await tx.insert(securityAuditLogs).values({
          userId: userRecord.id,
          event: 'password_reset_requested',
          ipHash,
          userAgent: c.req.header('user-agent') || null,
        });
      });
    }

    // 3. Return generic response
    return c.json({
      data: {
        message: 'If your email is registered, you will receive a password reset link shortly.',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  revokeAllSessions: z.boolean().default(true),
});

const routes2 = routes.post(
  '/reset-password',
  zValidator('json', ResetPasswordSchema),
  async (c) => {
    const { token, newPassword, revokeAllSessions } = c.req.valid('json');
    const ipHash = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || null;

    if (!validatePasswordStrength(newPassword)) {
      throw new HTTPException(400, { message: 'Password does not meet security requirements' });
    }

    // 1. Verify token
    const tokenRecord = await db.query.tokens.findFirst({
      where: and(
        eq(tokens.tokenHash, token),
        eq(tokens.type, 'password_reset'),
        isNull(tokens.usedAt),
        gt(tokens.expiresAt, new Date().toISOString()),
      ),
    });

    if (!tokenRecord || !tokenRecord.userId) {
      throw new HTTPException(400, { message: 'Invalid or expired reset token' });
    }

    // 2. Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    await withTransaction(async (tx) => {
      // 3. Update password
      await tx.insert(passwordCredentials)
        .values({
          userId: tokenRecord.userId!,
          passwordHash: hashedNewPassword,
          passwordChangedAt: new Date().toISOString(),
          hashVersion: 1,
        })
        .onConflictDoUpdate({
          target: passwordCredentials.userId,
          set: {
            passwordHash: hashedNewPassword,
            passwordChangedAt: new Date().toISOString(),
            hashVersion: 1,
          },
        });

      // 4. Mark token as used
      await tx.update(tokens)
        .set({ usedAt: new Date().toISOString() })
        .where(eq(tokens.id, tokenRecord.id));

      // 5. Optionally revoke all sessions
      if (revokeAllSessions) {
        await tx.update(sessions)
          .set({ revokedAt: new Date().toISOString() })
          .where(
            and(
              eq(sessions.userId, tokenRecord.userId!),
              isNull(sessions.revokedAt),
            ),
          );
      }

      // 6. Audit log
      await tx.insert(securityAuditLogs).values({
        userId: tokenRecord.userId!,
        event: 'password_reset_completed',
        ipHash,
        userAgent,
      });
    });

    return c.json({
      data: {
        message: 'Password has been successfully reset',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export default routes2;
