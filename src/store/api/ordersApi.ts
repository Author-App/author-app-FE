import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentResponse,
} from '@/src/types/api/orders.types';
import baseQueryWithReauth from './baseQuery';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Orders'],

  endpoints: (builder) => ({
    /**
     * POST /orders
     * Creates a new order and returns clientSecret for Payment Sheet
     */
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),

    /**
     * GET /orders/:orderId/verify-payment
     * Verifies payment status after Payment Sheet completion
     */
    verifyPayment: builder.query<VerifyPaymentResponse, string>({
      query: (orderId) => `/orders/${orderId}/verify-payment`,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentQuery,
  useLazyVerifyPaymentQuery,
} = ordersApi;
