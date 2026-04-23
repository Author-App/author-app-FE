import { z } from 'zod';
import { statusResponseSchema } from './common.schemas';

// ============================================================================
// ORDER STATUS ENUMS
// ============================================================================

export const orderStatusSchema = z.enum(['created', 'succeeded', 'failed', 'pending']);
export const paymentStatusSchema = z.enum(['succeeded', 'failed', 'pending', 'paid']);

// ============================================================================
// ORDER DATA SCHEMAS
// ============================================================================

export const orderDataSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: orderStatusSchema,
  clientSecret: z.string(),
});

/**
 * POST /orders - Create order response
 */
export const createOrderResponseSchema = statusResponseSchema(orderDataSchema);

// ============================================================================
// PAYMENT VERIFICATION SCHEMAS
// ============================================================================

export const verifyPaymentDataSchema = z.object({
  orderId: z.string(),
  status: paymentStatusSchema,
  paidAmount: z.number().optional(),
  currency: z.string().optional(),
  message: z.string().optional(),
});

/**
 * GET /orders/:orderId/verify-payment - Verify payment response
 */
export const verifyPaymentResponseSchema = statusResponseSchema(verifyPaymentDataSchema);

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type OrderData = z.infer<typeof orderDataSchema>;
export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;
export type VerifyPaymentData = z.infer<typeof verifyPaymentDataSchema>;
export type VerifyPaymentResponse = z.infer<typeof verifyPaymentResponseSchema>;
