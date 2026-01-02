
import { useCallback, useState, useEffect } from 'react';
import {
  useCreateOrderMutation,
  useVerifyPaymentQuery,
} from '@/src/store/api/ordersApi';
import type { PaymentStatus } from '@/src/types/api/library.types';

const PAYMENT_POLL_INTERVAL_MS = 3000;

interface UseBookPurchaseOptions {
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
}

interface UseBookPurchaseReturn {
  // State
  isPaymentModalVisible: boolean;
  isCreatingOrder: boolean;
  isProcessingPayment: boolean;
  paymentStatus: PaymentStatus | null;

  // Actions
  startPurchase: (bookId: string) => Promise<void>;
  confirmPayment: () => Promise<void>;
  cancelPayment: () => void;
}

export function useBookPurchase(
  options: UseBookPurchaseOptions = {}
): UseBookPurchaseReturn {
  const { onPaymentSuccess, onPaymentFailed } = options;

  // API mutations
  const [createOrderMutation, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  // Payment state
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  // Payment polling
  const { data: paymentResult } = useVerifyPaymentQuery(orderId!, {
    skip: !isPollingPayment || !orderId,
    pollingInterval: isPollingPayment ? PAYMENT_POLL_INTERVAL_MS : 0,
  });

  // Handle payment status updates
  useEffect(() => {
    if (!paymentResult) return;

    const status = paymentResult?.data?.status;
    setPaymentStatus(status);

    if (status === 'succeeded' || status === 'paid') {
      setIsPollingPayment(false);
      resetPaymentState();
      onPaymentSuccess?.();
    }

    if (status === 'failed') {
      setIsPollingPayment(false);
      onPaymentFailed?.();
    }
  }, [paymentResult, onPaymentSuccess, onPaymentFailed]);

  // Reset payment state
  const resetPaymentState = useCallback(() => {
    setOrderId(null);
    setClientSecret(null);
    setPaymentStatus(null);
    setPaymentModalVisible(false);
  }, []);

  // Start purchase flow - creates order and shows payment modal
  const startPurchase = useCallback(async (bookId: string) => {
    try {
      const res = await createOrderMutation({ bookId }).unwrap();

      const newOrderId = res?.data?.orderId;
      const secret = res?.data?.clientSecret;

      if (!newOrderId) {
        alert('Could not start payment.');
        return;
      }

      setOrderId(newOrderId);
      setClientSecret(secret ?? null);
      setPaymentModalVisible(true);
    } catch (error) {
      const errorData = error as { data?: { message?: string } };
      alert(errorData?.data?.message || 'Error creating order');
    }
  }, [createOrderMutation]);

  // Confirm payment (Stripe integration)
  const confirmPayment = useCallback(async () => {
    // TODO: Re-enable when Stripe is configured
    // if (!clientSecret) {
    //   alert('No payment secret available');
    //   return;
    // }
    // const { confirmPayment } = useStripe();
    // const { paymentIntent, error } = await confirmPayment(clientSecret, {
    //   paymentMethodType: 'Card',
    // });
    // if (error) {
    //   alert('Payment error: ' + error.message);
    //   return;
    // }
    // setPaymentModalVisible(false);
    // setIsPollingPayment(true);

    alert('Payment functionality coming soon!');
    setPaymentModalVisible(false);
  }, [clientSecret]);

  // Cancel payment
  const cancelPayment = useCallback(() => {
    resetPaymentState();
  }, [resetPaymentState]);

  return {
    // State
    isPaymentModalVisible,
    isCreatingOrder,
    isProcessingPayment: isPollingPayment,
    paymentStatus,

    // Actions
    startPurchase,
    confirmPayment,
    cancelPayment,
  };
}
