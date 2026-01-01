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
     * GET /articles/:id
     * Fetches single article by ID
     */
    getArticleDetail: builder.query<ApiResponse<ArticleDetailResponse>, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Articles', id }],
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
     * GET /events/:id
     * Fetches single event by ID
     */
    getEventDetail: builder.query<ApiResponse<EventResponse>, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Events', id }],
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
  useGetArticleDetailQuery,
  useGetMediaQuery,
  useGetEventsQuery,
  useGetEventDetailQuery,
  useGetCommunitiesQuery,
  useJoinCommunityMutation,
  useExitCommunityMutation,
} = exploreApi;
