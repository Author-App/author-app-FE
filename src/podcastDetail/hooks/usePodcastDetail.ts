import { useMemo } from 'react';
import {
  useGetMediaDetailQuery,
  useGetMediaQuery,
} from '@/src/store/api/mediaApi';
import type { MediaResponse } from '@/src/podcastDetail/types/podcastDetail.types';

export function usePodcastDetail(podcastId: string | undefined) {
  // Fetch podcast detail
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useGetMediaDetailQuery(podcastId!, {
    skip: !podcastId,
  });

  // Fetch related podcasts
  const {
    data: listData,
    isLoading: isListLoading,
  } = useGetMediaQuery(
    { mediaType: 'podcast' },
    { skip: !podcastId }
  );

  // Extract podcast detail
  const podcast = detailData?.data;

  // Filter related podcasts (exclude current)
  const relatedPodcasts: MediaResponse[] = useMemo(() => {
    if (!listData?.data?.media || !podcastId) return [];
    return listData.data.media.filter((p) => p.id !== podcastId);
  }, [listData?.data?.media, podcastId]);

  // Format duration for display
  const formattedDuration = useMemo(() => {
    if (!podcast?.durationSec) return '';
    const minutes = Math.floor(podcast.durationSec / 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }, [podcast?.durationSec]);

  return {
    // Data
    podcast,
    relatedPodcasts,
    formattedDuration,
    // Loading states
    isLoading: isDetailLoading,
    isListLoading,
    // Error states
    isError: isDetailError,
    // Actions
    refetch: refetchDetail,
  };
}
