import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bankApi = createApi({
    reducerPath: 'bankApi',

    baseQuery: fetchBaseQuery({
        baseUrl:
            'https://custom-dev.onlinetestingserver.com/bloom-backend/api/',

        prepareHeaders: (headers, { getState }: any) => {
            headers.set('Accept', `application/json`);
            let token = getState()?.auth?.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers;
        },
    }),

    endpoints: builder => ({



        // Get ---------------------------------------------------------------------------------------------------------------------------------------------
        getBankDetails: builder.query<any, void>({
            query: () => "coach/bank-details",
        }),

        paymentLogs: builder.query({
            query: (params) => ({
                url: 'coach/payment-logs',
                method: 'GET',
                params
            }),
        }),



        // Post --------------------------------------------------------------------------------------------------------------------------------------------
        addBankDetails: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: 'coach/bank-detail',
                method: 'POST',
                body: formData,
            }),
        }),

        changeBankDetails: builder.mutation<any, { formData: FormData, id: number }>({
            query: ({ id, formData }) => ({
                url: `coach/bank-detail/${id}/update`,
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),



    }),
});

export const {



    // Get ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetBankDetailsQuery,
    usePaymentLogsQuery,


    // Post ---------------------------------------------------------------------------------------------------------------------------------------------
    useAddBankDetailsMutation,
    useChangeBankDetailsMutation,



} = bankApi;