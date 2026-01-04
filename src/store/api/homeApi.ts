import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type { HomeFeedResponse } from '@/src/types/api/home.types';

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['HomeFeed'],

  endpoints: (builder) => ({
    /**
     * GET /home
     * Fetches main home feed with banner, trending books, articles, audiobooks
     */
    getHomeFeed: builder.query<ApiResponse<HomeFeedResponse>, void>({
      query: () => ({
        url: '/home',
        method: 'GET',
      }),
      providesTags: ['HomeFeed'],
      // Cache home feed for 5 minutes - content doesn't change frequently
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetHomeFeedQuery } = homeApi;
