import { useCallback, useRef, useEffect } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { useLazyVerifyPaymentQuery, useCreateOrderMutation } from '@/src/store/api/ordersApi';
import { sentryService } from '@/src/services/sentry';
import type { PaymentStatus } from '@/src/types/api/orders.types';

const VERIFICATION_POLL_INTERVAL = 2000;
const MAX_VERIFICATION_ATTEMPTS = 10;

interface UseBookPurchaseOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface UseBookPurchaseReturn {
  isPurchasing: boolean;
  purchase: (bookId: string) => Promise<void>;
}

/**
 * Hook for handling book purchases via Stripe Payment Sheet.
 * 
 * Flow:
 * 1. Create order → get clientSecret
 * 2. Initialize & present Payment Sheet
 * 3. On success → verify payment on backend
 * 4. Trigger callback when verified
 */
export function useBookPurchase(options: UseBookPurchaseOptions = {}): UseBookPurchaseReturn {
  const { onSuccess, onError } = options;

  // Refs for callbacks to avoid re-renders and stale closures
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  // Stripe
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // RTK Query
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment, { isFetching: isVerifying }] = useLazyVerifyPaymentQuery();

  // Verify payment with polling
  const pollPaymentVerification = useCallback(async (orderId: string): Promise<PaymentStatus> => {
    let attempts = 0;

    while (attempts < MAX_VERIFICATION_ATTEMPTS) {
      const result = await verifyPayment(orderId).unwrap();
      const status = result.data.status;

      if (status === 'succeeded' || status === 'paid') {
        return status;
      }

      if (status === 'failed') {
        throw new Error('Payment failed');
      }

      // Still pending, wait and retry
      attempts++;
      await new Promise(resolve => setTimeout(resolve, VERIFICATION_POLL_INTERVAL));
    }

    throw new Error('Payment verification timed out');
  }, [verifyPayment]);

  // Main purchase function
  const purchase = useCallback(async (bookId: string) => {
    // Track payment start
    sentryService.trackPaymentStep('start', { bookId });

    try {
      // 1. Create order
      sentryService.trackPaymentStep('create_order', { bookId });
      const { data } = await createOrder({ bookId }).unwrap();
      const { id: orderId, clientSecret } = data;

      if (!clientSecret) {
        throw new Error('Payment not configured');
      }

      // 2. Initialize Payment Sheet
      sentryService.trackPaymentStep('init_payment_sheet', { bookId, orderId });
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Stanley Paden',
      });

      if (initError) {
        sentryService.captureStripeError(initError, 'init_payment_sheet', { bookId, orderId });
        throw new Error(initError.message);
      }

      // 3. Present Payment Sheet
      sentryService.trackPaymentStep('present_payment_sheet', { bookId, orderId });
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        // User cancelled - not an error
        if (paymentError.code === 'Canceled') {
          sentryService.trackPaymentStep('cancelled', { bookId, orderId });
          return;
        }
        sentryService.captureStripeError(paymentError, 'present_payment_sheet', { bookId, orderId });
        throw new Error(paymentError.message);
      }

      // 4. Verify payment on backend
      sentryService.trackPaymentStep('verify_payment', { bookId, orderId });
      await pollPaymentVerification(orderId);

      // 5. Success!
      sentryService.trackPaymentStep('success', { bookId, orderId });
      onSuccessRef.current?.();

    } catch (error) {
      sentryService.capturePaymentError(error, 'error', { bookId });
      const message = error instanceof Error ? error.message : 'Purchase failed';
      onErrorRef.current?.(message);
    }
  }, [createOrder, initPaymentSheet, presentPaymentSheet, pollPaymentVerification]);

  return {
    isPurchasing: isCreatingOrder || isVerifying,
    purchase,
  };
}
