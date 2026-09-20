import { useEffect, useState, useCallback, useRef } from 'react';
import { useVideoPlayer as useExpoVideoPlayer, type VideoPlayer } from 'expo-video';

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
  const progressRef = useRef<ProgressData>({
    position: initialPosition,
    duration: 1,
    progress: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const statusSubscription = player.addListener('statusChange', ({ status }) => {
      setIsLoading(status !== 'readyToPlay');
    });
    const playingSubscription = player.addListener('playingChange', ({ isPlaying: playing }) => {
      setIsPlaying(playing);
    });
    const timeSubscription = player.addListener('timeUpdate', ({ currentTime }) => {
      const position = currentTime * 1000;
      const duration = player.duration * 1000 || 1;
      const progress = duration > 0 ? (position / duration) * 100 : 0;
      progressRef.current = { position, duration, progress };
      onProgressUpdate?.({ position, duration, progress });
    });

    return () => {
      statusSubscription.remove();
      playingSubscription.remove();
      timeSubscription.remove();
    };
  }, [onProgressUpdate, player]);

  // Seek to position
  const seekTo = useCallback(async (positionMs: number) => {
    try {
      player.currentTime = positionMs / 1000;
    } catch (error) {
      console.error('Error seeking video:', error);
    }
  }, [player]);

  // Play video
  const play = useCallback(async () => {
    try {
      player.play();
    } catch (error) {
      console.error('Error playing video:', error);
    }
  }, [player]);

  // Pause video
  const pause = useCallback(async () => {
    try {
      player.pause();
    } catch (error) {
      console.error('Error pausing video:', error);
    }
  }, [player]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  return {
    player,
    progressRef,
    isPlaying,
    isLoading,
    seekTo,
    play,
    pause,
    togglePlayPause,
  };
}
