/**
 * Media Selectors
 *
 * Memoized selectors for media (podcast/video) API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { mediaApi, type MediaDetailResponse } from '@/src/store/api/mediaApi';
import { formatDuration } from '@/src/utils/helper';
import type { MediaResponse, MediaQueryParams } from '@/src/types/api/explore.types';

/**
 * Create a selector for a specific media detail query result
 */
export const selectMediaDetailResult = (mediaId: string) =>
  mediaApi.endpoints.getMediaDetail.select(mediaId);

/**
 * Create a selector for media list query result
 */
export const selectMediaListResult = (params: MediaQueryParams) =>
  mediaApi.endpoints.getMedia.select(params);

/**
 * Select media detail from cache
 */
export const selectMediaDetail = (mediaId: string) =>
  createSelector(
    [selectMediaDetailResult(mediaId)],
    (result): MediaDetailResponse | undefined => result?.data?.data
  );

/**
 * Select podcasts list from cache
 */
export const selectPodcastsList = createSelector(
  [selectMediaListResult({ mediaType: 'podcast' })],
  (result): MediaResponse[] => result?.data?.data?.media ?? []
);

/**
 * Select videos list from cache
 */
export const selectVideosList = createSelector(
  [selectMediaListResult({ mediaType: 'video' })],
  (result): MediaResponse[] => result?.data?.data?.media ?? []
);

/**
 * Select related podcasts (excluding current)
 */
export const selectRelatedPodcasts = (currentPodcastId: string) =>
  createSelector([selectPodcastsList], (podcasts): MediaResponse[] =>
    podcasts.filter((p) => p.id !== currentPodcastId)
  );

/**
 * Select related videos (excluding current)
 */
export const selectRelatedVideos = (currentVideoId: string) =>
  createSelector([selectVideosList], (videos): MediaResponse[] =>
    videos.filter((v) => v.id !== currentVideoId)
  );

/**
 * Select formatted duration string (e.g., "45 mins")
 */
export const selectFormattedDuration = (mediaId: string) =>
  createSelector([selectMediaDetail(mediaId)], (media): string => {
    if (!media?.durationSec) return '';
    const minutes = Math.floor(media.durationSec / 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  });

/**
 * Select formatted duration for video (e.g., "1:23:45")
 */
export const selectFormattedVideoDuration = (mediaId: string) =>
  createSelector([selectMediaDetail(mediaId)], (media): string => {
    if (!media?.durationSec) return '0:00';
    return formatDuration(media.durationSec);
  });
