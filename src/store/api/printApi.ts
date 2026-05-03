import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  PrintQuoteRequest,
  PrintQuoteResponse,
  CreatePrintOrderRequest,
  CreatePrintOrderResponse,
  GetPrintOrderResponse,
} from '@/src/types/api/print.types';
import baseQueryWithReauth from './baseQuery';
import { homeApi } from './homeApi';
import { libraryApi } from './libraryApi';

export const printApi = createApi({
  reducerPath: 'printApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['PrintOrders'],

  endpoints: (builder) => ({
    /**
     * POST /print/quote
     * Get price quote from Lulu including shipping and tax
     */
    getPrintQuote: builder.mutation<PrintQuoteResponse, PrintQuoteRequest>({
      query: (body) => ({
        url: '/print/quote',
        method: 'POST',
        body,
      }),
    }),

    /**
     * POST /print/orders
     * Create print order and get Stripe clientSecret
     */
    createPrintOrder: builder.mutation<CreatePrintOrderResponse, CreatePrintOrderRequest>({
      query: (body) => ({
        url: '/print/orders',
        method: 'POST',
        body,
      }),
    }),

    /**
     * GET /print/orders/:printOrderId
     * Get print order status and tracking info
     */
    getPrintOrderStatus: builder.query<GetPrintOrderResponse, { printOrderId: string; refresh?: boolean }>({
      query: ({ printOrderId, refresh }) => ({
        url: `/print/orders/${printOrderId}`,
        params: refresh ? { refresh: 'true' } : undefined,
      }),
      providesTags: (_result, _error, { printOrderId }) => [
        { type: 'PrintOrders', id: printOrderId },
      ],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const status = data?.data?.status;
          
          // If order is paid/shipped, invalidate caches
          if (status === 'paid' || status === 'shipped' || status === 'delivered') {
            dispatch(homeApi.util.invalidateTags(['HomeFeed']));
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
  useGetPrintQuoteMutation,
  useCreatePrintOrderMutation,
  useGetPrintOrderStatusQuery,
  useLazyGetPrintOrderStatusQuery,
} = printApi;
