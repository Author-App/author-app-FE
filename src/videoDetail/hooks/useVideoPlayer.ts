import { useRef, useState, useCallback } from 'react';
import { Video, AVPlaybackStatus } from 'expo-av';

interface ProgressData {
  position: number;
  duration: number;
  progress: number;
}

interface UseVideoPlayerOptions {
  initialPosition?: number;
  onProgressUpdate?: (data: ProgressData) => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const { initialPosition = 0, onProgressUpdate } = options;

  const videoRef = useRef<Video>(null);
  const progressRef = useRef<ProgressData>({
    position: initialPosition,
    duration: 1,
    progress: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle playback status updates
  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        setIsLoading(true);
        return;
      }

      setIsLoading(false);
      setIsPlaying(status.isPlaying);

      const position = status.positionMillis ?? 0;
      const duration = status.durationMillis ?? 1;
      const progress = duration > 0 ? (position / duration) * 100 : 0;

      progressRef.current = { position, duration, progress };
      onProgressUpdate?.({ position, duration, progress });
    },
    [onProgressUpdate]
  );

  // Seek to position
  const seekTo = useCallback(async (positionMs: number) => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.setPositionAsync(positionMs);
    } catch (error) {
      console.error('Error seeking video:', error);
    }
  }, []);

  // Play video
  const play = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.playAsync();
    } catch (error) {
      console.error('Error playing video:', error);
    }
  }, []);

  // Pause video
  const pause = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.pauseAsync();
    } catch (error) {
      console.error('Error pausing video:', error);
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  return {
    videoRef,
    progressRef,
    isPlaying,
    isLoading,
    handlePlaybackStatusUpdate,
    seekTo,
    play,
    pause,
    togglePlayPause,
  };
}
