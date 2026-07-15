import { z } from 'zod';
import 'dotenv/config'; // Make sure variables are loaded if using Node/Deno without built-in loading

// Base schema for shared env
const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
});

// Frontend schema
const frontendSchema = baseSchema.extend({
  VITE_API_URL: z.string().url(),
});

// API schema
const apiSchema = baseSchema.extend({
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

// Worker schema
const workerSchema = baseSchema.extend({
  DATABASE_URL: z.string().url(),
  WORKER_POLL_INTERVAL: z.coerce.number().default(5000),
});

// Migration schema
const migrationSchema = baseSchema.extend({
  DATABASE_URL_DIRECT: z.string().url(),
});

export interface BaseEnv {
  NODE_ENV: 'development' | 'staging' | 'production' | 'test';
}

export interface FrontendEnv extends BaseEnv {
  VITE_API_URL: string;
}

export interface ApiEnv extends BaseEnv {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export interface WorkerEnv extends BaseEnv {
  DATABASE_URL: string;
  WORKER_POLL_INTERVAL: number;
}

export interface MigrationEnv extends BaseEnv {
  DATABASE_URL_DIRECT: string;
}

// Helper functions to parse environment safely
export function parseFrontendEnv(): FrontendEnv {
  return frontendSchema.parse(process.env);
}

export function parseApiEnv(): ApiEnv {
  return apiSchema.parse(process.env);
}

export function parseWorkerEnv(): WorkerEnv {
  return workerSchema.parse(process.env);
}

export function parseMigrationEnv(): MigrationEnv {
  return migrationSchema.parse(process.env);
}

export interface ConfigEnv {
  env: string;
}

// Default export can be standard frontend env or just empty to force explicit calls
export const config: ConfigEnv = {
  env: process.env.NODE_ENV || 'development',
};
