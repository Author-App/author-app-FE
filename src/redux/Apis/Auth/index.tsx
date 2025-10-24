import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery: fetchBaseQuery({
        baseUrl: '', 
    }),

    endpoints: builder => ({

        login: builder.mutation({
            query: body => (
                {
                    url: `user/login`,
                    method: 'POST',
                    body,
                }
            ),
        }),




    }),
});

export const {
    useLoginMutation,

} = authApi;