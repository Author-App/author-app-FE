import type { useAudioPlayer } from '@/src/components/core/audio';
import type { usePodcastDetail } from '../../hooks/usePodcastDetail';

type Detail = ReturnType<typeof usePodcastDetail>;

export interface PodcastLayoutProps {
  podcast: NonNullable<Detail['podcast']>;
  relatedPodcasts: Detail['relatedPodcasts'];
  formattedDuration: Detail['formattedDuration'];
  audio: ReturnType<typeof useAudioPlayer>;
  onBack: () => void;
}
