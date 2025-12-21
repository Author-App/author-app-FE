import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: builder => ({
    getMe: builder.query({
      query: () => `/auth/me`,
      providesTags: ["User"],
    }),

    // Update profile (name)
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Upload profile image
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "/profile/upload-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // Get profile image
    getProfileImage: builder.query({
      query: () => `/profile/image`,
    }),

    changePassword: builder.mutation({
      query: (formData) => ({
        url: '/password/change',
        method: 'POST',
        body: formData,
        // formData: true,
      }),
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/account',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useGetProfileImageQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;


// import { createApi } from "@reduxjs/toolkit/query/react";
// import baseQueryWithReauth from "../../Services/baseQuery";

// export const userApi = createApi({
//   reducerPath: "userApi",
//   baseQuery: baseQueryWithReauth,
//   endpoints: builder => ({
//     getMe: builder.query({
//       query: () => `/auth/me`,
//     }),
//   }),
// });


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const userApi = createApi({
//     reducerPath: 'userApi',

//     baseQuery: fetchBaseQuery({
//         baseUrl:
//             'https://custom-dev.onlinetestingserver.com/bloom-backend/api/',

//         prepareHeaders: (headers, { getState }: any) => {
//             headers.set('Accept', `application/json`);
//             let token = getState()?.auth?.token
//             if (token) {
//                 headers.set('Authorization', `Bearer ${token}`)
//             }
//             return headers;
//         },
//     }),

//     endpoints: builder => ({



//         // Get ---------------------------------------------------------------------------------------------------------------------------------------------
//         getUserProfile: builder.query<any, void>({
//             query: () => 'coach/profile',
//         }),

//         getAboutUs: builder.query<any, void>({
//             query: () => 'user/page/about-us',
//         }),

//         getTermsAndConditions: builder.query<any, void>({
//             query: () => 'user/page/terms-conditions',
//         }),

//         getHome: builder.query<any, void>({
//             query: () => 'coach/home',
//         }),

//         getNotifications: builder.query({
//             query: ({ page, type }) => ({
//                 url: `coach/notification/${type}/list`,
//                 method: 'GET',
//                 params: page
//             }),
//         }),

//         getTotalEarnings: builder.query({
//             query: (params) => ({ url: `coach/dashboard/earning/graph-app`, method: 'GET', params: params })
//         }),

//         getTotalBookings: builder.query({
//             query: (params) => ({ url: `coach/dashboard/booking/graph-app`, method: 'GET', params: params })
//         }),

//         getTotalUsers: builder.query({
//             query: (params) => ({ url: `coach/dashboard/users/graph-app`, method: 'GET', params: params })
//         }),

//         deleteAccount: builder.query<any, void>({
//             query: () => 'coach/delete-account',
//         }),



//         // Post --------------------------------------------------------------------------------------------------------------------------------------------
//         changePassword: builder.mutation<any, FormData>({
//             query: formData => ({
//                 url: 'coach/change-password',
//                 method: 'POST',
//                 body: formData,
//                 formData: true,
//             }),
//         }),

//         updateProfile: builder.mutation<any, { coach_id: string; formData: FormData }>({
//             query: ({ coach_id, formData }) => ({
//                 url: `coach/${coach_id}/update`,
//                 method: 'POST',
//                 body: formData,
//                 formData: true,
//             }),
//         }),

//         markNotification: builder.mutation({
//             query: ({ type, formData }: { type: 'read' | 'unread'; formData: FormData }) => ({
//                 url: `coach/notification/${type}`,
//                 method: 'POST',
//                 body: formData,
//             }),
//         }),



//     }),
// });

// export const {



//     // Get ---------------------------------------------------------------------------------------------------------------------------------------------
//     useGetUserProfileQuery,
//     useGetAboutUsQuery,
//     useGetTermsAndConditionsQuery,
//     useGetHomeQuery,
//     useGetNotificationsQuery,
//     useGetTotalBookingsQuery,
//     useGetTotalEarningsQuery,
//     useGetTotalUsersQuery,
//     useLazyDeleteAccountQuery,



//     // Post ---------------------------------------------------------------------------------------------------------------------------------------------
//     useChangePasswordMutation,
//     useUpdateProfileMutation,
//     useMarkNotificationMutation,



// } = userApi;