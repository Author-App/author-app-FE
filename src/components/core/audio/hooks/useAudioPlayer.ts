import { useState, useEffect, useCallback, useRef } from 'react';
import { setAudioModeAsync, useAudioPlayer as useExpoAudioPlayer } from 'expo-audio';
import type { AudioStatus } from 'expo-audio';
import type { UseAudioPlayerOptions, UseAudioPlayerReturn } from '../types/types';

export function useAudioPlayer(
  fileUrl: string | undefined,
  options: UseAudioPlayerOptions = {}
): UseAudioPlayerReturn {
  const {
    autoPlay = false,
    initialPosition = 0,
    onProgressUpdate,
    onPlaybackComplete,
  } = options;

  const isMountedRef = useRef(true);
  // Seek and autoplay run once per file, not on every status tick
  const hasStartedRef = useRef(false);
  const player = useExpoAudioPlayer(fileUrl ? { uri: fileUrl } : null, {
    updateInterval: 500,
  });

  // Only these cause re-renders. The position lives in ProgressDisplay, which
  // subscribes to the player itself, so a tick re-renders the slider, not the screen
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Latest options for the status listener, so it never needs to resubscribe
  const latest = useRef({ autoPlay, initialPosition, onProgressUpdate, onPlaybackComplete, fileUrl });
  latest.current = { autoPlay, initialPosition, onProgressUpdate, onPlaybackComplete, fileUrl };

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
      } catch (error) {
        console.error('Error loading audio:', error);
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    configureAudio();
    hasStartedRef.current = false;

    return () => {
      isMountedRef.current = false;
    };
  }, [fileUrl]);

  useEffect(() => {
    const onStatus = (status: AudioStatus) => {
      if (!isMountedRef.current) return;
      const { autoPlay, initialPosition, onProgressUpdate, onPlaybackComplete, fileUrl } = latest.current;

      // Same value as before is a no-op for React, so a plain tick renders nothing here
      setIsPlaying(status.playing);
      setIsLoading(Boolean(fileUrl) && !status.isLoaded);

      const position = status.currentTime * 1000;
      const duration = status.duration * 1000 || 1;
      onProgressUpdate?.({ position, duration, progress: (position / duration) * 100 });
      if (status.didJustFinish) onPlaybackComplete?.();

      // Resume and autoplay once the file is loaded: a seek before that can be dropped.
      // expo-audio's currentTime is read-only, so seekTo is the only way to move.
      if (status.isLoaded && !hasStartedRef.current) {
        hasStartedRef.current = true;
        (async () => {
          try {
            if (initialPosition > 0) await player.seekTo(initialPosition / 1000);
            if (autoPlay) player.play();
          } catch (error) {
            console.error('Error starting audio:', error);
          }
        })();
      }
    };

    const subscription = player.addListener('playbackStatusUpdate', onStatus);
    onStatus(player.currentStatus);
    return () => subscription.remove();
  }, [player]);

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

  // Seek to position (milliseconds). Reads the player live, so it never goes stale between ticks.
  const seekTo = useCallback(async (positionMs: number) => {
    try {
      const clampedPosition = Math.max(0, Math.min(positionMs, player.duration * 1000));
      await player.seekTo(clampedPosition / 1000);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, [player]);

  const rewind = useCallback(
    async (seconds: number = 10) => {
      await seekTo(player.currentTime * 1000 - seconds * 1000);
    },
    [seekTo, player]
  );

  const forward = useCallback(
    async (seconds: number = 10) => {
      await seekTo(player.currentTime * 1000 + seconds * 1000);
    },
    [seekTo, player]
  );

  return {
    player,
    isPlaying,
    isLoading,
    togglePlayPause,
    seekTo,
    rewind,
    forward,
  };
}
