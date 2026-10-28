import { useState, useEffect, useCallback, useRef } from 'react';
import { setAudioModeAsync, useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AudioProgressData, UseAudioPlayerOptions } from '../types/types';

export function useAudioPlayer(
  fileUrl: string | undefined,
  options: UseAudioPlayerOptions = {}
) {
  const {
    autoPlay = false,
    initialPosition = 0,
    onProgressUpdate,
    onPlaybackComplete,
  } = options;

  const isMountedRef = useRef(true);
  const player = useExpoAudioPlayer(fileUrl ? { uri: fileUrl } : null, {
    updateInterval: 500,
  });
  const status = useAudioPlayerStatus(player);

  // Progress stored in ref to avoid re-renders on every tick
  const progressRef = useRef<AudioProgressData>({
    position: initialPosition,
    duration: 1,
    progress: 0,
  });

  // Only these cause re-renders
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(Boolean(fileUrl));
    if (!fileUrl) return;

    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          allowsRecording: false,
          interruptionMode: 'doNotMix',
        });
        player.currentTime = initialPosition / 1000;
        if (autoPlay) player.play();
      } catch (error) {
        console.error('Error loading audio:', error);
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    configureAudio();

    return () => {
      isMountedRef.current = false;
    };
  }, [autoPlay, fileUrl, initialPosition, player]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    const position = status.currentTime * 1000;
    const duration = status.duration * 1000 || 1;
    const progress = duration > 0 ? (position / duration) * 100 : 0;
    progressRef.current = { position, duration, progress };
    setIsPlaying(status.playing);
    setIsLoading(Boolean(fileUrl) && !status.isLoaded);
    onProgressUpdate?.({ position, duration, progress });

    if (status.didJustFinish) onPlaybackComplete?.();
  }, [fileUrl, onPlaybackComplete, onProgressUpdate, status]);

  // Play/Pause toggle
  const togglePlayPause = useCallback(async () => {
    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }, [player]);

  // Seek to position (milliseconds)
  const seekTo = useCallback(async (positionMs: number) => {
    try {
      const clampedPosition = Math.max(0, Math.min(positionMs, status.duration * 1000));
      await player.seekTo(clampedPosition / 1000);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, [player, status.duration]);

  // Rewind by seconds
  const rewind = useCallback(
    async (seconds: number = 10) => {
      await seekTo(status.currentTime * 1000 - seconds * 1000);
    },
    [seekTo, status.currentTime]
  );

  // Forward by seconds
  const forward = useCallback(
    async (seconds: number = 10) => {
      await seekTo(status.currentTime * 1000 + seconds * 1000);
    },
    [seekTo, status.currentTime]
  );

  // Format time helper
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    isPlaying,
    isLoading,
    togglePlayPause,
    seekTo,
    rewind,
    forward,
    progressRef,
    formatTime,
  };
}
