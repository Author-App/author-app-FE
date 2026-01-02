/**
 * Stripe Provider Wrapper
 * 
 * TODO: Enable when implementing book purchases
 * 
 * Wraps children with StripeProvider using env config.
 * Use this component only where Stripe functionality is needed.
 */

import React from 'react';
// import { StripeProvider } from '@stripe/stripe-react-native';
// import { ENV } from '@/src/config/env';

interface AppStripeProviderProps {
  children: React.ReactNode;
}

// Disabled for now - enable when implementing Stripe payments
export function AppStripeProvider({ children }: AppStripeProviderProps) {
  // return (
  //   <StripeProvider
  //     publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}
  //     merchantIdentifier={ENV.STRIPE_MERCHANT_IDENTIFIER}
  //     urlScheme={ENV.STRIPE_URL_SCHEME}
  //   >
  //     {children}
  //   </StripeProvider>
  // );
  
  return <>{children}</>;
}
