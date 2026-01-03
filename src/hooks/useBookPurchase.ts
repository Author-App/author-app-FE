import { useCallback, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  useCreateOrderMutation,
  useVerifyPaymentQuery,
} from '@/src/store/api/ordersApi';
import type { PaymentStatus } from '@/src/types/api/library.types';

const PAYMENT_POLL_INTERVAL_MS = 3000;

// Deep link URL for payment return
const PAYMENT_RETURN_URL = Linking.createURL('payment-complete');

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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  // Payment polling - checks payment status after user returns from Stripe
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
    setPaymentUrl(null);
    setPaymentStatus(null);
    setPaymentModalVisible(false);
    setIsPollingPayment(false);
  }, []);

  // Start purchase flow - creates order and shows payment modal
  const startPurchase = useCallback(async (bookId: string) => {
    try {
      const res = await createOrderMutation({ bookId }).unwrap();

      const newOrderId = res?.data?.orderId;
      const url = res?.data?.paymentUrl;

      if (!newOrderId) {
        alert('Could not start payment.');
        return;
      }

      setOrderId(newOrderId);
      setPaymentUrl(url ?? null);
      setPaymentModalVisible(true);
    } catch (error) {
      const errorData = error as { data?: { message?: string } };
      alert(errorData?.data?.message || 'Error creating order');
    }
  }, [createOrderMutation]);

  // Confirm payment - opens Stripe Checkout in browser
  const confirmPayment = useCallback(async () => {
    if (!paymentUrl) {
      alert('No payment URL available');
      return;
    }

    try {
      // Close the modal before opening browser
      setPaymentModalVisible(false);

      // Open Stripe Checkout in in-app browser
      const result = await WebBrowser.openAuthSessionAsync(
        paymentUrl,
        PAYMENT_RETURN_URL
      );

      // Handle browser result
      if (result.type === 'success' || result.type === 'dismiss') {
        // User completed or dismissed - start polling to check payment status
        setIsPollingPayment(true);
      } else if (result.type === 'cancel') {
        // User cancelled - reset state
        resetPaymentState();
      }
    } catch (error) {
      console.error('Payment browser error:', error);
      alert('Failed to open payment page. Please try again.');
      resetPaymentState();
    }
  }, [paymentUrl, resetPaymentState]);

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
