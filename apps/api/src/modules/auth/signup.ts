import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '../../middleware/validator.ts';
import {
  db,
  passwordCredentials,
  securityAuditLogs,
  userProfiles,
  users,
  withTransaction,
} from '@starsuperscare/database';
import { hashPassword, validatePasswordStrength } from '@starsuperscare/auth-pkg';
import { HTTPException } from 'hono/http-exception';
import { eq, or } from 'drizzle-orm';
import { sendVerificationEmail } from './verification.ts';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const signupRouter = new Hono<AppContext>();

const SignupSchema = z.object({
  username: z.string().min(3).max(30).regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores',
  ),
  email: z.string().email(),
  password: z.string().min(1),
  fullName: z.string().min(2).max(100).optional(),
});

const routes = signupRouter.post(
  '/',
  zValidator('json', SignupSchema),
  async (c) => {
    const { username, email, password, fullName } = c.req.valid('json');

    // 1. Check password strength
    if (!validatePasswordStrength(password)) {
      throw new HTTPException(400, { message: 'Password does not meet complexity requirements' });
    }

    const emailNormalized = email.toLowerCase().trim();
    const usernameNormalized = username.toLowerCase().trim();

    // 2. Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.emailNormalized, emailNormalized),
        eq(users.usernameNormalized, usernameNormalized),
      ),
    });

    if (existingUser) {
      if (existingUser.emailNormalized === emailNormalized) {
        throw new HTTPException(409, { message: 'Email is already registered' });
      } else {
        throw new HTTPException(409, { message: 'Username is already taken' });
      }
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Transaction to create user
    const newUser = await withTransaction(async (tx) => {
      // Create user
      const [user] = await tx.insert(users).values({
        usernameDisplay: username,
        usernameNormalized,
        emailDisplay: email.trim(),
        emailNormalized,
        status: 'pending_verification',
      }).returning();

      // Create profile
      await tx.insert(userProfiles).values({
        userId: user.id,
        fullName: fullName || null,
      });

      // Create credential
      await tx.insert(passwordCredentials).values({
        userId: user.id,
        passwordHash,
      });

      // Audit log
      await tx.insert(securityAuditLogs).values({
        userId: user.id,
        event: 'signup',
        ipHash: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
        userAgent: c.req.header('user-agent') || null,
        metadata: { source: 'api_signup' },
      });

      return user;
    });

    // 5. Trigger email verification outbox event
    await sendVerificationEmail(newUser.id, newUser.emailNormalized, fullName);

    return c.json({
      data: {
        user: {
          id: newUser.id,
          username: newUser.usernameDisplay,
          email: newUser.emailDisplay,
          status: newUser.status,
        },
        message: 'Signup successful. Please check your email to verify your account.',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    }, 201);
  },
);

export default routes;
