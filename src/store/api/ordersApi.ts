import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentResponse,
} from '@/src/types/api/orders.types';
import baseQueryWithReauth from './baseQuery';
import { homeApi } from './homeApi';
import { libraryApi } from './libraryApi';

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
      async onQueryStarted(_orderId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const status = data?.data?.status;
          
          // If payment was successful, invalidate caches across APIs
          if (status === 'succeeded' || status === 'paid') {
            // Invalidate home feed to show "Owned" tag on purchased books
            dispatch(homeApi.util.invalidateTags(['HomeFeed']));
            // Invalidate library books list to show "Owned" status
            dispatch(libraryApi.util.invalidateTags([{ type: 'Books', id: 'LIST' }]));
          }
        } catch {
          // Query failed, no need to invalidate
        }
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentQuery,
  useLazyVerifyPaymentQuery,
} = ordersApi;
