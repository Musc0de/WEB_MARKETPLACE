import { z } from 'zod';
import 'dotenv/config'; // Make sure variables are loaded if using Node/Deno without built-in loading

// Base schema for shared env
const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
});

// Frontend schema
const frontendSchema = baseSchema.extend({
  VITE_API_URL: z.string().url().default('http://localhost:8000/v1'),
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

// Helper functions to parse environment safely
export function parseFrontendEnv() {
  return frontendSchema.parse(process.env);
}

export function parseApiEnv() {
  return apiSchema.parse(process.env);
}

export function parseWorkerEnv() {
  return workerSchema.parse(process.env);
}

export function parseMigrationEnv() {
  return migrationSchema.parse(process.env);
}

// Default export can be standard frontend env or just empty to force explicit calls
export const config = {
  env: process.env.NODE_ENV || 'development',
};
