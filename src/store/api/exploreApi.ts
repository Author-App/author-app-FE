/**
 * Explore API
 *
 * Endpoints for explore screen: articles, media, events, communities.
 * Uses baseQueryWithReauth for automatic token refresh.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  ArticleListResponse,
  MediaListResponse,
  MediaQueryParams,
  EventListResponse,
  CommunityListResponse,
  ExploreQueryParams,
} from '@/src/types/api/explore.types';

export const exploreApi = createApi({
  reducerPath: 'exploreApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Articles', 'Media', 'Events', 'Communities'],

  endpoints: (builder) => ({
    /**
     * GET /articles
     * Fetches list of blog articles
     */
    getArticles: builder.query<ApiResponse<ArticleListResponse>, ExploreQueryParams | void>({
      query: (params) => ({
        url: '/articles',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Articles'],
    }),

    /**
     * GET /media?mediaType=podcast|video
     * Fetches list of podcasts or videos
     */
    getMedia: builder.query<ApiResponse<MediaListResponse>, MediaQueryParams>({
      query: ({ mediaType, page, limit }) => ({
        url: '/media',
        method: 'GET',
        params: { mediaType, page, limit },
      }),
      providesTags: (result, error, { mediaType }) => [
        { type: 'Media', id: mediaType },
      ],
    }),

    /**
     * GET /events
     * Fetches list of events
     */
    getEvents: builder.query<ApiResponse<EventListResponse>, ExploreQueryParams | void>({
      query: (params) => ({
        url: '/events',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Events'],
    }),

    /**
     * GET /communities
     * Fetches list of communities
     */
    getCommunities: builder.query<ApiResponse<CommunityListResponse>, ExploreQueryParams | void>({
      query: (params) => ({
        url: '/communities',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Communities'],
    }),

    /**
     * POST /communities/:id/join
     * Join a community
     */
    joinCommunity: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/communities/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['Communities'],
    }),

    /**
     * POST /communities/:id/exit
     * Exit a community
     */
    exitCommunity: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/communities/${id}/exit`,
        method: 'POST',
      }),
      invalidatesTags: ['Communities'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetMediaQuery,
  useGetEventsQuery,
  useGetCommunitiesQuery,
  useJoinCommunityMutation,
  useExitCommunityMutation,
} = exploreApi;
