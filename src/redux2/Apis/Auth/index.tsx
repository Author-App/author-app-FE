import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../../Services/baseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',

    // baseQuery: baseQueryWithReauth,

        baseQuery: fetchBaseQuery({
            baseUrl:
                "https://api-dev.stanleypaden.com/api/v1",

            prepareHeaders: (headers, { }) => {
                headers.set('Accept', `application/json`);
                return headers;
            },
        }),

    endpoints: builder => ({

        login: builder.mutation({
            query: body => ({
                url: `/auth/login`,
                method: 'POST',
                body,
            }),
        }),

        signup: builder.mutation({
            query: body => ({
                url: `/auth/signup`,
                method: 'POST',
                body,
            }),
        }),

        forgotPassword: builder.mutation({
            query: body => ({
                url: `/password/forgot`,
                method: 'POST',
                body,
            }),
        }),

        verifycode: builder.mutation({
            query: ({ token, code }) => ({
                url: `/password/verify`,
                method: 'POST',
                headers: {
                    'x-forgot-password': token,
                },
                body: { code },
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `/password/reset`,
                method: 'POST',
                headers: {
                    'x-reset-password': token,
                },
                body: { password },
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



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//     reducerPath: 'authApi',

//     baseQuery: fetchBaseQuery({
//         baseUrl:
//             'http://98.94.201.120/api/v1',

//         prepareHeaders: (headers, { }) => {
//             headers.set('Accept', `application/json`);
//             return headers;
//         },
//     }),

//     endpoints: builder => ({

//         login: builder.mutation({
//             query: body => (
//                 {
//                     url: `/auth/login`,
//                     method: 'POST',
//                     body,
//                 }
//             ),
//         }),

//         signup: builder.mutation({
//             query: body => (
//                 {
//                     url: `/auth/signup`,
//                     method: 'POST',
//                     body,
//                 }
//             ),
//         }),

//         forgotPassword: builder.mutation({
//             query: body => ({
//                 url: `/password/forgot`,
//                 method: 'POST',
//                 body,
//             }),
//         }),

//         verifycode: builder.mutation({
//             query: ({ token, code }) => ({
//                 url: `/password/verify`,
//                 method: 'POST',
//                 headers: {
//                     'x-forgot-password': token,
//                 },
//                 body: {
//                     code,
//                 },
//             }),
//         }),

//         resetPassword: builder.mutation({

//             query: ({ token, password }) => ({
//                 url: `/password/reset`,
//                 method: 'POST',
//                 headers: {
//                     'x-reset-password': token,
//                 },
//                 body: {
//                     password,
//                 },
//             }),
//             // query: (formData) => ({
//             //     url: '/password/reset',
//             //     method: 'POST',
//             //     body: formData,
//             // }),
//         }),




//     }),
// });

// export const {
//     useLoginMutation,
//     useSignupMutation,
//     useForgotPasswordMutation,
//     useVerifycodeMutation,
//     useResetPasswordMutation,

// } = authApi;