import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({

        // -------------------------
        // 1️⃣ Create Order (POST /orders)
        // -------------------------
        createOrder: builder.mutation({
            query: (body) => ({
                url: `/orders`,
                method: "POST",
                body, // expected: { bookId: "xxxxxx" }
            }),
        }),

        // -------------------------
        // 2️⃣ Verify Payment (GET /orders/:orderId/verify-payment)
        // -------------------------
        pollPaymentStatus: builder.query({
            query: (orderId) => `/orders/${orderId}/verify-payment`,
        }),

    }),
});

export const {
    useCreateOrderMutation,
    usePollPaymentStatusQuery,
} = ordersApi;
