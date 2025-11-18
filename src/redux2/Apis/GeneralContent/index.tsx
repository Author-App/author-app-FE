// GeneralContent

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const generalContentApi = createApi({
    reducerPath: 'generalContentApi',

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
        getAboutUs: builder.query<any, void>({
            query: () => 'user/page/about-us',
        }),

        // Post ---------------------------------------------------------------------------------------------------------------------------------------------
        contactUs: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'user/page/contact-us',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),


    }),
});

export const {



    // Get ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetAboutUsQuery,


    // Post ---------------------------------------------------------------------------------------------------------------------------------------------
    useContactUsMutation


} = generalContentApi;