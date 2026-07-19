import { Hono } from 'hono';
import { z } from 'zod';
import { setCookie } from 'hono/cookie';
import { zValidator } from '../../middleware/validator.ts';
import {
  db,
  loginAttempts,
  passwordCredentials,
  securityAuditLogs,
  sessions,
  users,
  withTransaction,
} from '@starsuperscare/database';
import { createSessionToken, verifyPassword } from '@starsuperscare/auth-pkg';
import { HTTPException } from 'hono/http-exception';
import { eq, or } from 'drizzle-orm';
import { AuthContext } from '../../middleware/auth.ts';

const loginRouter = new Hono<AuthContext>();

const LoginSchema = z.object({
  identifier: z.string().min(3), // can be username or email
  password: z.string().min(1),
});

const routes = loginRouter.post(
  '/',
  zValidator('json', LoginSchema),
  async (c) => {
    const { identifier, password } = c.req.valid('json');
    const identifierNormalized = identifier.toLowerCase().trim();
    const ipHash = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || null;

    // 1. Find user and password
    const result = await db.select({
      user: users,
      credentials: passwordCredentials,
    })
      .from(users)
      .leftJoin(passwordCredentials, eq(users.id, passwordCredentials.userId))
      .where(
        or(
          eq(users.emailNormalized, identifierNormalized),
          eq(users.usernameNormalized, identifierNormalized),
        ),
      )
      .limit(1);

    const userRecord = result[0]?.user;
    const credsRecord = result[0]?.credentials;

    if (!userRecord || !credsRecord) {
      // Log failed attempt
      await db.insert(loginAttempts).values({
        email: identifierNormalized,
        ipHash,
        userAgent,
        isSuccess: false,
      }).catch(console.error);

      throw new HTTPException(401, { message: 'Email/Username atau Kata Sandi salah' });
    }

    if (userRecord.status === 'suspended' || userRecord.status === 'banned') {
      throw new HTTPException(403, { message: 'Account is suspended or banned' });
    }

    // 2. Verify password
    const isValid = await verifyPassword(credsRecord.passwordHash, password);

    if (!isValid) {
      await db.insert(loginAttempts).values({
        email: identifierNormalized,
        ipHash,
        userAgent,
        isSuccess: false,
      }).catch(console.error);

      throw new HTTPException(401, { message: 'Email/Username atau Kata Sandi salah' });
    }

    // 3. Create session
    const { raw: rawToken, hash: tokenHash } = await createSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await withTransaction(async (tx) => {
      // Record successful login attempt
      await tx.insert(loginAttempts).values({
        email: identifierNormalized,
        ipHash,
        userAgent,
        isSuccess: true,
      });

      // Insert session
      await tx.insert(sessions).values({
        userId: userRecord.id,
        sessionTokenHash: tokenHash,
        userAgent,
        ipHash,
        expiresAt: expiresAt.toISOString(),
      });

      // Audit log
      await tx.insert(securityAuditLogs).values({
        userId: userRecord.id,
        event: 'login_success',
        ipHash,
        userAgent,
      });
    });

    // 4. Set cookie
    setCookie(c, 'sss_session', rawToken, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
      expires: expiresAt,
    });

    return c.json({
      data: {
        user: {
          id: userRecord.id,
          username: userRecord.usernameDisplay,
          email: userRecord.emailDisplay,
          status: userRecord.status,
        },
        message: 'Login successful',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export default routes;
