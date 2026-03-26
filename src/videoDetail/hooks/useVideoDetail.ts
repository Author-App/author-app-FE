import { useGetMediaDetailQuery, useGetMediaQuery } from '@/src/store/api/mediaApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectMediaDetail,
  selectRelatedVideos,
  selectFormattedVideoDuration,
} from '@/src/store/selectors/mediaSelectors';

export function useVideoDetail(videoId: string | undefined) {
  // Fetch video details
  const {
    isLoading: isVideoLoading,
    isError: isVideoError,
    refetch,
  } = useGetMediaDetailQuery(videoId!, {
    skip: !videoId,
  });

  // Fetch related videos
  const { isLoading: isMediaLoading } = useGetMediaQuery(
    { mediaType: 'video' },
    { skip: !videoId }
  );

  // Select data from cache using memoized selectors
  const video = useAppSelector(selectMediaDetail(videoId ?? ''));
  const relatedVideos = useAppSelector(selectRelatedVideos(videoId ?? ''));
  const formattedDuration = useAppSelector(selectFormattedVideoDuration(videoId ?? ''));

  return {
    video,
    relatedVideos,
    formattedDuration,
    isLoading: isVideoLoading || isMediaLoading,
    isError: isVideoError,
    refetch,
  };
}
