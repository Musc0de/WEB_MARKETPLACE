import { Hono } from 'hono';
import { z } from 'zod';
import { setCookie } from 'hono/cookie';
import { zValidator } from '../../middleware/validator.ts';
import {
  db,
  passwordCredentials,
  securityAuditLogs,
  sessions,
  tokens,
  users,
  withTransaction,
} from '@starsuperscare/database';
import {
  createSessionToken,
  hashPassword,
  validatePasswordStrength,
} from '@starsuperscare/auth-pkg';
import { HTTPException } from 'hono/http-exception';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { AuthContext } from '../../middleware/auth.ts';

const activationRouter = new Hono<AuthContext>();

const ActivationSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  username: z.string().min(3).optional(),
});

const routes = activationRouter.post(
  '/',
  zValidator('json', ActivationSchema),
  async (c) => {
    const { token, newPassword, username } = c.req.valid('json');
    const ipHash = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || null;

    if (!validatePasswordStrength(newPassword)) {
      throw new HTTPException(400, { message: 'Password does not meet security requirements' });
    }

    // 1. Verify token
    const tokenRecord = await db.query.tokens.findFirst({
      where: and(
        eq(tokens.tokenHash, token),
        eq(tokens.type, 'account_activation'),
        isNull(tokens.usedAt),
        gt(tokens.expiresAt, new Date().toISOString()),
      ),
    });

    if (!tokenRecord || !tokenRecord.userId) {
      throw new HTTPException(400, { message: 'Invalid or expired activation token' });
    }

    // 2. Fetch user
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, tokenRecord.userId),
    });

    if (!userRecord) {
      throw new HTTPException(400, { message: 'User not found' });
    }

    if (userRecord.status === 'active') {
      throw new HTTPException(400, { message: 'Account is already active' });
    }

    // 3. Optional Username Duplicate Check
    let usernameNormalized = userRecord.usernameNormalized;
    let usernameDisplay = userRecord.usernameDisplay;

    if (username) {
      const normalizedInput = username.toLowerCase().trim();
      if (normalizedInput !== userRecord.usernameNormalized) {
        const existing = await db.query.users.findFirst({
          where: eq(users.usernameNormalized, normalizedInput),
        });
        if (existing) {
          throw new HTTPException(409, { message: 'Username is already taken' });
        }
        usernameNormalized = normalizedInput;
        usernameDisplay = username.trim();
      }
    }

    // 4. Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    await withTransaction(async (tx) => {
      // 5. Update User Status
      await tx.update(users)
        .set({
          status: 'active',
          usernameNormalized,
          usernameDisplay,
          updatedAt: new Date().toISOString(),
          emailVerifiedAt: userRecord.emailVerifiedAt
            ? userRecord.emailVerifiedAt
            : new Date().toISOString(),
        })
        .where(eq(users.id, userRecord.id));

      // 6. Update password
      await tx.insert(passwordCredentials)
        .values({
          userId: userRecord.id,
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

      // 7. Mark token as used
      await tx.update(tokens)
        .set({ usedAt: new Date().toISOString() })
        .where(eq(tokens.id, tokenRecord.id));

      // 8. Audit log
      await tx.insert(securityAuditLogs).values({
        userId: userRecord.id,
        event: 'account_activation_completed',
        ipHash,
        userAgent,
      });

      // 9. Issue session
      const { raw: rawToken, hash: sessionTokenHash } = await createSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await tx.insert(sessions).values({
        userId: userRecord.id,
        sessionTokenHash,
        userAgent,
        ipHash,
        expiresAt: expiresAt.toISOString(),
      });

      setCookie(c, 'sss_session', rawToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
        expires: expiresAt,
      });
    });

    return c.json({
      data: {
        message: 'Account successfully activated',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export default routes;
