import { useMemo } from 'react';
import { useGetMediaDetailQuery, useGetMediaQuery } from '@/src/store/api/mediaApi';
import { formatDuration } from '@/src/utils/helper';
import type { MediaResponse } from '@/src/videoDetail/types/videoDetail.types';

export function useVideoDetail(videoId: string | undefined) {
  // Fetch video details
  const {
    data: videoData,
    isLoading: isVideoLoading,
    isError: isVideoError,
    refetch,
  } = useGetMediaDetailQuery(videoId!, {
    skip: !videoId,
  });

  // Fetch related videos
  const { data: mediaList, isLoading: isMediaLoading } = useGetMediaQuery(
    { mediaType: 'video' },
    { skip: !videoId }
  );

  const video = videoData?.data;

  // Filter out current video from related list
  const relatedVideos = useMemo(() => {
    if (!mediaList?.data?.media || !videoId) return [];
    return mediaList.data.media.filter(
      (v: MediaResponse) => String(v.id) !== videoId
    );
  }, [mediaList?.data?.media, videoId]);

  // Format duration for display
  const formattedDuration = useMemo(() => {
    if (!video?.durationSec) return '0:00';
    return formatDuration(video.durationSec);
  }, [video?.durationSec]);

  return {
    video,
    relatedVideos,
    formattedDuration,
    isLoading: isVideoLoading || isMediaLoading,
    isError: isVideoError,
    refetch,
  };
}
