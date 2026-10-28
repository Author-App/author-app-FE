import React, { memo, useState, useRef, useCallback } from 'react';
import { useAudioPlayerStatus } from 'expo-audio';
import type { AudioPlayer as ExpoAudioPlayer } from 'expo-audio';
import { AccessibilityActionEvent, StyleSheet } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import IconRewind10 from '@/assets/icons/iconRewind10';
import IconForward10 from '@/assets/icons/iconForward10';
import UText from '@/src/components/core/text/uText';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import haptics from '@/src/utils/haptics';

import type { UseAudioPlayerReturn } from './types/types';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const A11Y_STEP_MS = 30_000;
const A11Y_ACTIONS = [{ name: 'increment' }, { name: 'decrement' }];

interface ProgressDisplayProps {
  player: ExpoAudioPlayer;
  onSeek?: (positionMs: number) => void;
}

// The only component that listens to every status tick, so a tick re-renders this, not the screen
const ProgressDisplay = memo(function ProgressDisplay({ player, onSeek }: ProgressDisplayProps) {
  const status = useAudioPlayerStatus(player);
  // Set only while the thumb is held: the Slider also fires onValueChange when its value prop moves
  const [dragValue, setDragValue] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  const duration = status.duration * 1000 || 1;
  const progress = dragValue ?? ((status.currentTime * 1000) / duration) * 100;
  const position = (progress / 100) * duration;

  const handleSliderStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleSliderChange = useCallback((value: number) => {
    if (isDraggingRef.current) setDragValue(value);
  }, []);

  const handleSliderComplete = useCallback(
    (value: number) => {
      haptics.selection();
      isDraggingRef.current = false;
      setDragValue(null);
      onSeek?.((value / 100) * duration);
    },
    [onSeek, duration]
  );

  // VoiceOver: swipe up or down on the slider to skip 30 seconds
  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      const step = event.nativeEvent.actionName === 'increment' ? A11Y_STEP_MS : -A11Y_STEP_MS;
      onSeek?.(Math.min(Math.max(position + step, 0), duration));
    },
    [onSeek, position, duration]
  );

  return (
    <YStack gap={8}>
      <Slider
        style={styles.slider}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Playback position"
        accessibilityValue={{ text: `${formatTime(position)} of ${formatTime(duration)}` }}
        accessibilityActions={A11Y_ACTIONS}
        onAccessibilityAction={handleAccessibilityAction}
        value={progress}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={getTokenValue('$accentCyan', 'color')}
        maximumTrackTintColor={getTokenValue('$track', 'color')}
        thumbTintColor={getTokenValue('$textPrimary', 'color')}
        onSlidingStart={handleSliderStart}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSliderComplete}
      />

      {/* Time display */}
      <XStack jc="space-between" px={4}>
        <UText variant="meta-s" color="$accentCyan">
          {formatTime(position)}
        </UText>
        <UText variant="meta-s" color="$textMuted">
          {formatTime(duration)}
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
        accessible
        accessibilityRole="button"
        accessibilityLabel="Rewind 10 seconds"
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
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
        boxShadow="0 0 24px rgba(0,240,255,0.35)"
        opacity={isLoading ? 0.5 : 1}
        onPress={onPlayPause}
        disabled={isLoading}
        accessible
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        accessibilityState={{ disabled: isLoading, busy: isLoading }}
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
      >
        <UCtaGradient radius={36} />
        {/* The play glyph sits a little left of centre, so nudge it */}
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={30}
          color={getTokenValue('$textPrimary', 'color')}
          style={isPlaying ? undefined : styles.playGlyph}
        />
      </YStack>

      {/* Forward 10s */}
      <YStack
        w={52}
        h={52}
        ai="center"
        jc="center"
        onPress={onForward}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Forward 10 seconds"
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
      >
        <IconForward10 dimen={36} />
      </YStack>
    </XStack>
  );
});

interface AudioPlayerProps {
  /** From useAudioPlayer, called by the screen so other controls (the mini player) share one player */
  audio: UseAudioPlayerReturn;
}

export const AudioPlayer = memo(function AudioPlayer({ audio }: AudioPlayerProps) {
  const { player, isPlaying, isLoading, togglePlayPause, seekTo, rewind, forward } = audio;

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
      <ProgressDisplay player={player} onSeek={seekTo} />

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
  playGlyph: { marginLeft: 3 },
});
