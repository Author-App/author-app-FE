import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  MediaListResponse,
  MediaQueryParams,
  MediaResponse,
} from '@/src/types/api/explore.types';

export interface MediaProgress {
  currentPositionSec: number;
  durationSec: number;
  lastPlayedAt: string;
  percentage: number;
  watchedSec: number;
}

export interface MediaDetailResponse extends MediaResponse {
  moreMedia?: MediaResponse[];
  progress?: MediaProgress;
}

export interface UpdateProgressRequest {
  mediaId: string;
  currentPositionSec: number;
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

    updateMediaProgress: builder.mutation<ApiResponse<{ message: string }>, UpdateProgressRequest>({
      query: ({ mediaId, currentPositionSec }) => ({
        url: `/media/${mediaId}/progress`,
        method: 'PUT',
        body: { currentPositionSec },
      }),
      // Invalidate the media detail cache so it refetches with new progress
      invalidatesTags: (result, error, { mediaId }) => [
        { type: 'MediaDetail', id: mediaId },
      ],
    }),
  }),
});

export const { 
  useGetMediaQuery, 
  useGetMediaDetailQuery,
  useUpdateMediaProgressMutation,
} = mediaApi;
