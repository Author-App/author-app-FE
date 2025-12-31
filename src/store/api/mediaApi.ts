import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  MediaListResponse,
  MediaQueryParams,
  MediaResponse,
} from '@/src/types/api/explore.types';

export interface MediaProgress {
  currentSec: number;
  lastPlayedAt: string;
}

export interface MediaDetailResponse extends MediaResponse {
  moreMedia?: MediaResponse[];
  progress?: MediaProgress;
}


export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Media', 'MediaDetail'],

  endpoints: (builder) => ({
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
    
    getMediaDetail: builder.query<ApiResponse<MediaDetailResponse>, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'MediaDetail', id }],
    }),
  }),
});

export const { useGetMediaQuery, useGetMediaDetailQuery } = mediaApi;
