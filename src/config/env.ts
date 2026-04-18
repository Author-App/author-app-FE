import { z } from 'zod';

/**
 * Environment variable schema with validation
 * App crashes immediately on startup if config is invalid - fail fast!
 */
const envSchema = z.object({
  // API
  API_BASE_URL: z.string().url('API_BASE_URL must be a valid URL'),
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required'),
  STRIPE_MERCHANT_IDENTIFIER: z.string().min(1, 'STRIPE_MERCHANT_IDENTIFIER is required'),
  STRIPE_URL_SCHEME: z.string().default('authorapp'),
  
  // App Info
  IS_DEV: z.boolean(),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const rawEnv = {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_MERCHANT_IDENTIFIER: process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER,
    STRIPE_URL_SCHEME: process.env.EXPO_PUBLIC_STRIPE_URL_SCHEME,
    IS_DEV: __DEV__,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    
    console.error(`❌ Environment validation failed:\n${errors}`);
    
    // In dev, throw to make the error obvious
    // In prod, this would have been caught during build/testing
    throw new Error(`Invalid environment configuration:\n${errors}`);
  }

  return result.data;
}

export const ENV = loadEnv();
