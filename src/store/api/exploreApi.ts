import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  ArticleListResponse,
  ArticleDetailResponse,
  MediaListResponse,
  MediaQueryParams,
  EventListResponse,
  EventResponse,
  CommunityListResponse,
  ExploreQueryParams,
} from '@/src/types/api/explore.types';
import type {
  CommunityDetailResponse,
  ThreadResponse,
  CreateThreadInput,
} from '@/src/types/api/community.types';

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
      // Cache article list for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * GET /articles/:id
     * Fetches single article by ID
     */
    getArticleDetail: builder.query<ApiResponse<ArticleDetailResponse>, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Articles', id }],
      // Cache article details for 10 minutes
      keepUnusedDataFor: 600,
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
      // Cache media list for 5 minutes
      keepUnusedDataFor: 300,
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
      // Cache events list for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * GET /events/:id
     * Fetches single event by ID
     */
    getEventDetail: builder.query<ApiResponse<EventResponse>, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Events', id }],
      // Cache event details for 10 minutes
      keepUnusedDataFor: 600,
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
      // Cache communities list for 5 minutes
      keepUnusedDataFor: 300,
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

    /**
     * GET /communities/:id
     * Fetches single community by ID with threads
     * Cached for 5 minutes, polled in background for fresh messages
     */
    getCommunityDetail: builder.query<ApiResponse<CommunityDetailResponse>, string>({
      query: (id) => ({
        url: `/communities/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Communities', id }],
      // Keep cached data for 5 minutes after last subscriber unsubscribes
      keepUnusedDataFor: 300,
    }),

    /**
     * POST /communities/:id/threads
     * Send a new thread/message to a community
     */
    sendThread: builder.mutation<ApiResponse<ThreadResponse>, { id: string; body: CreateThreadInput }>({
      query: ({ id, body }) => ({
        url: `/communities/${id}/threads`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Communities', id }],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleDetailQuery,
  useGetMediaQuery,
  useGetEventsQuery,
  useGetEventDetailQuery,
  useGetCommunitiesQuery,
  useGetCommunityDetailQuery,
  useJoinCommunityMutation,
  useExitCommunityMutation,
  useSendThreadMutation,
} = exploreApi;
