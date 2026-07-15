import { zValidator as honoZodValidator } from '@hono/zod-validator';
import { z } from 'zod';

/**
 * A custom wrapper around Hono's zValidator to automatically
 * throw an HTTPException on error, which will be caught by the
 * global error handler and formatted nicely.
 */
export const zValidator = <
  T extends z.ZodTypeAny,
  Target extends 'json' | 'form' | 'query' | 'param' | 'header' | 'cookie',
>(
  target: Target,
  schema: T,
) => {
  return honoZodValidator(target, schema, (result, _c) => {
    if (!result.success) {
      // Create an error that looks like a ZodError to the error handler
      const err = new Error('Validation failed');
      err.name = 'ZodError';
      (err as any).issues = result.error.issues;
      throw err;
    }
  });
};
