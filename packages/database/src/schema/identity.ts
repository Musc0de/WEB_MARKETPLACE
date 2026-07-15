import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const users = pgTable('sss_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  usernameDisplay: text('username_display').notNull(),
  usernameNormalized: text('username_normalized').notNull().unique(),
  emailDisplay: text('email_display').notNull(),
  emailNormalized: text('email_normalized').notNull().unique(),
  status: text('status').notNull().default('active'),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { users };

const userProfiles = pgTable('sss_user_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name'),
  phone: text('phone'),
  avatarObjectKey: text('avatar_object_key'),
  locale: text('locale').default('id-ID'),
  timezone: text('timezone').default('Asia/Jakarta'),
});
export { userProfiles };

const passwordCredentials = pgTable('sss_password_credentials', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true, mode: 'string' })
    .defaultNow(),
  hashVersion: integer('hash_version').default(1),
});
export { passwordCredentials };

const sessions = pgTable('sss_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionTokenHash: text('session_token_hash').notNull().unique(),
  userAgent: text('user_agent'),
  ipHash: text('ip_hash'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { sessions };

const loginAttempts = pgTable('sss_login_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  isSuccess: boolean('is_success').notNull().default(false),
  attemptedAt: timestamp('attempted_at', { withTimezone: true, mode: 'string' }).defaultNow()
    .notNull(),
});
export { loginAttempts };

const tokens = pgTable('sss_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'email_verification', 'password_reset', 'account_activation', 'order_claim'
  tokenHash: text('token_hash').notNull().unique(),
  metadata: jsonb('metadata'),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { tokens };
