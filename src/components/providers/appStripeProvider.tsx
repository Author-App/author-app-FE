/**
 * Stripe Provider Wrapper
 * 
 * Wraps children with StripeProvider using env config.
 * Required for Payment Sheet and other Stripe functionality.
 */

import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ENV } from '@/src/config/env';

interface AppStripeProviderProps {
  children: React.ReactNode;
}

export function AppStripeProvider({ children }: AppStripeProviderProps) {
  // Don't render StripeProvider if publishable key is missing
  if (!ENV.STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe publishable key not configured. Payment features will not work.');
    return <>{children}</>;
  }

  return (
    <StripeProvider
      publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={ENV.STRIPE_MERCHANT_IDENTIFIER || undefined}
      urlScheme={ENV.STRIPE_URL_SCHEME}
    >
      {children}
    </StripeProvider>
  );
}
