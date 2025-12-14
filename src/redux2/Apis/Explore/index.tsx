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
        // getPodcasts: builder.query({
        //     query: () => '/podcasts',
        // }),
        // getVideos: builder.query({
        //     query: () => '/videos',
        // }),
        getEvents: builder.query({
            query: () => '/events',
        }),
        getCommunities: builder.query({
            query: () => '/communities',
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetMediaQuery,
    useGetEventsQuery,
    useGetCommunitiesQuery,
} = exploreApi;
