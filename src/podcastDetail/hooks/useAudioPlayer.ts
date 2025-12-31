/**
 * Audio Player Hook
 *
 * Manages audio playback with expo-av.
 * Optimized to prevent unnecessary re-renders during playback.
 * 
 * Key optimization: Progress/position updates are stored in refs,
 * not state, to prevent re-render spam. Only isPlaying/isLoading
 * trigger re-renders.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface AudioControlState {
  isPlaying: boolean;
  isLoading: boolean;
}

interface ProgressData {
  position: number;
  duration: number;
  progress: number;
}

interface UseAudioPlayerOptions {
  autoPlay?: boolean;
  initialPosition?: number;
  onProgressUpdate?: (data: ProgressData) => void;
}

export function useAudioPlayer(
  fileUrl: string | undefined,
  options: UseAudioPlayerOptions = {}
) {
  const { autoPlay = true, initialPosition = 0, onProgressUpdate } = options;

  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);
  
  // Progress stored in ref to avoid re-renders
  const progressRef = useRef<ProgressData>({
    position: initialPosition,
    duration: 1,
    progress: 0,
  });

  // Only these cause re-renders
  const [controlState, setControlState] = useState<AudioControlState>({
    isPlaying: false,
    isLoading: true,
  });

  // Playback status handler - only updates state for play/pause changes
  const handlePlaybackStatus = useCallback(
    (status: AVPlaybackStatus) => {
      if (!isMountedRef.current || !status.isLoaded) return;

      const position = status.positionMillis ?? 0;
      const duration = status.durationMillis ?? 1;
      const isPlaying = status.isPlaying ?? false;
      const progress = duration > 0 ? (position / duration) * 100 : 0;

      // Always update the ref (no re-render)
      progressRef.current = { position, duration, progress };
      
      // Call progress callback if provided
      onProgressUpdate?.({ position, duration, progress });

      // Only update state if isPlaying changed or still loading
      setControlState((prev) => {
        if (prev.isPlaying !== isPlaying || prev.isLoading) {
          return { isPlaying, isLoading: false };
        }
        return prev; // Return same reference = no re-render
      });
    },
    [onProgressUpdate]
  );

  // Load audio
  useEffect(() => {
    if (!fileUrl) {
      setControlState((prev) => ({ ...prev, isLoading: false }));
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

        console.log('🎧 [useAudioPlayer] Loading audio | initialPosition:', initialPosition, 'ms');

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
        console.log('✅ [useAudioPlayer] Audio loaded successfully');
      } catch (error) {
        console.error('Error loading audio:', error);
        if (isMountedRef.current) {
          setControlState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadAudio();

    return () => {
      isMountedRef.current = false;
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, [fileUrl, initialPosition]);

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
  const rewind = useCallback(async (seconds: number = 10) => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded) {
      await seekTo(status.positionMillis - seconds * 1000);
    }
  }, [seekTo]);

  // Forward by seconds
  const forward = useCallback(async (seconds: number = 10) => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded) {
      await seekTo(status.positionMillis + seconds * 1000);
    }
  }, [seekTo]);

  // Get current progress (reads from ref, doesn't cause re-render)
  const getProgress = useCallback(() => progressRef.current, []);

  // Format time helper
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Stable reference for controls
  const controls = useMemo(() => ({
    togglePlayPause,
    seekTo,
    rewind,
    forward,
    getProgress,
    formatTime,
  }), [togglePlayPause, seekTo, rewind, forward, getProgress, formatTime]);

  return {
    ...controlState,
    ...controls,
    // Initial values for components that need them on first render
    progressRef,
  };
}
