import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
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

  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  // Progress stored in ref to avoid re-renders on every tick
  const progressRef = useRef<AudioProgressData>({
    position: initialPosition,
    duration: 1,
    progress: 0,
  });

  // Only these cause re-renders
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Playback status handler
  const handlePlaybackStatus = useCallback(
    (status: AVPlaybackStatus) => {
      if (!isMountedRef.current || !status.isLoaded) return;

      const position = status.positionMillis ?? 0;
      const duration = status.durationMillis ?? 1;
      const playing = status.isPlaying ?? false;
      const progress = duration > 0 ? (position / duration) * 100 : 0;

      // Always update the ref (no re-render)
      progressRef.current = { position, duration, progress };

      // Call progress callback if provided
      onProgressUpdate?.({ position, duration, progress });

      // Check if playback completed
      if (status.didJustFinish) {
        onPlaybackComplete?.();
      }

      // Only update state if isPlaying changed or still loading
      setIsPlaying((prev) => (prev !== playing ? playing : prev));
      setIsLoading(false);
    },
    [onProgressUpdate, onPlaybackComplete]
  );

  // Load audio
  useEffect(() => {
    if (!fileUrl) {
      setIsLoading(false);
      return;
    }

    isMountedRef.current = true;

    const loadAudio = async () => {
      try {
        // Unload previous sound if exists
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Configure audio mode for iOS
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: fileUrl },
          {
            shouldPlay: autoPlay,
            positionMillis: initialPosition,
            progressUpdateIntervalMillis: 500,
          },
          handlePlaybackStatus
        );

        soundRef.current = sound;
      } catch (error) {
        console.error('Error loading audio:', error);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadAudio();

    return () => {
      isMountedRef.current = false;
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, [fileUrl]);

  // Play/Pause toggle
  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }, []);

  // Seek to position (milliseconds)
  const seekTo = useCallback(async (positionMs: number) => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        const clampedPosition = Math.max(
          0,
          Math.min(positionMs, status.durationMillis ?? 0)
        );
        await soundRef.current.setPositionAsync(clampedPosition);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, []);

  // Rewind by seconds
  const rewind = useCallback(
    async (seconds: number = 10) => {
      if (!soundRef.current) return;
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await seekTo(status.positionMillis - seconds * 1000);
      }
    },
    [seekTo]
  );

  // Forward by seconds
  const forward = useCallback(
    async (seconds: number = 10) => {
      if (!soundRef.current) return;
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await seekTo(status.positionMillis + seconds * 1000);
      }
    },
    [seekTo]
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
