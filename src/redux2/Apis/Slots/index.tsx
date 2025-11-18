import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const slotsApi = createApi({
    reducerPath: 'slotsApi',

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
        getViewSlots: builder.query<any, 'online' | 'onsite'>({
            query: (type) => ({
                url: `coach/slots-type/${type}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0
        }),

        getSlotLogs: builder.query<any, { search?: string, fromDate?: string, toDate?: string }>({
            query: args => ({
                url: 'coach/slots',
                method: 'GET',
                params: args,
            }),
        }),



        // Post --------------------------------------------------------------------------------------------------------------------------------------------
        addCoachSlot: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: 'coach/slot',
                method: 'POST',
                body: formData,
            }),
        }),

        updateCoachSlot: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: 'coach/update/slot',
                method: 'POST',
                body: formData,
            }),
        }),



    }),
});

export const {



    // Get ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetViewSlotsQuery,
    useGetSlotLogsQuery,


    // Post ---------------------------------------------------------------------------------------------------------------------------------------------
    useAddCoachSlotMutation,
    useUpdateCoachSlotMutation,



} = slotsApi;