import { useEffect, useState } from 'react';
import { useVideoPlayer as useExpoVideoPlayer } from 'expo-video';

interface ProgressData {
  position: number;
  duration: number;
  progress: number;
}

interface UseVideoPlayerOptions {
  initialPosition?: number;
  onProgressUpdate?: (data: ProgressData) => void;
}

export function useVideoPlayer(fileUrl: string | undefined, options: UseVideoPlayerOptions = {}) {
  const { initialPosition = 0, onProgressUpdate } = options;

  const player = useExpoVideoPlayer(fileUrl ? { uri: fileUrl } : null, (videoPlayer) => {
    videoPlayer.timeUpdateEventInterval = 0.5;
    videoPlayer.currentTime = initialPosition / 1000;
    videoPlayer.play();
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const statusSubscription = player.addListener('statusChange', ({ status }) => {
      setIsLoading(status !== 'readyToPlay');
    });
    const timeSubscription = player.addListener('timeUpdate', ({ currentTime }) => {
      const position = currentTime * 1000;
      const duration = player.duration * 1000 || 1;
      const progress = duration > 0 ? (position / duration) * 100 : 0;
      onProgressUpdate?.({ position, duration, progress });
    });

    return () => {
      statusSubscription.remove();
      timeSubscription.remove();
    };
  }, [onProgressUpdate, player]);

  return { player, isLoading };
}
