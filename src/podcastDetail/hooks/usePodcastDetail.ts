import {
  useGetMediaDetailQuery,
  useGetMediaQuery,
} from '@/src/store/api/mediaApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectMediaDetail,
  selectRelatedPodcasts,
  selectFormattedDuration,
} from '@/src/store/selectors/mediaSelectors';

export function usePodcastDetail(podcastId: string | undefined) {
  // Fetch podcast detail
  const {
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useGetMediaDetailQuery(podcastId!, {
    skip: !podcastId,
  });

  // Fetch related podcasts
  const { isLoading: isListLoading } = useGetMediaQuery(
    { mediaType: 'podcast' },
    { skip: !podcastId }
  );

  // Select data from cache using memoized selectors
  const podcast = useAppSelector(selectMediaDetail(podcastId ?? ''));
  const relatedPodcasts = useAppSelector(selectRelatedPodcasts(podcastId ?? ''));
  const formattedDuration = useAppSelector(selectFormattedDuration(podcastId ?? ''));

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
