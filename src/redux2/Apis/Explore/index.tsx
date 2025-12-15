import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const exploreApi = createApi({
    reducerPath: 'exploreApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: () => '/articles',
        }),
        getMedia: builder.query({
            query: ({ mediaType }) => ({
                url: '/media',
                params: { mediaType }, // 'video' | 'podcast'
            }),
        }),
        getMediaDetail: builder.query({
            query: (id) => `/media/${id}`,
        }),

        getEvents: builder.query({
            query: () => '/events',
        }),
        getEventsDetail: builder.query({
            query: (id) => `/events/${id}`,
        }),
        getCommunities: builder.query({
            query: () => '/communities',
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetMediaQuery,
    useGetMediaDetailQuery,
    useGetEventsQuery,
    useGetEventsDetailQuery,
    useGetCommunitiesQuery,
} = exploreApi;
