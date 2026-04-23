import { z } from 'zod';
import { ENV } from '@/src/config/env';

type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/** Validates API response, throws on failure */
export function validateApiResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  endpointName: string
): z.infer<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  const issues = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');

  if (ENV.IS_DEV) {
    console.error(`[API Validation] ${endpointName}:`, result.error.issues);
    console.error('Received:', JSON.stringify(data, null, 2));
  }

  throw new Error(`API validation failed for ${endpointName}: ${issues}`);
}

/** Creates RTK Query transformResponse validator */
export function createResponseValidator<T extends z.ZodTypeAny>(
  schema: T,
  endpointName: string
) {
  return (response: unknown): z.infer<T> => {
    return validateApiResponse(schema, response, endpointName);
  };
}

/** Safe validation - returns result object instead of throwing */
export function safeValidateApiResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  endpointName: string
): ValidationResult<z.infer<T>> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const issues = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');

  if (ENV.IS_DEV) {
    console.error(`[API Validation] ${endpointName}:`, result.error.issues);
  }

  return { success: false, error: `Validation failed: ${issues}` };
}
