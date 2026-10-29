import type { useVideoDetail } from '../../hooks/useVideoDetail';
import type { useVideoPlayer } from '../../hooks/useVideoPlayer';

type Detail = ReturnType<typeof useVideoDetail>;

export interface VideoLayoutProps {
  video: NonNullable<Detail['video']>;
  relatedVideos: Detail['relatedVideos'];
  formattedDuration: Detail['formattedDuration'];
  player: ReturnType<typeof useVideoPlayer>['player'];
  isVideoLoading: boolean;
  onBack: () => void;
}
