import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coachesApi = createApi({
    reducerPath: 'coachesApi',

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
        getAllCoaches: builder.query<any, { page: number, expertise_id?: string, category_id?: string, search?: string, }>({
            query: args => ({
                url: 'user/coaches',
                method: 'GET',
                params: args,
            }),
            keepUnusedDataFor: 0,
        }),

        getCoach: builder.query<any, { id: string, }>({
            query: ({ id }) => `user/coach/${id}`,
        }),

        getFavouriteCoach: builder.query<any, { search?: string, expertise_id?: string, category_id?: string }>({

            query: args => ({
                url: 'user/favourite-coaches',
                method: 'GET',
                params: args,
            }),
            keepUnusedDataFor: 0,
        }),

        getSlots: builder.query<any, { coachId: string, date: string, booking_type: string }>({
            query: args => ({
                url: 'coach/slot/available',
                method: 'GET',
                params: args,
            }),
        }),

        getRatings: builder.query<any, { coach_id: string }>({
            query: (args) => ({
                url: 'coach/ratings',
                method: 'GET',
                params: args,
            }),
            keepUnusedDataFor: 0,
        }),



        // Post --------------------------------------------------------------------------------------------------------------------------------------------
        getBookingSlots: builder.mutation<any, any>({
            query: formData => ({
                url: 'coach/slot/available',
                method: 'POST',
                body: formData,
            }),
        }),

        addToFavourite: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'user/favourite-coach',
                method: 'POST',
                body: formData,
            }),
        }),

        removeFromFavourite: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `user/favourite-coach/${id}`,
                method: 'DELETE',
            }),
        }),


    }),
});

export const {



    // Get ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetAllCoachesQuery,
    useGetCoachQuery,
    useGetSlotsQuery,
    useGetFavouriteCoachQuery,
    useGetRatingsQuery,



    // Post ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetBookingSlotsMutation,
    useAddToFavouriteMutation,
    useRemoveFromFavouriteMutation,


} = coachesApi;