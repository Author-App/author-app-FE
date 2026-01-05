import React, { memo, useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { XStack, YStack } from 'tamagui';
import Slider from '@react-native-community/slider';

import IconPlayCircle from '@/assets/icons/iconPlayCircle';
import IconPauseCircle from '@/assets/icons/iconPauseCircle';
import IconRewind10 from '@/assets/icons/iconRewind10';
import IconForward10 from '@/assets/icons/iconForward10';
import UText from '@/src/components/core/text/uText';
import haptics from '@/src/utils/haptics';

import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { AudioProgressData } from './types/types';

interface ProgressDisplayProps {
  isPlaying: boolean;
  progressRef: React.MutableRefObject<AudioProgressData>;
  formatTime: (ms: number) => string;
  onSeek?: (positionMs: number) => void;
}

const ProgressDisplay = memo(function ProgressDisplay({
  isPlaying,
  progressRef,
  formatTime,
  onSeek,
}: ProgressDisplayProps) {
  const [displayProgress, setDisplayProgress] = useState({
    progress: 0,
    position: 0,
    duration: 1,
    positionText: '0:00',
    durationText: '0:00',
  });

  const [isSeeking, setIsSeeking] = useState(false);

  // Update progress display using interval when playing
  useEffect(() => {
    const updateProgress = () => {
      if (isSeeking) return;
      const current = progressRef.current;
      setDisplayProgress({
        progress: current.progress,
        position: current.position,
        duration: current.duration,
        positionText: formatTime(current.position),
        durationText: formatTime(current.duration),
      });
    };

    updateProgress();

    if (!isPlaying) return;

    const intervalId = setInterval(updateProgress, 500);
    return () => clearInterval(intervalId);
  }, [isPlaying, progressRef, formatTime, isSeeking]);

  const handleSliderStart = useCallback(() => {
    setIsSeeking(true);
  }, []);

  const handleSliderChange = useCallback(
    (value: number) => {
      const newPosition = (value / 100) * displayProgress.duration;
      setDisplayProgress((prev) => ({
        ...prev,
        position: newPosition,
        progress: value,
        positionText: formatTime(newPosition),
      }));
    },
    [displayProgress.duration, formatTime]
  );

  const handleSliderComplete = useCallback(
    (value: number) => {
      haptics.selection();
      setIsSeeking(false);
      const newPosition = (value / 100) * progressRef.current.duration;
      onSeek?.(newPosition);
    },
    [onSeek, progressRef]
  );

  return (
    <YStack gap={8}>
      <Slider
        style={styles.slider}
        value={displayProgress.progress}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#8B1538"
        maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        thumbTintColor="#FFFFFF"
        onSlidingStart={handleSliderStart}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSliderComplete}
      />

      {/* Time display */}
      <XStack jc="space-between" px={4}>
        <UText variant="text-xs" color="$neutral3">
          {displayProgress.positionText}
        </UText>
        <UText variant="text-xs" color="$neutral3">
          {displayProgress.durationText}
        </UText>
      </XStack>
    </YStack>
  );
});

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
}

const PlayerControls = memo(function PlayerControls({
  isPlaying,
  isLoading,
  onPlayPause,
  onRewind,
  onForward,
}: PlayerControlsProps) {
  return (
    <XStack jc="center" ai="center" gap={40}>
      {/* Rewind 10s */}
      <YStack
        w={52}
        h={52}
        ai="center"
        jc="center"
        onPress={onRewind}
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
        animation="quick"
      >
        <IconRewind10 dimen={36} />
      </YStack>

      {/* Play/Pause */}
      <YStack
        w={72}
        h={72}
        br={36}
        ai="center"
        jc="center"
        overflow="hidden"
        opacity={isLoading ? 0.5 : 1}
        onPress={onPlayPause}
        disabled={isLoading}
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
        animation="quick"
      >
        <LinearGradient
          colors={['#A91D3A', '#8B1538', '#6B1028']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {isPlaying ? (
          <IconPauseCircle dimen={32} />
        ) : (
          <IconPlayCircle dimen={36} />
        )}
      </YStack>

      {/* Forward 10s */}
      <YStack
        w={52}
        h={52}
        ai="center"
        jc="center"
        onPress={onForward}
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
        animation="quick"
      >
        <IconForward10 dimen={36} />
      </YStack>
    </XStack>
  );
});

interface AudioPlayerProps {
  audioUrl: string | undefined;
  autoPlay?: boolean;
  initialPosition?: number;
  onProgressUpdate?: (data: AudioProgressData) => void;
  onPlaybackComplete?: () => void;
}

export const AudioPlayer = memo(function AudioPlayer({
  audioUrl,
  autoPlay = false,
  initialPosition = 0,
  onProgressUpdate,
  onPlaybackComplete,
}: AudioPlayerProps) {
  const {
    isPlaying,
    isLoading,
    togglePlayPause,
    seekTo,
    rewind,
    forward,
    progressRef,
    formatTime,
  } = useAudioPlayer(audioUrl, {
    autoPlay,
    initialPosition,
    onProgressUpdate,
    onPlaybackComplete,
  });

  const handleRewind = useCallback(() => {
    haptics.light();
    rewind(10);
  }, [rewind]);

  const handleForward = useCallback(() => {
    haptics.light();
    forward(10);
  }, [forward]);

  const handlePlayPause = useCallback(() => {
    haptics.medium();
    togglePlayPause();
  }, [togglePlayPause]);

  return (
    <YStack gap={24}>
      {/* Progress Slider */}
      <ProgressDisplay
        isPlaying={isPlaying}
        progressRef={progressRef}
        formatTime={formatTime}
        onSeek={seekTo}
      />

      {/* Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        isLoading={isLoading}
        onPlayPause={handlePlayPause}
        onRewind={handleRewind}
        onForward={handleForward}
      />
    </YStack>
  );
});

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  },
});
