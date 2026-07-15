import RedisDefault, { Redis as RedisNamed } from 'ioredis';

const RedisClass = RedisNamed || RedisDefault;

const getRedisUrl = (): string => {
  try {
    if (typeof Deno !== 'undefined' && Deno.env) {
      return Deno.env.get('REDIS_URL') || '';
    }
  } catch (_e) {
    // Ignore error
  }
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.REDIS_URL || '';
    }
  } catch (_e) {
    // Ignore error
  }
  return 'redis://localhost:6379';
};

const redisUrl = getRedisUrl() || 'redis://localhost:6379';

// Single shared connection for general operations
export const redis: RedisNamed = new (RedisClass as any)(redisUrl);

// Create a new connection for subscriptions (pub/sub requires dedicated connection)
export const createRedisSubscriber = (): RedisNamed => new (RedisClass as any)(redisUrl);
