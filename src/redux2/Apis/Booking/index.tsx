import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',

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
        getAllBookings: builder.query<any, { page: number, status?: string | undefined, search?: string, fromDate?: string, toDate?: string, booking_type?: string, coach: string }>({
            query: args => ({
                url: 'coach/bookings',
                method: 'GET',
                params: args,
            }),
        }),

        getBookingDetail: builder.query<any, { id: string }>({
            query: ({ id }) => `coach/booking/${id}`,
        }),

        getExpertise: builder.query<any, void>({
            query: () => 'expertise',
        }),

        getCategories: builder.query<any, void>({
            query: () => 'categories',
        }),



        // Post --------------------------------------------------------------------------------------------------------------------------------------------
        createBooking: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'user/mobile-booking',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        report: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'user/report',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        rate: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'user/rating',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        cancelBooking: builder.mutation<any, { formData: FormData, bookin_id: string }>({
            query: ({ bookin_id, formData }) => ({
                url: `coach/booking/${bookin_id}/cancel`,
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        rescheduleBooking: builder.mutation<any, { formData: FormData, bookin_id: string }>({
            query: ({ bookin_id, formData }) => ({
                url: `coach/booking/${bookin_id}/reschedule`,
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        rejectSchedule: builder.mutation<any, { formData: FormData, bookin_id: string }>({
            query: ({ bookin_id, formData }) => ({
                url: `coach/booking/${bookin_id}/reject`,
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        acceptSchedule: builder.mutation<any, { bookin_id: string }>({
            query: ({ bookin_id }) => ({
                url: `coach/booking/${bookin_id}/accept`,
                method: 'POST',
            }),
        }),



    }),
});

export const {



    // Get ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetAllBookingsQuery,
    useGetBookingDetailQuery,
    useGetExpertiseQuery,
    useGetCategoriesQuery,



    // Post ---------------------------------------------------------------------------------------------------------------------------------------------
    useCreateBookingMutation,
    useReportMutation,
    useRateMutation,
    useCancelBookingMutation,
    useRescheduleBookingMutation,
    useRejectScheduleMutation,
    useAcceptScheduleMutation,



} = bookingApi;