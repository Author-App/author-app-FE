import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery: fetchBaseQuery({
        baseUrl:
            'http://98.94.201.120/api/v1',

        prepareHeaders: (headers, { }) => {
            headers.set('Accept', `application/json`);
            return headers;
        },
    }),

    endpoints: builder => ({

        login: builder.mutation({
            query: body => (
                {
                    url: `/auth/login`,
                    method: 'POST',
                    body,
                }
            ),
        }),

        signup: builder.mutation({
            query: body => (
                {
                    url: `/auth/signup`,
                    method: 'POST',
                    body,
                }
            ),
        }),

        forgotPassword: builder.mutation({
            query: body => ({
                url: `/password/forgot`,
                method: 'POST',
                body,
            }),
        }),

        verifycode: builder.mutation({
            query: body => ({
                url: `/password/verify`,
                method: 'POST',
                body,
            }),
        }),

        resetPassword: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/password/reset',
                method: 'POST',
                body: formData,
            }),
        }),
        
        


    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useForgotPasswordMutation,
    useVerifycodeMutation,
    useResetPasswordMutation,
    
} = authApi;