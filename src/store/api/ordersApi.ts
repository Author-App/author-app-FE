import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  CreateOrderRequest,
  CreateOrderApiResponse,
  VerifyPaymentApiResponse,
} from '@/src/types/api/library.types';
import baseQueryWithReauth from './baseQuery';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Orders'],

  endpoints: (builder) => ({
    /**
     * POST /orders
     * Creates a new order for book purchase
     */
    createOrder: builder.mutation<CreateOrderApiResponse, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),

    /**
     * GET /orders/:orderId/verify-payment
     * Polls payment status for an order
     */
    verifyPayment: builder.query<VerifyPaymentApiResponse, string>({
      query: (orderId) => `/orders/${orderId}/verify-payment`,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentQuery,
} = ordersApi;
