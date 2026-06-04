import { useCallback, useRef, useEffect, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { useGetPrintQuoteMutation, useCreatePrintOrderMutation, useLazyGetPrintOrderStatusQuery } from '@/src/store/api/printApi';
import { sentryService } from '@/src/services/sentry';
import type { 
  ShippingAddress, 
  ShippingOption, 
  PrintQuoteData,
  PrintOrderStatus 
} from '@/src/types/api/print.types';

const VERIFICATION_POLL_INTERVAL = 2000;
const MAX_VERIFICATION_ATTEMPTS = 15;

interface UsePrintCheckoutOptions {
  onSuccess?: (printOrderId: string) => void;
  onError?: (message: string) => void; // For order errors (shows alert)
  onQuoteError?: (message: string) => void; // For quote errors (silent/inline)
}

interface UsePrintCheckoutReturn {
  // Quote
  quote: PrintQuoteData | null;
  isGettingQuote: boolean;
  getQuote: (params: {
    bookId: string;
    quantity: number;
    shippingOption: ShippingOption;
    shipping: ShippingAddress;
  }) => Promise<PrintQuoteData | null>;
  
  // Order
  isCreatingOrder: boolean;
  createOrder: () => Promise<void>;
  
  // Combined state
  isProcessing: boolean;
}

/**
 * Hook for handling print book purchases via Lulu + Stripe.
 * 
 * Flow:
 * 1. getQuote() → Get price from Lulu
 * 2. createOrder() → Create order with quoted price, get clientSecret
 * 3. Present Stripe PaymentSheet
 * 4. Poll for payment verification
 * 5. Success callback with printOrderId
 */
export function usePrintCheckout(options: UsePrintCheckoutOptions = {}): UsePrintCheckoutReturn {
  const { onSuccess, onError, onQuoteError } = options;

  // Refs for callbacks to avoid stale closures
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onQuoteErrorRef = useRef(onQuoteError);
  
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onQuoteErrorRef.current = onQuoteError;
  }, [onSuccess, onError, onQuoteError]);

  // State
  const [quote, setQuote] = useState<PrintQuoteData | null>(null);
  const [orderParams, setOrderParams] = useState<{
    bookId: string;
    quantity: number;
    shippingOption: ShippingOption;
    shipping: ShippingAddress;
  } | null>(null);

  // Stripe
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // RTK Query
  const [getPrintQuote, { isLoading: isGettingQuote }] = useGetPrintQuoteMutation();
  const [createPrintOrder, { isLoading: isCreatingOrder }] = useCreatePrintOrderMutation();
  const [getPrintOrderStatus, { isFetching: isVerifying }] = useLazyGetPrintOrderStatusQuery();

  // Get quote from Lulu
  const getQuote = useCallback(async (params: {
    bookId: string;
    quantity: number;
    shippingOption: ShippingOption;
    shipping: ShippingAddress;
  }): Promise<PrintQuoteData | null> => {
    sentryService.addBreadcrumb({
      category: 'print_order',
      message: 'Getting print quote',
      data: { bookId: params.bookId, shippingOption: params.shippingOption },
    });

    try {
      const result = await getPrintQuote(params).unwrap();
      const quoteData = result.data;
      
      setQuote(quoteData);
      setOrderParams(params);
      
      sentryService.addBreadcrumb({
        category: 'print_order',
        message: 'Quote received',
        data: { amountCents: quoteData.amountCents },
      });
      
      return quoteData;
    } catch (error: unknown) {
      sentryService.captureError(error, {
        tags: { type: 'print_quote_error' },
        extra: { bookId: params.bookId, params },
      });
      
      // Extract meaningful error message from RTK Query error
      let message = 'Failed to get shipping quote';
      
      if (error && typeof error === 'object') {
        const err = error as { data?: { message?: string; error?: string }; error?: string; message?: string; status?: number };
        
        // RTK Query error with server response
        if (err.data?.message) {
          // Parse Lulu error messages
          const luluMessage = err.data.message;
          if (luluMessage.includes('Lulu cost calculation failed')) {
            try {
              // Extract JSON from the error message
              const jsonMatch = luluMessage.match(/\{.*\}/);
              if (jsonMatch) {
                const luluError = JSON.parse(jsonMatch[0]);
                // Get the first error message from Lulu
                const errors = luluError?.shipping_address?.detail?.errors;
                if (errors && errors.length > 0) {
                  const fieldErrors = errors.map((e: { path?: string; message?: string }) => 
                    `${e.path ? e.path + ': ' : ''}${e.message}`
                  ).join('. ');
                  message = fieldErrors;
                } else {
                  message = 'Invalid shipping address. Please check your details.';
                }
              }
            } catch {
              message = 'Invalid shipping address. Please check your details.';
            }
          } else {
            message = err.data.message;
          }
        } else if (err.data?.error) {
          message = err.data.error;
        } else if (err.error) {
          message = err.error;
        } else if (err.message) {
          message = err.message;
        } else if (err.status === 401) {
          message = 'Please log in to continue';
        } else if (err.status === 404) {
          message = 'Book not available for print';
        } else if (err.status === 500) {
          message = 'Server error. Please try again later';
        }
      }
      
      // Use quote-specific error handler (silent/inline) instead of main error (alert)
      onQuoteErrorRef.current?.(message);
      return null;
    }
  }, [getPrintQuote]);

  // Poll for payment verification
  // Success statuses: paid, fulfillment_pending, lulu_submitted, in_production, shipped, delivered
  const pollPaymentVerification = useCallback(async (printOrderId: string): Promise<PrintOrderStatus> => {
    let attempts = 0;

    // Success states - payment confirmed and order is processing or complete
    const SUCCESS_STATUSES: PrintOrderStatus[] = [
      'paid',
      'fulfillment_pending',
      'lulu_submitted',
      'in_production',
      'shipped',
      'delivered',
    ];

    while (attempts < MAX_VERIFICATION_ATTEMPTS) {
      const result = await getPrintOrderStatus({ printOrderId, refresh: true }).unwrap();
      const status = result.data.status;

      if (SUCCESS_STATUSES.includes(status)) {
        return status;
      }

      if (status === 'failed' || status === 'cancelled') {
        throw new Error('Payment failed');
      }

      // Status is 'created' or 'payment_pending' - webhook hasn't processed yet, keep polling
      attempts++;
      await new Promise(resolve => setTimeout(resolve, VERIFICATION_POLL_INTERVAL));
    }

    throw new Error('Payment verification timed out');
  }, [getPrintOrderStatus]);

  // Create order and process payment
  const createOrder = useCallback(async () => {
    if (!quote || !orderParams) {
      onErrorRef.current?.('Please get a quote first');
      return;
    }

    sentryService.trackPaymentStep('start', { 
      bookId: orderParams.bookId, 
      type: 'print_order' 
    });

    try {
      // 1. Create print order
      sentryService.trackPaymentStep('create_order', { 
        bookId: orderParams.bookId,
        amountCents: quote.amountCents,
      });
      
      const orderResult = await createPrintOrder({
        ...orderParams,
        quotedAmountCents: quote.amountCents,
        luluTotalCostInclTax: quote.luluTotalCostInclTax,
      }).unwrap();
      
      const { printOrderId, clientSecret } = orderResult.data;

      if (!clientSecret) {
        throw new Error('Payment not configured');
      }

      // 2. Initialize Payment Sheet
      sentryService.trackPaymentStep('init_payment_sheet', { 
        bookId: orderParams.bookId, 
        printOrderId,
      });
      
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Stanley Paden',
      });

      if (initError) {
        sentryService.captureStripeError(initError, 'init_payment_sheet', { 
          bookId: orderParams.bookId, 
          printOrderId,
        });
        throw new Error(initError.message);
      }

      // 3. Present Payment Sheet
      sentryService.trackPaymentStep('present_payment_sheet', { 
        bookId: orderParams.bookId, 
        printOrderId,
      });
      
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code === 'Canceled') {
          sentryService.trackPaymentStep('cancelled', { 
            bookId: orderParams.bookId, 
            printOrderId,
          });
          return;
        }
        sentryService.captureStripeError(paymentError, 'present_payment_sheet', { 
          bookId: orderParams.bookId, 
          printOrderId,
        });
        throw new Error(paymentError.message);
      }

      // 4. Verify payment
      sentryService.trackPaymentStep('verify_payment', { 
        bookId: orderParams.bookId, 
        printOrderId,
      });
      
      await pollPaymentVerification(printOrderId);

      // 5. Success!
      sentryService.trackPaymentStep('success', { 
        bookId: orderParams.bookId, 
        printOrderId,
      });
      
      // Clear quote state
      setQuote(null);
      setOrderParams(null);
      
      onSuccessRef.current?.(printOrderId);

    } catch (error) {
      sentryService.capturePaymentError(error, 'error', { 
        bookId: orderParams.bookId,
        type: 'print_order',
      });
      
      // Provide user-friendly error messages
      let message = 'Order failed';
      let shouldClearQuote = false;
      
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        
        // Quote mismatch - price changed, need to refresh
        if (errorMsg.includes('mismatch') || errorMsg.includes('quote') || errorMsg.includes('price changed')) {
          message = 'Price has changed. Please review and try again.';
          shouldClearQuote = true; // This will trigger auto-refresh
        }
        // Stripe environment mismatch
        else if (errorMsg.includes('no such payment_intent') || errorMsg.includes('no such payment intent')) {
          message = 'Payment configuration error. Please contact support.';
        }
        // Payment cancelled by user
        else if (errorMsg.includes('canceled') || errorMsg.includes('cancelled')) {
          return; // Don't show error for user cancellation
        }
        // Card declined
        else if (errorMsg.includes('declined') || errorMsg.includes('insufficient_funds')) {
          message = 'Your card was declined. Please try a different payment method.';
        }
        // Network/timeout
        else if (errorMsg.includes('timeout') || errorMsg.includes('network')) {
          message = 'Connection error. Please check your internet and try again.';
        }
        // Generic
        else {
          message = error.message;
        }
      }
      
      // Clear quote on mismatch to force refresh
      if (shouldClearQuote) {
        setQuote(null);
      }
      
      onErrorRef.current?.(message);
    }
  }, [quote, orderParams, createPrintOrder, initPaymentSheet, presentPaymentSheet, pollPaymentVerification]);

  return {
    // Quote
    quote,
    isGettingQuote,
    getQuote,
    
    // Order
    isCreatingOrder,
    createOrder,
    
    // Combined state
    isProcessing: isGettingQuote || isCreatingOrder || isVerifying,
  };
}
