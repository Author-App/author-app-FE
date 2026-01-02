/**
 * Environment Configuration
 * 
 * Access environment variables with type safety.
 * All public env vars must be prefixed with EXPO_PUBLIC_
 */

export const ENV = {
  // Stripe
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  STRIPE_MERCHANT_IDENTIFIER: process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER ?? '',
  STRIPE_URL_SCHEME: process.env.EXPO_PUBLIC_STRIPE_URL_SCHEME ?? 'authorapp',
  
  // API
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api-dev.stanleypaden.com/api/v1',
} as const;
