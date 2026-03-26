/**
 * Orders API Types
 * 
 * Type definitions for order creation and payment verification endpoints.
 */

// ============================================================================
// Common Types
// ============================================================================

export type OrderStatus = 'created' | 'succeeded' | 'failed' | 'pending';
export type PaymentStatus = 'succeeded' | 'failed' | 'pending' | 'paid';

// ============================================================================
// POST /orders - Create Order
// ============================================================================

export interface CreateOrderRequest {
  bookId: string;
}

export interface OrderData {
  id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  clientSecret: string;
}

export interface CreateOrderResponse {
  status: string;
  data: OrderData;
}

// ============================================================================
// GET /orders/:orderId/verify-payment
// ============================================================================

export interface VerifyPaymentData {
  orderId: string;
  status: PaymentStatus;
  paidAmount?: number;
  currency?: string;
  message?: string;
}

export interface VerifyPaymentResponse {
  status: string;
  data: VerifyPaymentData;
}
